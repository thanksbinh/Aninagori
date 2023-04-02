import { useIsVisible } from "@/components/utils/useIsInViewport"
import { useContext, useEffect, useRef, useState } from "react"
import { HiHeart } from "@react-icons/all-files/hi/HiHeart"
import { HiOutlineHeart } from "@react-icons/all-files/hi/HiOutlineHeart"
import { PostContext } from "../../PostContext"
import { sentReaction, updateAnimePreference } from "./doReaction"

const Reaction = ({ reactions }: { reactions: Object[] }) => {
  const { myUserInfo, content, authorName, animeID, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(reactions.some((e: any) => e.username === myUserInfo.username))
  const [read, setRead] = useState(false)

  const ref = useRef(null)
  const visible = useIsVisible(ref)

  useEffect(() => {
    reactions.length && setReactionToggle(reactions.some((e: any) => e.username === myUserInfo.username))
  }, [reactions])

  useEffect(() => {
    if (!postId) return;

    if (visible && !read) {
      setRead(true)
      updateAnimePreference(myUserInfo, animeID, reactionToggle)
    }
  }, [visible])

  const onReaction = async () => {
    const myReaction = {
      username: myUserInfo.username,
      image: myUserInfo.image, // Might be removed
      type: "heart"
    }

    sentReaction(myUserInfo, myReaction, reactionToggle, authorName, content, postId)
    updateAnimePreference(myUserInfo, animeID, !reactionToggle)
    setReactionToggle(!reactionToggle)
  }

  return (
    <div ref={ref} className="flex">
      <button title="react" onClick={onReaction} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
        {reactionToggle ? <HiHeart className="w-5 h-5 fill-[#F14141]" /> : <HiOutlineHeart className="w-5 h-5" />}
      </button>
      <span className="text-gray-400 ml-2">{reactions.length}</span>
    </div>
  )
}

export default Reaction;