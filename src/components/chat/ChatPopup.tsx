'use client'

import Avatar from "../avatar/Avatar";
import Messages from "./Messages";
import MessageForm from "./MessageForm";
import { UserInfo } from "../nav/NavBar";

export default function ChatPopup({myUserInfo, onClose}: {myUserInfo: UserInfo, onClose: boolean}){
    const setClose = () => {onClose = true};

    return (
        <>
        {!onClose && (
            <div className="fixed right-80 bottom-0 w-96 h-2/3 flex flex-col bg-[#191c21] mt-8 rounded-t-2xl">
                <div className="flex p-2 bg-[#4e5d78] rounded-t-2xl">
                    <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={10} />
                    <div className="flex flex-1 flex-col pl-6">
                        <p>Conversation name</p>
                        <p>Active now</p>   
                    </div>
                    <div className="flex justify-center items-center pr-4">
                        <button onClick={setClose}>X</button>
                    </div>
                </div>
                <div className="flex flex-1 overflow-y-auto">
                    <Messages myUserInfo={myUserInfo}/>
                </div>
                <MessageForm messages={[]} conversationId={"s1czHpCmjcciBf3438XW"} myUserInfo={myUserInfo} />
            </div> 
        )}
        </>
    );
}