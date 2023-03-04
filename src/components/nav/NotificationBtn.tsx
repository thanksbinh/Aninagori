'use client'

import { useEffect, useRef, useState } from "react";
import Notification from "./Notification";

const fakeNoti = {
  notification_id: "string",
  sender: {
    username: "binh_admin",
    avatarUrl: "https://lh3.googleusercontent.com/a/AGNmyxYWBZrtM-VFFRkdOJ9jiyr23Dhk0Qy3dtWxVNXdgA=s96-c",
  },
  type: 'friend request',
  post: {
    id: "string",
    title: "string",
  },
  timestamp: 0,
  read: "boolean",
}

const NotificationButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(false);

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
    setShowNotification((prevState) => !prevState);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={toggleNotification} className="px-2 py-2 bg-gray-200 rounded-full text-white font-medium focus:outline-none">
        <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <circle cx="16" cy="8" r="3" /></svg>
      </button>
      {showNotification && (
        <div className="absolute right-0 w-80 top-12 z-50 bg-white rounded-md shadow-lg">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-gray-800 text-lg">Notification</h2>
            <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
          </div>
          {/* Map here */}
          <Notification notification={fakeNoti as any} />
          <Notification notification={fakeNoti as any} />
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
