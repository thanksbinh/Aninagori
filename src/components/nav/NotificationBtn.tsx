'use client'

import { useEffect, useRef, useState } from "react";
import NotificationComponent from "./Notification";

const fakeNoti = [{
  notification_id: "string",
  sender: {
    username: "binh_1",
    avatarUrl: "https://lh3.googleusercontent.com/a/AGNmyxYXB_E8cLw4PG9Xcfrn9zXoyQ51AGU2WR8QMsop=s96-c",
  },
  type: 'friend request',
  timestamp: 0,
  read: "boolean",
}, {
  notification_id: "string",
  sender: {
    username: "binh_test",
    avatarUrl: "",
  },
  type: 'comment',
  post: {
    id: "string",
    title: "Cool bro",
  },
  timestamp: 0,
  read: "boolean",
}]

interface Props {
  userNoti: Notification[],
}

const NotificationBtn: React.FC<Props> = ({ userNoti }) => {
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
            <h2 className="text-gray-800 font-semibold text-xl">Notification</h2>
            <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
          </div>
          {
            userNoti.map(noti =>
              <NotificationComponent notification={noti as any} />
            )
          }
        </div>
      )}
    </div>
  );
};

export default NotificationBtn;
