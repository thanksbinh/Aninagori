'use client';

import { FC, useEffect, useState } from 'react';

interface ReactionCount {
    id: number | undefined;
    type: string;
    image: string | undefined;
    count: number;
}

interface PostTopReactionProps {
    reactions?: any;
}

const PostTopReaction: FC<PostTopReactionProps> = ({
    reactions,
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
        reactions.forEach((reaction: any) => {
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

    return (
        <div className={`${reactionList[0].count > 0 ? "w-[4.5rem] h-auto max-h-[15.5rem] flex flex-col rounded-2xl p-2 bg-[#212733] mr-1" : "hidden"}`}>
            <div className={`${reactionList[0].count > 0 ? "" : "hidden"} flex flex-col items-center px-2 py-1 bg-[#191c21] rounded-2xl`}>
                <div className="w-10 h-10 rounded-full flex justify center item center">
                    <img className="w-full h-auto" src={reactionList[0].image} alt={"type"} />
                </div>
                <div className="flex text-white">{reactionList[0].count}</div>
            </div>
            <div className={`${reactionList[1].count > 0 ? "" : "hidden"} flex flex-col items-center px-2 py-1 bg-[#191c21] rounded-2xl mt-2`}>
                <div className="w-10 h-10 rounded-full flex justify center item center">
                    <img className="w-full h-auto" src={reactionList[1].image} alt={"type"} />
                </div>
                <div className="flex text-white">{reactionList[1].count}</div>
            </div>
            <div className={`${reactionList[2].count > 0 ? "" : "hidden"} flex flex-col items-center px-2 py-1 bg-[#191c21] rounded-2xl mt-2`}>
                <div className="w-10 h-10 rounded-full flex justify center item center">
                    <img className="w-full h-auto" src={reactionList[2].image} alt={"type"} />
                </div>
                <div className="flex text-white">{reactionList[2].count}</div>
            </div>
        </div>
    );
};

export default PostTopReaction;