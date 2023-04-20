"use client"

import { getDoc, doc } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"

import { db } from "@/firebase/firebase-app"
import { PostContext } from "../../../PostContext";
import { formatDuration } from "@/components/utils/format";
import Modal from "@/components/utils/Modal";
import MediaContent from "./MediaContent"

// Todo: Optimization
export default function MediaFullView({ isOpen, onClose }: { isOpen: boolean; onClose: any }) {
    const [post, setPost] = useState<any>({})
    const { postId } = useContext(PostContext)

    useEffect(() => {
        if (!postId) return;

        async function fetchData() {
            const postDoc = await getDoc(doc(db, "posts", postId))
            if (!postDoc.exists()) return

            setPost({
                ...postDoc.data(),
                timestamp: formatDuration(new Date().getTime() - postDoc.data().timestamp.toDate().getTime()),
            } as any)
        }

        fetchData()
    }, [])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={""}>
            <div className="w-[1100px]">
                <MediaContent
                    imageUrl={post.imageUrl}
                    videoUrl={post.videoUrl}
                    tag={post?.post_anime_data?.tag}
                    postId={post.id}
                />
            </div>
        </Modal>
    )
}