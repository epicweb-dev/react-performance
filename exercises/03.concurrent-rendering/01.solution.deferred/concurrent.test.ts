import { testStep } from '@epic-web/workshop-utils/test'

await testStep(
	`There is no real test for this because it's basically impossible to test. (Consider that an invitation to try if you want!)`,
	async () => {
		await import('./index.tsx')
	},
)
