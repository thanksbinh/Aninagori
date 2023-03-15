import { db } from '@/firebase/firebase-app';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { UserInfo } from '@/components/nav/NavBar';
import { FriendRequest } from '@/components/nav/notification/FriendRequest';
import { beFriends, makeFriendRequest, removeFriendRequest } from '@/components/addFriend/friendRequest';
import Button from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCheck, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddFriendBtn({ myUserInfo, userInfo }: { myUserInfo: UserInfo; userInfo: UserInfo }) {
  const [content, setContent] = useState({ content: 'Add friend', icon: faUserPlus });
  const [disabled, setDisabled] = useState(false);

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

  useEffect(() => {
    if (content.content === 'Requesting...' || content.content === 'Friend') setDisabled(true);
    else setDisabled(false);
  }, [content]);

  const handleAddFriend = async () => {
    if (!!myUserInfo.id) {
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
    } else {
      // not log in and click add friend btn => redirect to login step
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL as any;
    }
  };

  return (
    <Button
      small
      primary
      leftIcon={<FontAwesomeIcon icon={content.icon as any} />}
      onClick={handleAddFriend}
      disabled={disabled}
      to={undefined}
      href={undefined}
      rightIcon={undefined}
    >
      {content.content}
    </Button>
  );
}
