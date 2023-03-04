import React from 'react';
import Image from 'next/image';
// import { SearchIcon, BellIcon, MailIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  return (
    <nav className="app__navbar flex items-center justify-between bg-black shadow-md">
      <div className="app__navbar-logo flex flex-1 items-center px-4 py-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
        />
      </div>
      <div className="app__navbar-search flex items-center flex-1 px-4 py-2 rounded-full bg-gray-100">
        {/* <SearchIcon className="w-5 h-5 text-gray-500 mr-2" /> */}
        <input type="text" placeholder="Search" className="w-full bg-transparent outline-none" />
      </div>
      <div className="app__navbar-user flex flex-1 justify-end items-center px-4 py-3">
        <button className="flex items-center mr-6">
          {/* <MailIcon className="w-5 h-5 text-gray-500 mr-2" /> */}
          <p className="color-white">Mail</p>
        </button>
        <button className="flex items-center mr-6">{/* <BellIcon className="w-5 h-5 text-gray-500 mr-2" /> */}</button>
        <div className="app__navbar-user_avatar w-10 h-10 relative">
          <Image src="/bocchi.jpg" alt="Avatar" width={20} height={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
