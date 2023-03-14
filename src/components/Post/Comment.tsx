import { db } from "@/firebase/firebase-app";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { UserInfo } from "../nav/NavBar";

interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
}

interface Props {
  myUserInfo: UserInfo;
  lastComment: CommentProps | undefined;
  id: string;
  incCommentCount: any;
  inputRef: any;
};

const Comment: FC<Props> = ({ myUserInfo, lastComment, incCommentCount, inputRef, id }) => {
  const [myComment, setMyComment] = useState("")
  const [lastComments, setLastComments] = useState<CommentProps[]>([])

  useEffect(() => {
    lastComment && setLastComments([lastComment])
  }, [])

  const sendComment = async (comment: any) => {
    const commentsRef = collection(db, 'posts', id, "comments");
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
      }
    ])

    setMyComment("")
    incCommentCount()
  }

  return (
    <div>
      {lastComments.map((comment) =>
        <div className="flex flex-col mt-4 mx-2">
          <div className="flex">
            <Avatar imageUrl={comment!.avatarUrl} altText={comment!.username} size={8} />
            <div className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] focus:outline-none caret-white">
              <div className="text-sm font-bold text-"> {comment!.username} </div>
              {comment!.content}
            </div>
          </div>
          <div className="flex gap-2 ml-14 mt-1 text-xs">
            <div className="hover:cursor-pointer hover:underline">Like</div>
            <div className="hover:cursor-pointer hover:underline">Reply</div>
            <div className="hover:cursor-pointer hover:underline">{comment!.timestamp}</div>
          </div>
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

export default Comment;