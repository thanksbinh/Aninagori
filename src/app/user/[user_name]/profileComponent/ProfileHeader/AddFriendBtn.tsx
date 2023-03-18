import { db } from '@/firebase/firebase-app';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { UserInfo } from "@/global/UserInfo";
import { FriendRequest } from "@/components/nav/notification/FriendRequest";
import { beFriends, makeFriendRequest, removeFriendRequest, unfriend } from "@/components/addFriend/friendRequest";
import Button from '@/components/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCheck, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

export default function AddFriendBtn({ myUserInfo, userInfo }: { myUserInfo: UserInfo; userInfo: UserInfo }) {
  const [content, setContent] = useState({ content: 'Add friend', icon: faUserPlus });
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    // If requested
    if ((userInfo as any)?.friend_request_list?.some((acc: any) => acc.username === myUserInfo.username)) {
      setContent({ content: 'Requesting...', icon: faUserMinus });
    }
    // If friend
    if ((userInfo as any)?.friend_list?.some((acc: any) => acc.username === myUserInfo.username)) {
      setContent({ content: 'Friend', icon: faUser });
    }
    // If requesting
    if ((myUserInfo as any)?.friend_request_list?.some((acc: any) => acc.username === userInfo.username))
      setContent({ content: 'Accept friend', icon: faUserCheck });
  }, [myUserInfo, userInfo]);

  const handleAddFriend = async () => {
    // not log in and click add friend btn => redirect to login step
    if (!myUserInfo.id) {
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL as any;
      return;
    }

    // options for friend user (unfriend, ...)
    if (content.content === 'Friend') {
      setIsOpen(!isOpen);
      return;
    }

    const docRef = doc(db, 'users', myUserInfo.id);
    const docSnap = await getDoc(docRef);
    if (
      docSnap.exists() &&
      docSnap
        .data()
        .friend_request_list?.map((doc: FriendRequest) => doc.username)
        .includes(userInfo.username)
    ) {
      beFriends(myUserInfo, userInfo);
      setContent({ content: 'Friend', icon: faUser });

      docSnap.data().friend_request_list.forEach((doc: FriendRequest) => {
        if (doc.username === userInfo.username) {
          removeFriendRequest(myUserInfo, doc);
        }
      });
    } else {
      makeFriendRequest(myUserInfo, userInfo.id);
      setContent({ content: 'Requesting...', icon: faUserMinus });
    }
  };

  const handleUnfriend = async () => {
    await unfriend(myUserInfo, userInfo)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <Menu as="div" ref={ref} className="relative inline-block text-left z-30 pl-4">
      <Button
        small
        primary
        leftIcon={<FontAwesomeIcon icon={content.icon as any} />}
        onClick={handleAddFriend}
        disabled={content.content === 'Requesting...'}
        to={undefined}
        href={undefined}
        rightIcon={undefined}
      >
        {content.content}
      </Button>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items static className="origin-top-left absolute left-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button onClick={handleUnfriend} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 text-sm w-full text-left h-7`}>
                  {"Sayonara."}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
