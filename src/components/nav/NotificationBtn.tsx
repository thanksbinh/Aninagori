'use client'

import React, { useEffect, useRef, useState } from "react";
import NotificationContainer from "../notification/NotificationContainer";
import { BsBellFill } from '@react-icons/all-files/bs/BsBellFill';
import { UserInfo } from "@/global/UserInfo.types";

export const NotiContext = React.createContext<any>({});

const NotificationBtn = ({ myUserInfo }: { myUserInfo: UserInfo | undefined }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [unreadNoti, setUnreadNoti] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div ref={ref} className="relative inline-block h-full">
      <button title="notification" onClick={toggleNotification} className="p-3 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] rounded-full font-medium focus:outline-none">
        <BsBellFill className="w-4 h-4" />
        {unreadNoti > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadNoti}
          </span>
        )}
      </button>
      <div className={showNotification ? "" : "hidden"}>
        {myUserInfo?.username &&
          <NotiContext.Provider value={{ showNotification, setShowNotification }}>
            <NotificationContainer myUserInfo={myUserInfo} setUnreadNoti={setUnreadNoti} showNotification={showNotification} />
          </NotiContext.Provider>
        }
      </div>
    </div>
  );
};

export default NotificationBtn;
