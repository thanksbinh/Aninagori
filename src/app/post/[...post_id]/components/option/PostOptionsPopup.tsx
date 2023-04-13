'use client'

import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState, Suspense } from "react";
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { PostContext } from "../../PostContext";
import { adminOptions, authorOptions, guestOptions } from "./userTypes";
import PostFormPopUp from "@/app/(home)/components/postFormPopup/PostFormPopUp";

interface option {
  name: string,
  action: any
}

const PostOptions = ({ editPostID }: { editPostID: any, }) => {
  const { myUserInfo, authorName, postId, postData } = useContext(PostContext)

  const [openEditForm, setOpenEditForm] = useState(false);

  const editPostRef = useRef();

  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const postOptions = []
  if (myUserInfo?.username === authorName) {
    postOptions.push(...authorOptions);
  } else if (myUserInfo.is_admin) {
    postOptions.push(...adminOptions);
  } else {
    postOptions.push(...guestOptions);
  }

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

  const handleOption = async (option: option) => {
    await option.action(postId, authorName, setOpenEditForm)

    // TODO: if option is edit => not refresh
    if (option.name === "Edit post") {
      return
    }
    router.refresh()

  }

  return (
    <>
      {openEditForm && <PostFormPopUp isEditPost={true} postData={postData} ref={editPostRef} setOpen={setOpenEditForm} editPostID={editPostID} />}
      <Menu as="div" ref={ref} className="relative inline-block text-left z-30">
        <Menu.Button onClick={() => setIsOpen(!isOpen)}>
          <BsThreeDots className="h-5 w-5" aria-hidden="true" />
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
          <Menu.Items static className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-ani-gray ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-2">
              {postOptions.map((option) => (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <button onClick={() => handleOption(option)} className={`${active ? 'bg-gray-500 text-gray-300' : 'text-gray-400'} rounded-md block px-4 py-2 text-sm w-full text-left`}>
                      {option.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default PostOptions;