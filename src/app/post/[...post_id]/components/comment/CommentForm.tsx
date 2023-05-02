import Avatar from "@/components/avatar/Avatar";
import { FC, useContext, useState, FormEvent } from "react";
import { PostContext } from "../../PostContext";
import { sendComment, sendReply } from "./doComment";

interface Props {
  setLastComment: any;
  inputRef: any;
  commentId?: string;
};

// It's actually a comment/reply form!!!
const CommentForm: FC<Props> = ({ setLastComment, inputRef, commentId }) => {
  const { myUserInfo, authorName, content, postId } = useContext(PostContext)
  const isReply = commentId ? true : false

  const [myComment, setMyComment] = useState("")

  const onComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!myUserInfo.username) return alert("You need to login to comment")
    if (!myComment.trim()) return;

    const lastComment = await sendComment(myUserInfo, myComment, authorName, content, postId)
    setLastComment(lastComment)

    setMyComment("")
  }

  const onReply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!myUserInfo.username) return alert("You need to login to reply")
    if (!myComment.trim()) return;

    const lastComment = await sendReply(myUserInfo, myComment, postId, commentId!)
    setLastComment(lastComment)

    setMyComment("")
  }

  if (myUserInfo.is_banned) {
    return (
      <div className="flex items-center mt-4">
        <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
        <form className="rounded-2xl py-2 px-4 ml-2 w-full bg-ani-black caret-white" >
          <input disabled className="w-full bg-ani-black focus:outline-none caret-white" />
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-4">
      <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
      <form onSubmit={isReply ? onReply : onComment} className="rounded-2xl py-2 px-4 ml-2 w-full bg-ani-light-gray caret-white" >
        <input
          type="text"
          placeholder="Write a comment..."
          value={myComment}
          onChange={(e) => setMyComment(e.target.value)}
          ref={inputRef}
          className="w-full bg-ani-light-gray focus:outline-none caret-white"
        />
      </form>
    </div>
  );
};

export default CommentForm;