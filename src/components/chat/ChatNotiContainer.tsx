'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { UserInfo } from "../../global/UserInfo.types";
import ChatNoti from "./ChatNoti";

interface Props {
    myUserInfo: UserInfo
    showChatBtn: boolean
}

const ChatNotiContainer: React.FC<Props> = ({ myUserInfo, showChatBtn }) => {
    return (
        <>
            {showChatBtn && (
                <div className="absolute right-0 h-[23rem] w-80 top-12 z-40 bg-[#212733] rounded-md shadow-lg">
                    <div className="flex justify-between items-center px-4 py-2">
                        <h2 className="text-white font-semibold text-xl pt-4">Messages</h2>
                        <div className="hover:cursor-pointer rounded-full p-2"><BsThreeDots className="h-5 w-5" aria-hidden="true" /></div>
                    </div>
                    <div className="h-full bg-[#212733] rounded-md pb-2">
                        <div className="h-full overflow-y-auto bg-[#212733] rounded-md">
                            <ChatNoti myUserInfo={myUserInfo} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatNotiContainer