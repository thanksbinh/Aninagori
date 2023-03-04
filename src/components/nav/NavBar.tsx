import { db } from "@/firebase/firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { Session } from "next-auth";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import SearchBar from "./SearchBar";
import NotificationBtn from "./NotificationBtn";

async function getUserInfo(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      "id": docSnap.data().id,
      "username": docSnap.data().username,
      "image": docSnap.data().image,
    }
  } else {
    console.log("No such document!");
  }
}

// Todo: get post, ... notification
async function getUserNoti(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log(docSnap.data())
    if (!docSnap.data().friend_request_list) return []
    return docSnap.data().friend_request_list.map((acc: any) => {
      return {
        notification_id: docSnap.id,
        sender: {
          username: acc.username,
          avatarUrl: acc.image,
        },
        type: 'friend request',
        timestamp: new Date().getTime() - acc.timestamp.toDate().getTime() + "s ago",
        read: acc.read,
      }
    })
  } else {
    console.log("No such document!");
  }
}

type Props = {
  session: Session | null,
}

export default async function NavBar({ session }: Props) {
  const userId = (session?.user as any).id
  const userInfo = await getUserInfo(userId)
  const userNoti = await getUserNoti(userId)

  return (
    <nav className="py-2 border-b-2 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-semibold">
          Aninagori
        </Link>
        <SearchBar userInfo={userInfo as any} />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBtn userNoti={userNoti as Notification[]} />
        <ProfilePicture userInfo={userInfo as any} />
      </div>
    </nav>
  )
}
