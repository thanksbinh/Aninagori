import { db } from "@/firebase/firebase-app"
import { doc, updateDoc } from "firebase/firestore"
import { useState } from "react"

export default function AccountSettings({ id, name, username, email }: { id: string, name: string, username: string, email: string }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(name || "")

  const onEditName = async (e?: any) => {
    e.preventDefault();

    if (nameInput && nameInput != name) {
      await updateDoc(doc(db, "users", id), {
        name: nameInput
      })
    }

    setIsEditingName(!isEditingName)
  }

  const onEditUsername = () => {
    console.log('Edit username not ready yet')
  }

  const onEditEmail = () => {
    console.log('Edit email not ready yet')
  }

  return (
    <div className="w-full">
      <h2 className="text-ani-text-white font-bold text-2xl mb-4">General Account Settings</h2>

      <div className="w-full mb-4 border-y-2 border-ani-light-gray">

        <div className="flex justify-between items-center border-b-[1px] border-ani-light-gray p-4">
          <div className="text-ani-text-white font-bold min-w-[25%]">Name</div>
          {isEditingName ? (
            <form onSubmit={onEditName} onBlur={onEditName} className="flex-1">
              <input type="text" className="bg-inherit text-ani-text-white font-semibold" autoFocus value={nameInput} onChange={(e) => { setNameInput(e.target.value) }} />
            </form>
          ) : (
            <div className="text-ani-text-gray font-semibold flex-1">{nameInput || name}</div>
          )}
          <div onClick={onEditName} className="text-blue-500 hover:underline cursor-pointer">Edit</div>
        </div>

        <div className="flex justify-between items-center border-b-[1px] border-ani-light-gray p-4">
          <div className="text-ani-text-white font-bold min-w-[25%]">Username</div>
          <div className="text-ani-text-gray font-semibold flex-1">{username}</div>
          <div onClick={onEditUsername} className="text-gray-500 hover:underline cursor-pointer">Edit</div>
        </div>

        <div className="flex justify-between items-center border-b-[1px] border-ani-light-gray p-4">
          <div className="text-ani-text-white font-bold min-w-[25%]">Contact</div>
          <div className="text-ani-text-gray font-semibold flex-1">{email}</div>
          <div onClick={onEditEmail} className="text-gray-500 hover:underline cursor-pointer">Edit</div>
        </div>
      </div>

    </div>
  )
}