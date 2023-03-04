import { db } from "@/firebase/firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { Session } from "next-auth";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import SearchBar from "./SearchBar";

async function getUserInfo(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      "image": docSnap.data().image || "",
      "username": docSnap.data().username || ""
    }
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

  return (
    <nav className="py-2 border-b-2 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-semibold">
          Aninagori
        </Link>
        <SearchBar />
      </div>
      <div className="flex items-center">
        <ProfilePicture userInfo={userInfo as any} />
      </div>
    </nav>
  )
}
