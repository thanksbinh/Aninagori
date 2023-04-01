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
  const [reactionType, setReactionType] = useState("")

  const refClick = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function onMouseEnter() {
    setIsOpen(true);
    setShowReactions(true);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refClick.current && !refClick.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const reactionList = [
    { id: 1, name: "Naisu", image: "/reactions/Naisu.png" },
    { id: 2, name: "Kawaii", image: "/reactions/Kawaii.png" },
    { id: 3, name: "Uwooaaghh", image: "/reactions/Uwooaaghh.png" },
    { id: 4, name: "Wow", image: "/reactions/Wow.png" },
    { id: 5, name: "Kakkoii", image: "/reactions/Kakkoii.png" },
    { id: 6, name: "Nani", image: "/reactions/Nani.png" },
  ];

  useEffect(() => {
    if (reactions.length) {
      const myReaction = reactions.find((e: any) => e.username === myUserInfo.username) as any
      if (!myReaction) return;

      setReactionToggle(true)
      setReactionType(myReaction.type)
    }
  }, [reactions])

  useEffect(() => {
    if (!postId) return;

    if (visible && !read) {
      setRead(true)
      updateAnimePreference(myUserInfo, animeID, reactionToggle)
    }
  }, [visible])

  const onReaction = async (type: string) => {
    const myReaction = {
      username: myUserInfo.username,
      image: myUserInfo.image, // Might be removed
      type: type
    }

    sentReaction(myUserInfo, myReaction, reactionToggle, authorName, content, postId)
    updateAnimePreference(myUserInfo, animeID, !reactionToggle)
    if (reactionType === type)
      setReactionToggle(!reactionToggle)
    else
      setReactionType(type)
  }

  return (
    <div ref={ref} className={`relative flex ${!reactionToggle ? "my-3" : ""}`}>
      <div className="flex justify-center items-center" ref={refClick}>
        <button title="react" className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]"
          onMouseEnter={onMouseEnter} onClick={() => onReaction("Naisu")}
        >
          {reactionToggle
            ? (
              <div className="w-12 h-12 rounded-full flex justify center item center">
                <img className="w-full h-auto" src={reactionList.find((e: any) => e.name == reactionType)?.image || "/reactions/Naisu.png"} alt={"type"} />
              </div>
            )
            : <HiOutlineHeart className="w-5 h-5" />}
        </button>
        {showReactions && (
          <div className="absolute top-0 -mt-16 flex justify-between items-start w-full">
            {isOpen && (
              <div className="bg-white rounded-lg shadow-lg flex p-2" onMouseLeave={() => setShowReactions(false)}>
                {reactionList.map((reaction) => (
                  <div key={reaction.id} className="relative w-12 h-12 mx-2 rounded-full hover:scale-[1.2] transition-all duration-200">
                    <img className="w-full h-auto" src={reaction.image} alt={reaction.name} />
                    <button className="absolute inset-0 p-2 rounded-full" onClick={() => onReaction(reaction.name)}></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <span className="flex text-gray-400 ml-2">{reactions.length}</span>
      </div>
    </div>
  )
}

export default Reaction;