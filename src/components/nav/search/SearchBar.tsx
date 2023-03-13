'use client'

import { db } from '@/firebase/firebase-app';
import { collection, endAt, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface SearchInfo {
  id: string,
  image: string,
  username: string,
}

const SearchBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchInfo[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter()

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
    const usersRef = collection(db, "users")
    const usernameQuery = query(usersRef, orderBy('username'), startAt(realSearchText), endAt(realSearchText + '\uf8ff'), limit(10))
    const querySnapshot = await getDocs(usernameQuery)

    if (querySnapshot.docs) {
      setSearchResults(querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          username: doc.data().username,
          image: doc.data().image,
        }
      }))
    } else {
      setSearchResults([])
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
    setShowResults(false);
    router.push('/user/' + result);
  };

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
                  src={result.image || '/bocchi.jpg'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                {result.username}
              </div>
            </div>)}
        </div>
      )}
      <button type="button" title='search' className="absolute right-0 top-0 h-full px-4 py-2 text-gray-800 rounded-full hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300">
        <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" /></svg>
      </button>
    </div>
  );
};

export default SearchBar;
