import { useState } from 'react'
import {
	generateGradient,
	getMatchingPosts,
	type BlogPost,
} from '#shared/blog-posts.tsx'
import { getQueryParam, useSearchParams } from './params'
import { ButtonWithTooltip } from './tooltip'

export function MatchingPosts() {
	const [searchParams] = useSearchParams()
	const query = getQueryParam(searchParams)
	const matchingPosts = getMatchingPosts(query)

	return (
		<ul className="post-list">
			{matchingPosts.map(post => (
				<Card key={post.id} post={post} />
			))}
		</ul>
	)
}

function Card({ post }: { post: BlogPost }) {
	const [isFavorited, setIsFavorited] = useState(false)

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
			{post.title.split('').map((c, index) => (
				<SlowThing key={index} />
			))}
		</li>
	)
}

function SlowThing() {
	// This artificially slows down rendering
	const now = performance.now()
	while (performance.now() - now < 0.01) {
		// Do nothing for a bit...
	}

	return null
}
