import { FC, useState } from 'react';
import Image from 'next/image';
import { BsChatLeftDotsFill, BsBellFill } from 'react-icons/bs';

interface NavbarProps {
  logoSrc: string;
  avatarSrc: string;
  userimage: any;
  username: any;
  children: any;
}

const Navbar: React.FC<NavbarProps> = ({ logoSrc, avatarSrc, userimage, username, children}) => {
  return (
    <nav className="header-fixed flex items-center justify-between bg-[#4e5d78] shadow-md">
      <div className="flex flex-1 items-center px-4 py-3">
        <Image src={logoSrc} alt="Logo" width={80} height={40} />
      </div>

      <div className="flex items-center flex-1 px-4 py-2 rounded-full bg-gray-100">
        <input type="text" placeholder="Search" className="w-full bg-transparent outline-none" />
      </div>

      <div className="flex flex-1 justify-end items-center px-4 py-3">
        <button className="flex item-center justify-center space-x-1 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] p-4 rounded-full mx-2">
          <BsChatLeftDotsFill className="w-5 h-5" />
        </button>

        <button className="flex item-center justify-center space-x-1 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] p-4 rounded-full mx-2">
          <BsBellFill className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 relative mx-2 my-2">
           {children}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
