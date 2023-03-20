import { db } from "@/firebase/firebase-app"
import { UserInfo } from "@/global/types"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2"
import { PostContext } from "../context/PostContext"

const Reaction = ({ reactions }: { reactions: Object[] }) => {
  const { myUserInfo, content, authorName, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(reactions.some((e: any) => e.username === myUserInfo.username))

  useEffect(() => {
    reactions && setReactionToggle(reactions.some((e: any) => e.username === myUserInfo.username))
  }, [reactions])

  const onReaction = async () => {
    setReactionToggle(!reactionToggle)

    const postRef = doc(db, "posts", postId)
    const myReaction = {
      username: myUserInfo.username,
      image: myUserInfo.image,
      type: "heart"
    }

    if (!reactionToggle) {
      await updateDoc(postRef, {
        reactions: arrayUnion(myReaction)
      });
      notifyReaction(myUserInfo, authorName)
    } else {
      await updateDoc(postRef, {
        reactions: arrayRemove(myReaction)
      });
    }
  }

  async function notifyReaction(myUserInfo: UserInfo, username: string) {
    if (myUserInfo.username === username) return;

    const notificationsRef = doc(db, "notifications", username);
    await updateDoc(notificationsRef, {
      recentNotifications: arrayUnion({
        title: myUserInfo.username + " reacted to your post: " + content.slice(0, 24) + "...",
        url: "/post/" + postId,
        sender: {
          username: myUserInfo.username,
          image: myUserInfo.image,
        },
        type: "reaction",
        timestamp: new Date(),
      })
    });
  }

  return (
    <div className="flex">
      <button title="react" onClick={onReaction} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
        {reactionToggle ? <HiHeart className="w-5 h-5 fill-[#F14141]" /> : <HiOutlineHeart className="w-5 h-5" />}
      </button>
      <span className="text-gray-400 ml-2">{reactions.length}</span>
    </div>
  )
}

export default Reaction;