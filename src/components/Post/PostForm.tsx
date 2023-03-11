'use client';
import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { HiPhoto, HiVideoCamera } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { db, storage } from "@/firebase/firebase-app";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type PostFormProps = {
  authorName: string;
  avatarUrl: string;
  time: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
};

const PostForm: FC<PostFormProps> = ({
  authorName,
  avatarUrl,
  time,
  content,
  imageUrl,
  likes,
  comments,
}) => {
  const {data: session} = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [imageToPost, setImageToPost] = useState<string | null>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // clear input value
    }
  }

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    // your async logic here
    event.preventDefault();
    if (!inputRef.current?.value) return;

    const docRef = await addDoc(collection(db, 'posts'), {
        authorName: session?.user?.name,
        avatarUrl: session?.user?.image,
        timeStamp: serverTimestamp(),
        content: inputRef.current.value,
        imgUrl: '',
        likes: 0,
        comments: 0
    });

    handleClear();

    alert("Post successfully added");
  }

  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-2 my-4">
      <div className="flex justify-between items-center mt-4">
        <Avatar imageUrl={avatarUrl} altText={authorName} size={8} />
        <input
          type="text"
          ref={inputRef}
          className="flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-[#212833] caret-white"
          placeholder="Share your favourite Animemory now!"
        />
      </div>

      <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
        <button className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1">
          <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
          <span>Photo/Gif</span>
        </button>
        <button className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1">
          <HiVideoCamera className="w-5 h-5 fill-[#FF1D43]" />
          <span>Video</span>
        </button>
        <button className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1" onClick={handleClick}>
          <span>Share</span>
        </button>
      </div>
      
    </div>
  );
};

export default PostForm;