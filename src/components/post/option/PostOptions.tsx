'use client'

import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { SiThreedotjs } from "react-icons/si";
import { moveToTrash } from "./moveToTrash";

const adminOptions = [
  {
    name: 'Turn on/off notifications for this post',
    action: () => console.log('Turn on/off notifications for this post'),
  },
  {
    name: 'Edit post',
    action: () => console.log('Edit post'),
  },
  {
    name: 'Move to trash',
    action: (postId: string) => moveToTrash(postId),
  },
];

const guestOptions = [
  {
    name: 'Turn on/off notifications for this post',
    action: () => console.log('Turn on/off notifications for this post'),
  },
  {
    name: 'Hide post',
    action: () => console.log('Hide post'),
  },
  {
    name: 'Report post',
    action: () => console.log('Report post'),
  },
];


type Props = {
  isAdmin: boolean | undefined;
  postId: string;
};

const PostOptions: FC<Props> = ({ isAdmin, postId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOption = (option: any) => {
    option.action(postId)
    router.refresh()
  }

  return (
    <Menu as="div" ref={ref} className="relative inline-block text-left z-30">
      <Menu.Button onClick={() => setIsOpen(!isOpen)}>
        <SiThreedotjs className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items static className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {((isAdmin) ? adminOptions : guestOptions).map((option) => (
              <Menu.Item key={option.name}>
                {({ active }) => (
                  <button onClick={() => handleOption(option)} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}>
                    {option.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default PostOptions;