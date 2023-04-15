'use client'

import FriendComponent, { Friend } from '../rightsidebar/Friend';
import ChatPopup from '@/components/chat/ChatPopup';
import { UserInfo } from '@/global/UserInfo.types';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { useState } from 'react';

const FriendList = ({ myFriendList, myUserInfo }: { myFriendList: Friend[] | undefined, myUserInfo: UserInfo | undefined }) => {
  const [showChat, setShowChat] = useState(false)
  const [currentChat, setCurrentChat] = useState({
    username: "",
    image: ""
  })

  const openChat = () => {
    setShowChat(true);
  };

  return (
    <div className="h-full relative">
      <div className="flex justify-between items-center pr-2 mb-4">
        <h2 className="text-ani-text-main font-semibold text-xl">Friends</h2>
        <div className="hover:cursor-pointer rounded-full p-2">
          <BsThreeDots className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="h-full overflow-y-auto flex flex-col flex-wrap -mx-2">
        {myFriendList?.map((friend) => (
          <div key={friend.username}>
            <FriendComponent friendInfo={friend} openChat={openChat} setCurrentChat={setCurrentChat} />
          </div>
        ))}
      </div>
      {myUserInfo?.username &&
        <div className={`${showChat ? "" : "hidden"}`}>
          <ChatPopup myUserInfo={myUserInfo} setShowChat={setShowChat} recipient={currentChat.username} image={currentChat.image} />
        </div>
      }
    </div>
  )
}

export default FriendList;
