'use client'

import { formatDuration } from "@/components/utils/format";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserInfo } from "../../global/UserInfo.types";

interface Props {
    myUserInfo: UserInfo;
    name: string;
    image: string;
    lastMessage: string;
    timestamp: Timestamp;
}

const ChatNoti: React.FC<Props> = ({ myUserInfo, name, image, lastMessage, timestamp }) => {
    const router = useRouter()

    return (
        <>
            <div className="flex items-center bg-ani-gray rounded-lg mx-2 px-3 py-4 hover:cursor-pointer hover:bg-slate-50/25">
                <img
                    src={image || '/bocchi.jpg'}
                    alt={'avatar'}
                    className="h-10 w-10 rounded-full mr-4"
                />
                <div>
                    <p className={`text-sm font-medium ${false ? "text-[#a5a5a5]" : "text-white"}`}>
                        {name + ": " + lastMessage}
                    </p>
                    <p className={`text-xs ${false ? "text-[#a5a5a5]" : "text-[#377dff]"}`}>
                        5 min ago
                    </p>
                </div>
            </div>
        </>
    );
};

export default ChatNoti;