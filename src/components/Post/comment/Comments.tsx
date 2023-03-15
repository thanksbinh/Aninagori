import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FC, useContext, useEffect, useState } from "react";
import { db } from "@/firebase/firebase-app";
import Avatar from "../../Avatar/Avatar";
import { PostContext } from "../context/PostContex";
import Comment, { CommentProps } from "./Comment";

interface Props {
  comments: CommentProps[];
  incCommentCount: any;
  inputRef: any;
};

const Comments: FC<Props> = ({ comments, incCommentCount, inputRef }) => {
  const [myComment, setMyComment] = useState("")
  const [lastComments, setLastComments] = useState<CommentProps[]>([])
  const { myUserInfo, postId } = useContext(PostContext)

  useEffect(() => {
    comments && setLastComments(comments)
  }, [comments])

  const sendComment = async (comment: any) => {
    const commentsRef = collection(db, 'posts', postId, "comments");
    await addDoc(commentsRef, comment);
  }

  const onComment = (e: any) => {
    e && e.preventDefault()

    if (!myComment.trim()) return;

    const thisComment = {
      username: myUserInfo.username,
      avatarUrl: myUserInfo.image,
      content: myComment,
      timestamp: serverTimestamp(),
    }
    sendComment(thisComment)
    setLastComments([
      ...lastComments,
      {
        ...thisComment,
        timestamp: "less than a minute ago",
        // Add comment's true id
        id: ""
      }
    ])

    setMyComment("")
    incCommentCount()
  }

  return (
    <div>
      {lastComments.map((comment) =>
        <div key={comment.id} className="flex flex-col mt-4 mx-2">
          <Comment comment={comment} />
        </div>
      )
      }

      <div className="flex items-center mt-4 mx-2">
        <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
        <form onSubmit={onComment} className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] caret-white" >
          <input
            type="text"
            placeholder="Write a comment..."
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            ref={inputRef}
            className="w-full bg-[#212833] focus:outline-none caret-white"
          />
        </form>
      </div>
    </div>
  );
};

export default Comments;