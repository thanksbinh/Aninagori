'use client'

import { formatDuration } from "@/components/utils/format";
import { useRouter } from "next/navigation";
import { UserInfo } from "../../global/UserInfo.types";

interface Props {
    myUserInfo: UserInfo;
}

const ChatNoti: React.FC<Props> = ({ myUserInfo }) => {
    const router = useRouter()

    return (
        <>
            <div className="flex items-center bg-ani-gray rounded-lg mx-2 px-3 py-4 hover:cursor-pointer hover:bg-slate-50/25">
                <img
                    src={'/bocchi.jpg'}
                    alt={'avatar'}
                    className="h-10 w-10 rounded-full mr-4"
                />
                <div>
                    <p className={`text-sm font-medium ${true ? "text-[#a5a5a5]" : "text-white"}`}>
                        Niichan
                    </p>
                    <p className={`text-xs ${true ? "text-[#a5a5a5]" : "text-[#377dff]"}`}>
                        2 min ago
                    </p>
                </div>
            </div>
        </>
    );
};

export default ChatNoti;