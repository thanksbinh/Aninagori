'use client'

import React, { useState } from 'react';

interface Friend {
  username: string;
  avatarUrl: string;
}

interface Props {
  friends: Friend[];
}

const FriendList: React.FC<Props> = ({ friends }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleFriends = showAll ? friends : friends.slice(0, 5);

  return (
    <div className="relative">
      <div className="flex justify-between items-center px-2 mb-4">
        <h2 className="text-gray-800 font-semibold text-xl">Friends</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div className="flex flex-col flex-wrap -mx-2">
        {visibleFriends.map((friend) => (
          <div key={friend.username} className="w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-4">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={friend.avatarUrl || '/images/default-profile-pic.png'}
                alt={friend.username}
              />
              <span className="ml-2 font-medium">{friend.username}</span>
            </div>
          </div>
        ))}
      </div>
      {friends.length > 5 && (
        <button
          className="absolute bottom-0 left-0 w-full py-2 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `Show all ${friends.length} friends`}
        </button>
      )}
    </div>
  );
};

export default FriendList;