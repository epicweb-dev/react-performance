import path from 'node:path'
import { performance } from 'perf_hooks'
import { fileURLToPath } from 'url'
import {
	getApps,
	getAppDisplayName,
} from '@epic-web/workshop-utils/apps.server'
import enquirer from 'enquirer'
import { execa } from 'execa'
import { matchSorter } from 'match-sorter'
import pLimit from 'p-limit'

const { prompt } = enquirer

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function captureOutput() {
	const output = []
	return {
		write: (chunk, streamType) => {
			output.push({ chunk: chunk.toString(), streamType })
		},
		replay: () => {
			for (const { chunk, streamType } of output) {
				if (streamType === 'stderr') {
					process.stderr.write(chunk)
				} else {
					process.stdout.write(chunk)
				}
			}
		},
		hasOutput: () => output.length > 0,
	}
}

function printTestSummary(results) {
	const label = '--- Test Summary ---'
	console.log(`\n${label}`)
	for (const [appPath, { result, duration }] of results) {
		let emoji
		switch (result) {
			case 'Passed':
				emoji = '✅'
				break
			case 'Failed':
				emoji = '❌'
				break
			case 'Error':
				emoji = '💥'
				break
			case 'Incomplete':
				emoji = '⏳'
				break
			default:
				emoji = '❓'
		}
		console.log(`${emoji} ${appPath} (${duration.toFixed(2)}s)`)
	}
	console.log(`${'-'.repeat(label.length)}\n`)
}

async function main() {
	const allApps = (await getApps()).filter((app) => app.test.type === 'script')

	let selectedApps
	let additionalArgs = []

	// Parse command-line arguments
	const argIndex = process.argv.indexOf('--')
	if (argIndex !== -1) {
		additionalArgs = process.argv.slice(argIndex + 1)
		process.argv = process.argv.slice(0, argIndex)
	}

	if (process.argv[2]) {
		const patterns = process.argv[2].toLowerCase().split(',')
		selectedApps = allApps.filter((app) => {
			const { exerciseNumber, stepNumber, type } = app

			return patterns.some((pattern) => {
				let [patternExercise = '*', patternStep = '*', patternType = '*'] =
					pattern.split('.')

				patternExercise ||= '*'
				patternStep ||= '*'
				patternType ||= '*'

				return (
					(patternExercise === '*' ||
						exerciseNumber === Number(patternExercise)) &&
					(patternStep === '*' || stepNumber === Number(patternStep)) &&
					(patternType === '*' || type.includes(patternType))
				)
			})
		})
	} else {
		const displayNameMap = new Map(
			allApps.map((app) => [getAppDisplayName(app, allApps), app]),
		)
		const choices = displayNameMap.keys()

		const response = await prompt({
			type: 'autocomplete',
			name: 'appDisplayNames',
			message: 'Select apps to test:',
			choices: ['All', ...choices],
			multiple: true,
			suggest: (input, choices) => {
				return matchSorter(choices, input, { keys: ['name'] })
			},
		})

		selectedApps = response.appDisplayNames.includes('All')
			? allApps
			: response.appDisplayNames.map((appDisplayName) =>
					displayNameMap.get(appDisplayName),
				)

		// Update this block to use process.argv
		const appPattern =
			selectedApps.length === allApps.length
				? '*'
				: selectedApps
						.map((app) => `${app.exerciseNumber}.${app.stepNumber}.${app.type}`)
						.join(',')
		const additionalArgsString =
			additionalArgs.length > 0 ? ` -- ${additionalArgs.join(' ')}` : ''
		console.log(`\nℹ️  To skip the prompt next time, use this command:`)
		console.log(`npm test -- ${appPattern}${additionalArgsString}\n`)
	}

	if (selectedApps.length === 0) {
		console.log('⚠️ No apps selected. Exiting.')
		return
	}

	if (selectedApps.length === 1) {
		const app = selectedApps[0]
		console.log(`🚀 Running tests for ${app.relativePath}\n\n`)
		const startTime = performance.now()
		try {
			await execa('npm', ['run', 'test', '--silent', '--', ...additionalArgs], {
				cwd: app.fullPath,
				stdio: 'inherit',
				env: {
					...process.env,
					PORT: app.dev.portNumber,
				},
			})
			const duration = (performance.now() - startTime) / 1000
			console.log(
				`✅ Finished tests for ${app.relativePath} (${duration.toFixed(2)}s)`,
			)
		} catch {
			const duration = (performance.now() - startTime) / 1000
			console.error(
				`❌ Tests failed for ${app.relativePath} (${duration.toFixed(2)}s)`,
			)
			process.exit(1)
		}
	} else {
		const limit = pLimit(1)
		let hasFailures = false
		const runningProcesses = new Map()
		let isShuttingDown = false
		const results = new Map()

		const shutdownHandler = () => {
			if (isShuttingDown) return
			isShuttingDown = true
			console.log('\nGracefully shutting down. Please wait...')
			console.log('Outputting results of running tests:')
			for (const [app, output] of runningProcesses.entries()) {
				if (output.hasOutput()) {
					console.log(`\nPartial results for ${app.relativePath}:\n\n`)
					output.replay()
					console.log('\n\n')
				} else {
					console.log(`ℹ️  No output captured for ${app.relativePath}`)
				}
				// Set result for incomplete tests
				if (!results.has(app.relativePath)) {
					results.set(app.relativePath, 'Incomplete')
				}
			}
			printTestSummary(results)
			// Allow some time for output to be written before exiting
			setTimeout(() => process.exit(1), 100)
		}

		process.on('SIGINT', shutdownHandler)
		process.on('SIGTERM', shutdownHandler)

		const tasks = selectedApps.map((app) =>
			limit(async () => {
				if (isShuttingDown) return
				console.log(`🚀 Starting tests for ${app.relativePath}`)
				const output = captureOutput()
				runningProcesses.set(app, output)
				const startTime = performance.now()
				try {
					const subprocess = execa(
						'npm',
						['run', 'test', '--silent', '--', ...additionalArgs],
						{
							cwd: path.join(__dirname, '..', app.relativePath),
							reject: false,
							env: {
								...process.env,
								PORT: app.dev.portNumber,
							},
						},
					)

					subprocess.stdout.on('data', (chunk) => output.write(chunk, 'stdout'))
					subprocess.stderr.on('data', (chunk) => output.write(chunk, 'stderr'))

					const { exitCode } = await subprocess
					const duration = (performance.now() - startTime) / 1000

					runningProcesses.delete(app)

					if (exitCode !== 0) {
						hasFailures = true
						console.error(
							`\n❌ Tests failed for ${app.relativePath} (${duration.toFixed(2)}s):\n\n`,
						)
						output.replay()
						console.log('\n\n')
						results.set(app.relativePath, { result: 'Failed', duration })
						// Set result for incomplete tests
						if (!results.has(app.relativePath)) {
							results.set(app.relativePath, 'Incomplete')
						}
					} else {
						console.log(
							`✅ Finished tests for ${app.relativePath} (${duration.toFixed(2)}s)`,
						)
						results.set(app.relativePath, { result: 'Passed', duration })
					}
				} catch (error) {
					const duration = (performance.now() - startTime) / 1000
					runningProcesses.delete(app)
					hasFailures = true
					console.error(
						`\n❌ An error occurred while running tests for ${app.relativePath} (${duration.toFixed(2)}s):\n\n`,
					)
					console.error(error.message)
					output.replay()
					console.log('\n\n')
					results.set(app.relativePath, { result: 'Error', duration })
				}
			}),
		)

		await Promise.all(tasks)

		// Print summary output
		printTestSummary(results)

		if (hasFailures) {
			process.exit(1)
		}
	}
}

main().catch((error) => {
	if (error) {
		console.error('❌ An error occurred:', error)
	}
	setTimeout(() => process.exit(1), 100)
})
