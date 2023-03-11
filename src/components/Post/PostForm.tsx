'use client';

import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { HiPhoto, HiVideoCamera } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { db } from "@/firebase/firebase-app";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type PostFormProps = {
  username: string;
  avatarUrl: string;
};

const PostForm: FC<PostFormProps> = ({
  username,
  avatarUrl,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [imageToPost, setImageToPost] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    // your async logic here
    event.preventDefault();
    if (!inputRef.current?.value) return;

    await addDoc(collection(db, 'posts'), {
      authorName: username,
      avatarUrl: avatarUrl,
      timestamp: serverTimestamp(),
      content: inputRef.current.value,
      imageUrl: '',
      comments: 0
    });

    inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
      <div className="flex justify-between items-center mt-4">
        <Avatar imageUrl={avatarUrl} altText={username} size={8} />
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
        <button className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1" onClick={handleSubmit}>
          <span>Share</span>
        </button>
      </div>

    </div>
  );
};

export default PostForm;