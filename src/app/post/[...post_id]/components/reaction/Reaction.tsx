import { useIsVisible } from "@/components/utils/useIsInViewport"
import { useContext, useEffect, useRef, useState } from "react"
import { HiHeart } from "@react-icons/all-files/hi/HiHeart"
import { HiOutlineHeart } from "@react-icons/all-files/hi/HiOutlineHeart"
import { PostContext } from "../../PostContext"
import { sentReaction, updateAnimePreference } from "./doReaction"

interface ReactionItem {
  id: number;
  name: string;
  image: string;
}

const Reaction = ({ reactions }: { reactions: Object[] }) => {
  const { myUserInfo, content, authorName, animeID, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(reactions.some((e: any) => e.username === myUserInfo.username))
  const [read, setRead] = useState(false)

  const ref = useRef(null)
  const visible = useIsVisible(ref)

  const [reactionType, setReactionType] = useState("")
  const [showReactions, setShowReactions] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionItem | null>(null);

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

  const reactionList: ReactionItem[] = [
    { id: 1, name: "Naisu", image: "/reactions/Naisu.png" },
    { id: 2, name: "Kawaii", image: "/reactions/Kawaii.png" },
    { id: 3, name: "Haha", image: "/reactions/Uwooaaghh.png" },
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
    if (!myUserInfo.username) return alert("You need to login to react")

    const myReaction = {
      username: myUserInfo.username,
      image: myUserInfo.image, // Might be removed
      type: type
    }

    sentReactionOnPost(myUserInfo, myReaction, reactionToggle, authorName, content, postId, reactions)
    updateAnimePreference(myUserInfo, animeID, !reactionToggle)
    if (reactionType === type)
      setReactionToggle(!reactionToggle)
    else
      setReactionType(type)
  }

  return (
    <div ref={ref} className={`relative flex ${!reactionToggle ? "my-3" : ""}`}>
      <div className="flex justify-center items-center" ref={refClick}>
        <button title="react" className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]" onMouseEnter={onMouseEnter} onClick={() => onReaction("Naisu")}>
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
              <div className="bg-white rounded-lg shadow-lg flex p-2 scale-in-bl" onMouseLeave={() => setShowReactions(false)}>
                {reactionList.map((reaction) => (
                  <div key={reaction.id} className="relative flex flex-col items-center justify-center">
                    {hoveredReaction?.id === reaction.id &&
                      <div className="flex flex-col absolute -top-12 bg-black text-white p-1 rounded-lg">{reaction.name}</div>
                    }
                    <div className="flex relative w-12 h-12 mx-2 rounded-full hover:scale-[1.2] transition-all duration-200" onMouseEnter={() => setHoveredReaction(reaction)} onMouseLeave={() => setHoveredReaction(null)}>
                      <img className="w-full h-auto" src={reaction.image} alt={reaction.name} />
                      <button className="absolute inset-0 p-2 rounded-full" onClick={() => onReaction(reaction.name)}></button>
                    </div>
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