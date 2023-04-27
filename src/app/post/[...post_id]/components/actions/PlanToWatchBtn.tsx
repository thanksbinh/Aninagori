import { RiAddCircleLine } from "@react-icons/all-files/ri/RiAddCircleLine"
import { useContext } from "react"
import { PostContext } from "../../PostContext"
import { RiCheckboxCircleLine } from "@react-icons/all-files/ri/RiCheckboxCircleLine"
import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase-app"

// const onPlanToWatch = async () => {
// if (!!!animeID) {
//   alert("You can't plan to watch anime without name 😥")
//   return
// }
// // user have connect to MAL
// setLoadingPlanTowatch(true)
// if (!!malAuthCode) {
//   fetch(getProductionBaseUrl() + "/api/updatestatus/" + animeID, {
//     headers: {
//       status: "plan_to_watch",
//       episode: "0",
//       score: "0",
//       auth_code: malAuthCode,
//     } as any,
//   }).then((res) => res.json()).then((data) => {
//     setLoadingPlanTowatch(false)
//     setPlanTowatch(true)
//   })
//   return
// }
// // user not connect to MAL
// const dateNow = getDateNow()
// const myAnimeListRef = doc(db, "myAnimeList", myUserInfo?.username)
// const animeInformation = await fetch(getProductionBaseUrl() + "/api/anime/" + animeID).then((res) => res.json())
// const animeData = {
//   list_status: {
//     is_rewatching: false,
//     num_episodes_watched: 0,
//     score: 0,
//     status: "plan_to_watch",
//     updated_at: dateNow,
//   },
//   node: {
//     id: animeID,
//     main_picture: animeInformation.main_picture,
//     title: animeInformation.title,
//   },
// }
// const animeDataAfterCheck = await adjustAnimeListArray(myUserInfo?.username, animeData)
// const myAnimeListPromise = await setDoc(myAnimeListRef, {
//   last_updated: dateNow,
//   animeList: animeDataAfterCheck,
// })
// setLoadingPlanTowatch(false)
// setPlanTowatch(true)
// }

const PlanToWatch = ({ animeStatus }: { animeStatus: string }) => {
  const { myUserInfo, animeID } = useContext(PostContext)

  const onPlanToWatch = async () => {
    // await updateDoc(doc(db, "myAnimeList", myUserInfo?.username), {
    //   animeList: arrayUnion({})
    // })
    console.log("plan to watch")
  }

  return !animeID ? (
    <button title="can't find this anime" className={`flex items-center space-x-1 text-gray-600 hover:cursor-default`}>
      <RiAddCircleLine className="w-5 h-5" />
      <span>Plan to Watch</span>
    </button>
  ) : animeStatus === 'completed' ? (
    <button title="you've finished this anime" className={`flex items-center space-x-1 text-blue-500 hover:cursor-default`}>
      <RiCheckboxCircleLine className="w-5 h-5" />
      <span>Completed</span>
    </button>
  ) : animeStatus === 'watching' ? (
    <button title="you're watching this anime" className={`flex items-center space-x-1 text-green-500 hover:cursor-default`}>
      <RiCheckboxCircleLine className="w-5 h-5" />
      <span>Watching</span>
    </button>
  ) : animeStatus === 'plan_to_watch' ? (
    <button title="you're planning to watch this anime" className={`flex items-center space-x-1 text-white hover:cursor-default`}>
      <RiCheckboxCircleLine className="w-5 h-5" />
      <span>Plan to Watch</span>
    </button>
  ) : (
    <button onClick={onPlanToWatch} title="add anime to plan to watch list" className={`flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]`}>
      <RiAddCircleLine className="w-5 h-5" />
      <span>Plan to Watch</span>
    </button>
  )
}

export default PlanToWatch