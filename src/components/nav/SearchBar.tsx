'use client'
import { db } from '@/firebase/firebase-app';
import { arrayUnion, collection, doc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface UserInfo {
  id: string,
  image: string,
  username: string,
  canAddFriend: boolean
}

interface Props {
  userInfo: { image: string, username: string }
}

const SearchBar: React.FC<Props> = ({ userInfo: myUserInfo }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter()
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowResults(false);
      } else {
        setShowResults(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Todo: Upgrate with algolia
  const doSearch = async (value: string) => {
    const realSearchText = value.trim()
    if (realSearchText.length >= 4) {
      const usersRef = collection(db, "users")
      const usernameQuery = query(usersRef, where("username", "==", realSearchText), limit(1))
      const querySnapshot = await getDocs(usernameQuery)

      if (querySnapshot.docs) {
        setSearchResults(querySnapshot.docs.map(doc => {
          // If self
          let canAddFriend = !(doc.data().username === myUserInfo.username)
          // If requested
          if (canAddFriend && doc.data().friend_request_list)
            doc.data().friend_request_list.forEach((acc: UserInfo) => {
              if (acc.username === myUserInfo.username) canAddFriend = false;
            })
          // If is friend
          if (canAddFriend && doc.data().friend_list)
            doc.data().friend_list.forEach((acc: UserInfo) => {
              if (acc.username === myUserInfo.username) canAddFriend = false;
            })

          return {
            id: doc.id,
            username: doc.data().username,
            image: doc.data().image,
            canAddFriend: canAddFriend
          }
        }))
      } else {
        setSearchResults([])
      }
    }
  }

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    if (value) {
      setShowResults(true);
      doSearch(value);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleResultClick = (result: string) => {
    setSearchText(result);
    setShowResults(false);
    router.push('/' + result);
  };

  const handleAddFriend = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()

    setRequesting(true)

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friend_request_list: arrayUnion({
        username: myUserInfo.username,
        image: myUserInfo.image,
        timestamp: new Date(),
        read: false,
      })
    });

    await doSearch(searchText)
    setRequesting(false)
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={handleSearchTextChange}
        className="bg-gray-100 rounded-full py-2 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300 w-72"
      />
      {showResults && (
        <div className="absolute z-10 w-72 mt-1 bg-white rounded-lg shadow-lg">
          {searchResults.map((result) =>
            <div key={result.username} onClick={() => handleResultClick(result.username)} className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-2 text-gray-800">
                <img
                  src={result.image || '/images/default-profile-pic.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                {result.username}
              </div>
              {result.canAddFriend ?
                <button onClick={(e) => handleAddFriend(e, result.id)} className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2">
                  {
                    !requesting ?
                      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> :
                      <svg className="h-6 w-6 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M5 12l5 5l10 -10" /></svg>
                  }
                </button> : null
              }
            </div>)}
        </div>
      )}
      <button type="button" className="absolute right-0 top-0 h-full px-4 py-2 text-gray-800 rounded-full hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300">
        <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" /></svg>
      </button>
    </div>
  );
};

export default SearchBar;
