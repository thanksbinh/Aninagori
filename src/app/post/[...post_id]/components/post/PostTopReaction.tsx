'use client';

import { ReactionInfo } from '@/global/Post.types';
import { FC, useEffect, useState } from 'react';

interface ReactionCount {
	id: number | undefined;
	type: string;
	image: string | undefined;
	count: number;
}

interface PostTopReactionProps {
	reactions?: ReactionInfo[];
	onReaction: (type: string) => void;
}

const PostTopReaction: FC<PostTopReactionProps> = ({
	reactions,
	onReaction
}) => {
	const [reactionList, setReactionList] = useState<ReactionCount[]>([
		{ id: 1, type: "Naisu", image: "/reactions/Naisu.png", count: 0 },
		{ id: 2, type: "Kawaii", image: "/reactions/Kawaii.png", count: 0 },
		{ id: 3, type: "Haha", image: "/reactions/Uwooaaghh.png", count: 0 },
		{ id: 4, type: "Wow", image: "/reactions/Wow.png", count: 0 },
		{ id: 5, type: "Kakkoii", image: "/reactions/Kakkoii.png", count: 0 },
		{ id: 6, type: "Nani", image: "/reactions/Nani.png", count: 0 },
	]);

	function updateReactionList() {
		const updatedReactionList = [
			{ id: 1, type: "Naisu", image: "/reactions/Naisu.png", count: 0 },
			{ id: 2, type: "Kawaii", image: "/reactions/Kawaii.png", count: 0 },
			{ id: 3, type: "Haha", image: "/reactions/Uwooaaghh.png", count: 0 },
			{ id: 4, type: "Wow", image: "/reactions/Wow.png", count: 0 },
			{ id: 5, type: "Kakkoii", image: "/reactions/Kakkoii.png", count: 0 },
			{ id: 6, type: "Nani", image: "/reactions/Nani.png", count: 0 },
		];
		reactions?.forEach((reaction) => {
			const index = updatedReactionList.findIndex((item) => item.type === reaction.type);
			if (index >= 0) {
				updatedReactionList[index] = {
					...updatedReactionList[index],
					count: updatedReactionList[index].count + 1,
				};
			} else {
				updatedReactionList[0] = {
					...updatedReactionList[0],
					count: updatedReactionList[0].count + 1,
				};
			}
		});
		const sortedReactionList = [...updatedReactionList].sort((a, b) => b.count - a.count);
		setReactionList(sortedReactionList);
	}

	useEffect(() => {
		updateReactionList();
	}, [reactions])

	function ReactBtn({ reaction }: { reaction: ReactionCount }) {
		return (reaction.count > 0) ? (
			<button onClick={() => onReaction(reaction.type)} title={reaction.type} className={`flex flex-col items-center py-2 bg-[#191c21] rounded-xl relative`}>
				<div className="hover:scale-[1.2] transition w-10 h-10 rounded-full flex">
					<img className="w-full h-auto" src={reaction.image} alt={"type"} />
				</div>
				<div className="absolute -bottom-2 -right-1 p-1 rounded-full transition flex text-gray-300">x{reaction.count}</div>
			</button>
		) : null;
	}

	return reactionList[0].count > 0 ? (
		<div className="w-[4.5rem] h-auto max-h-[15.5rem] flex flex-col gap-2 rounded-2xl py-4 px-2 bg-[#212733] mr-1">
			<ReactBtn reaction={reactionList[0]} />
			<ReactBtn reaction={reactionList[1]} />
			<ReactBtn reaction={reactionList[2]} />
		</div>
	) : null;
};

export default PostTopReaction;