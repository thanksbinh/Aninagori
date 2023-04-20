"use client"

import { FC } from "react";
import PostContentMedia from "./PostContentMedia";

type MediaContentProps = {
    imageUrl?: string
    videoUrl?: string
    tag?: string[]
    postId?: string
}

// Todo: Optimization
const MediaContent: FC<MediaContentProps> = ({
    imageUrl,
    videoUrl,
    tag = [],
    postId,
}) => {

    return (
        <div className="flex flex-col flex-1 bg-ani-gray relative rounded-2xl p-4 pb-6" id={postId}>
            <div className="relative flex flex-col -mx-4">
                {(!!imageUrl || !!videoUrl) &&
                    <PostContentMedia
                        postId={postId}
                        tag={tag}
                        imageUrl={imageUrl}
                        videoUrl={videoUrl}
                    />}
            </div>
        </div>
    )
}

export default MediaContent;
