'use client'

import { Dispatch, SetStateAction } from "react";
import { formatDuration } from "@/components/utils/format";
import { Timestamp } from "firebase/firestore";

export interface Friend {
  username: string
  image: string
  anime_status?: {
    status: string
    updated_at: Timestamp
    title: string
  }
}

const statusTextColor = new Map([
  ['completed', 'text-blue-400'],
  ['watching', 'text-green-400'],
  ['on_hold', 'text-yellow-400'],
  ['dropped', 'text-red-400']
]);

const FriendComponent = ({ friendInfo, openChat, setCurrentChat }:
  {
    friendInfo: Friend,
    openChat: () => void,
    setCurrentChat: Dispatch<SetStateAction<{
      username: string;
      image: string;
    }>>
  }) => {

  const onClick = () => {
    openChat();
    setCurrentChat({
      username: friendInfo.username,
      image: friendInfo.image
    });
  }

  return (
    <div className="relative w-full hover:cursor-pointer">
      <div className="flex items-center w-full px-4 py-3 hover:bg-[#4e5d78]" onClick={onClick}>
        <img
          className="rounded-full w-8 h-8 object-cover"
          src={friendInfo.image || '/bocchi.jpg'}
          alt={friendInfo.username}
        />
        <div className="ml-2">
          <p className="font-medium">{friendInfo.username}</p>
          {!!friendInfo.anime_status &&
            <p className={`flex gap-1 text-sm ${statusTextColor.get(friendInfo.anime_status.status)}`}>
              <span className="max-w-[180px] truncate block"> {friendInfo.anime_status.title} </span>
              <span className="text-gray-400 flex-shrink-0"> — {formatDuration(new Date().getTime() - new Date(friendInfo.anime_status.updated_at.seconds * 1000).getTime(), true)} </span>
            </p>
          }
        </div>
      </div>
    </div>
  );
};

export default FriendComponent;