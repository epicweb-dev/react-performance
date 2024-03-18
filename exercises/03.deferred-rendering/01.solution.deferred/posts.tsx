import { memo, useDeferredValue, useState } from 'react'
import {
	type BlogPost,
	generateGradient,
	getMatchingPosts,
} from '#shared/blog-posts.tsx'
import { getQueryParam, useSearchParams } from './params'
import { ButtonWithTooltip } from './tooltip'

export function MatchingPosts() {
	const [searchParams] = useSearchParams()
	const query = getQueryParam(searchParams)
	const deferredQuery = useDeferredValue(query)
	return <MatchingPostsImpl query={deferredQuery} />
}

const MatchingPostsImpl = memo(function MatchingPostsImpl({
	query,
}: {
	query: string
}) {
	const matchingPosts = getMatchingPosts(query)

	return (
		<ul className="post-list">
			{matchingPosts.map(post => (
				<Card key={post.id} post={post} />
			))}
		</ul>
	)
})

function Card({ post }: { post: BlogPost }) {
	const [isFavorited, setIsFavorited] = useState(false)

	// This artificially slows down rendering
	let now = performance.now()
	while (performance.now() - now < 100) {
		// Do nothing for a bit...
	}

	return (
		<li>
			{isFavorited ? (
				<ButtonWithTooltip
					tooltipContent="Remove favorite"
					onClick={() => setIsFavorited(false)}
				>
					❤️
				</ButtonWithTooltip>
			) : (
				<ButtonWithTooltip
					tooltipContent="Add favorite"
					onClick={() => setIsFavorited(true)}
				>
					🤍
				</ButtonWithTooltip>
			)}
			<div
				className="post-image"
				style={{ background: generateGradient(post.id) }}
			/>
			<a
				href={post.id}
				onClick={event => {
					event.preventDefault()
					alert(`Great! Let's go to ${post.id}!`)
				}}
			>
				<h2>{post.title}</h2>
				<p>{post.description}</p>
			</a>
		</li>
	)
}
