import { addDoc, arrayUnion, collection, doc, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { FC, useContext, useState } from "react";
import { db } from "@/firebase/firebase-app";
import Avatar from "../../avatar/Avatar";
import { PostContext } from "../context/PostContext";

interface Props {
  setLastComment: any;
  inputRef: any;
  commentId?: string;
};

// It's actually a comment/reply form!!!
const CommentForm: FC<Props> = ({ setLastComment, inputRef, commentId }) => {
  const { myUserInfo, postId } = useContext(PostContext)
  const isReply = commentId ? true : false

  const [myComment, setMyComment] = useState("")

  const sendComment = async (comment: any) => {
    const commentsRef = collection(db, 'posts', postId, "comments");

    const docAdd = await addDoc(commentsRef, comment)
    updateDoc(doc(db, "posts", postId), { lastComment: { ...comment, id: docAdd.id } })

    return docAdd.id;
  }

  const onComment = async (e: any) => {
    e.preventDefault()

    if (!myComment.trim()) return;

    const content = {
      username: myUserInfo.username,
      avatarUrl: myUserInfo.image,
      content: myComment,
      timestamp: serverTimestamp(),
    }

    commentId = await sendComment(content)
    setLastComment({
      ...content,
      timestamp: "less than a minute ago",
      id: commentId
    })

    setMyComment("")
  }

  const sendReply = (reply: any) => {
    const commentRef = doc(db, 'posts', postId, "comments", commentId!);
    updateDoc(commentRef, {
      replies: arrayUnion(reply)
    })
  }

  const onReply = (e: any) => {
    e.preventDefault()

    if (!myComment.trim()) return;

    const content = {
      username: myUserInfo.username,
      avatarUrl: myUserInfo.image,
      content: myComment,
      timestamp: new Date(),
    }

    sendReply(content)
    setLastComment({
      ...content,
      timestamp: "less than a minute ago",
      realTimestamp: Timestamp.fromDate(content.timestamp),
      parentId: commentId
    })

    setMyComment("")
  }

  if (myUserInfo.is_banned) {
    return (
      <div className="flex items-center mt-4">
        <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
        <form className="rounded-2xl py-2 px-4 ml-2 w-full bg-ani-gray caret-white" >
          <input disabled className="w-full bg-ani-gray focus:outline-none caret-white" />
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-4">
      <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
      <form onSubmit={isReply ? onReply : onComment} className="rounded-2xl py-2 px-4 ml-2 w-full bg-ani-gray caret-white" >
        <input
          type="text"
          placeholder="Write a comment..."
          value={myComment}
          onChange={(e) => setMyComment(e.target.value)}
          ref={inputRef}
          className="w-full bg-ani-gray focus:outline-none caret-white"
        />
      </form>
    </div>
  );
};

export default CommentForm;