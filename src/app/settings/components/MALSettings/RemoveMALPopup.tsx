import Modal from "@/components/utils/Modal"
import { db } from "@/firebase/firebase-app"
import { updateDoc, doc, deleteField } from "firebase/firestore"
import { useRouter } from "next/navigation"

const RemoveMALPopup = ({ id, isOpen, onClose }: { id: string, isOpen: boolean, onClose: () => void }) => {
  const router = useRouter()

  const onRemoveMAL = async () => {
    await updateDoc(doc(db, "users", id), {
      mal_connect: deleteField()
    })
    onClose()
    router.refresh()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="bg-ani-gray max-w-[600px] rounded-md shadow-md">
        <h2 className="py-4 text-ani-text-white font-bold text-2xl text-center border-b-[1px] border-ani-light-gray">Remove MyAnimeList?</h2>

        <div className="p-4 border-b-[1px] border-ani-light-gray">
          <p className="text-ani-text-white">This will remove your connection between Aninagori and MyAnimeList.</p><br />
          <p className="text-ani-text-white">Once removed, Aninagori will no longer be able to synchronize anime status and other information with MyAnimeList.</p><br />
          <p className="text-ani-text-white">Your data on both platforms won&apos;t be affected and you can still reconnect to MyAnimeList afterward.</p>
        </div>

        <div className="flex justify-end px-6 py-4">
          <button onClick={onClose} className="text-red-500 font-bold mr-8">Cancel</button>
          <button onClick={onRemoveMAL} className="my-4 py-2 px-4 rounded-md bg-red-500 font-semibold">Remove</button>
        </div>
      </div>
    </Modal>
  )
}

export default RemoveMALPopup