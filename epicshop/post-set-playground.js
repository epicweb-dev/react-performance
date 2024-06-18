import fs from 'node:fs'
import path from 'node:path'

const exclude = [
	'exercises/04.',
	'exercises/05.',
	'exercises/06.',
	'exercises/07.',
]

if (
	exclude.every((e) => !process.env.EPICSHOP_PLAYGROUND_SRC_DIR.includes(e))
) {
	fs.writeFileSync(
		path.join(process.env.EPICSHOP_PLAYGROUND_DEST_DIR, 'tsconfig.json'),
		JSON.stringify(
			{
				include: ['**/*.ts', '**/*.tsx'],
				extends: ['@epic-web/config/typescript'],
				compilerOptions: {
					paths: {
						'#*': ['../shared/*'],
					},
				},
			},
			null,
			2,
		),
	)
}
