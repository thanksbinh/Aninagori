import { db } from "@/firebase/firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserInfo } from "@/components/nav/NavBar";
import { FriendRequest } from "@/components/nav/notification/FriendRequest";
import { beFriends, makeFriendRequest, removeFriendRequest } from "@/components/addFriend/friendRequest";
import Button from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddFriendBtn({ myUserInfo, userInfo }: { myUserInfo: UserInfo, userInfo: UserInfo }) {
  const [content, setContent] = useState("Add friend")

  useEffect(() => {
    // If requested
    if ((userInfo as any)?.friend_request_list?.some((acc: any) => (acc.username === myUserInfo.username)))
      setContent("Requesting...")
    // If friend
    if ((userInfo as any)?.friend_list?.some((acc: any) => (acc.username === myUserInfo.username)))
      setContent("Friend")
  }, [])

  const handleAddFriend = async () => {

    setContent("Requesting...")

    const docRef = doc(db, "users", myUserInfo.id);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists() && docSnap.data().friend_request_list?.map((doc: FriendRequest) => doc.username).includes(userInfo.username)) {
      beFriends(myUserInfo, userInfo)
      docSnap.data().friend_request_list.forEach((doc: FriendRequest) => {
        if (doc.username === userInfo.username) {
          removeFriendRequest(myUserInfo, doc)
        }
      })
    } else {
      makeFriendRequest(myUserInfo, userInfo.id)
    }
  }

  return (
    <Button small primary leftIcon={<FontAwesomeIcon icon={faUserPlus as any} />} onClick={handleAddFriend} disabled={content === "Add friend" ? false : true} to={undefined} href={undefined} rightIcon={undefined}>
      {content}
    </Button>
  )
}
