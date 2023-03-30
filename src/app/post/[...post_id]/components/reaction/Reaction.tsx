import { useIsVisible } from "@/components/utils/useIsInViewport"
import { useContext, useEffect, useRef, useState } from "react"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2"
import { PostContext } from "../context/PostContext"
import { sentReaction, updateAnimePreference } from "./doReaction"

const Reaction = ({ reactions }: { reactions: Object[] }) => {
  const { myUserInfo, content, authorName, animeID, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(reactions.some((e: any) => e.username === myUserInfo.username))
  const [read, setRead] = useState(false)

  const ref = useRef(null)
  const visible = useIsVisible(ref)

  const [showReactions, setShowReactions] = useState(false);

  const [currentReaction, setCurrentReaction] = useState({
    username: myUserInfo.username,
    image: myUserInfo.image,
    type: ""
  })

  const reactionList = [
    { id: 1, name: "Naisu", image: "/reactions/Naisu.png" },
    { id: 2, name: "Kawaii", image: "/reactions/Kawaii.png" },
    { id: 3, name: "Uwooaaghh", image: "/reactions/Uwooaaghh.png" },
    { id: 4, name: "Wow", image: "/reactions/Wow.png" },
    { id: 5, name: "Kakkoii", image: "/reactions/Kakkoii.png" },
    { id: 6, name: "Hehe", image: "/reactions/Hehe.png" },
  ];

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

    setCurrentReaction(myReaction);
  }

  return (
    <div ref={ref} className="relative flex">
      <button title="react" onClick={onReaction} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]" 
        onMouseEnter={() => setShowReactions(true)}
      >
        {reactionToggle ? <HiHeart className="w-5 h-5 fill-[#F14141]" /> : <HiOutlineHeart className="w-5 h-5" />}
      </button>
      {showReactions && (
        <div className="absolute top-0 -mt-16 flex justify-between items-start w-full">
          <div className="bg-white rounded-lg shadow-lg flex p-2" onMouseLeave={() => setShowReactions(false)}>
            {reactionList.map((reaction) => (
              <div key={reaction.id} className="relative w-12 h-12 mx-2 rounded-full hover:scale-[1.2] transition-all duration-200">
                <img className="w-full h-auto" src={reaction.image} alt={reaction.name} />
                <button className="absolute inset-0 p-2 rounded-full"></button>
              </div>
            ))}
          </div>
        </div>
      )}
      <span className="text-gray-400 mx-2">{currentReaction.type}</span>
      <span className="text-gray-400 ml-2">{reactions.length}</span>
    </div>
  )
}

export default Reaction;