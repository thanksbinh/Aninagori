import { useContext, useEffect, useState } from "react"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2"
import { PostContext } from "../context/PostContext"
import { sentReaction } from "./doReaction"

const Reaction = ({ reactions }: { reactions: Object[] }) => {
  const { myUserInfo, content, authorName, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(reactions.some((e: any) => e.username === myUserInfo.username))

  useEffect(() => {
    reactions.length && setReactionToggle(reactions.some((e: any) => e.username === myUserInfo.username))
  }, [reactions])

  const onReaction = async () => {
    const myReaction = {
      username: myUserInfo.username,
      image: myUserInfo.image, // Might be removed
      type: "heart"
    }

    setReactionToggle(!reactionToggle)
    sentReaction(myUserInfo, myReaction, reactionToggle, authorName, content, postId)
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