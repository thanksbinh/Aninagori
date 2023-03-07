'use client'

import { useEffect, useRef, useState } from "react";
import { UserInfo } from "../NavBar";
import NotificationContainer from "./NotificationContainer";

interface Props {
  myUserInfo: UserInfo | undefined
}

const NotificationBtn: React.FC<Props> = ({ myUserInfo }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    <div ref={ref} className="relative inline-block">
      <button onClick={toggleNotification} className="px-2 py-2 bg-gray-200 rounded-full text-white font-medium focus:outline-none">
        <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <circle cx="16" cy="8" r="3" /></svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <div className={showNotification ? "" : "hidden"}>
        {myUserInfo ?
          <NotificationContainer myUserInfo={myUserInfo} setUnreadCount={setUnreadCount} showNotification={showNotification}/>
          : null
        }
      </div>
    </div>
  );
};

export default NotificationBtn;
