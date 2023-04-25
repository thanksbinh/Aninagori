export default function AccountSettings({ name, username, email }: { name: string, username: string, email: string }) {
  const onEditName = () => {
    alert('Edit name not ready yet')
  }

  const onEditUsername = () => {
    alert('Edit username not ready yet')
  }

  const onEditEmail = () => {
    alert('Edit email not ready yet')
  }

  return (
    <div className="w-full">
      <h2 className="text-ani-text-white font-bold text-2xl mb-4">General Account Settings</h2>

      <div className="w-full mb-4 border-y-2 border-ani-light-gray">
        <div className="flex justify-between items-center border-b-[1px] border-ani-light-gray p-4">
          <div className="text-ani-text-white font-bold min-w-[25%]">Name</div>
          <div className="text-ani-text-gray font-semibold flex-1">{name || ""}</div>
          <div onClick={onEditName} className="text-blue-500 hover:underline cursor-pointer">Edit</div>
        </div>

        <div className="flex justify-between items-center border-b-[1px] border-ani-light-gray p-4">
          <div className="text-ani-text-white font-bold min-w-[25%]">Username</div>
          <div className="text-ani-text-gray font-semibold flex-1">{username}</div>
          <div onClick={onEditUsername} className="text-blue-500 hover:underline cursor-pointer">Edit</div>
        </div>

        <div className="flex justify-between items-center border-b-[1px] border-ani-light-gray p-4">
          <div className="text-ani-text-white font-bold min-w-[25%]">Contact</div>
          <div className="text-ani-text-gray font-semibold flex-1">{email}</div>
          <div onClick={onEditEmail} className="text-blue-500 hover:underline cursor-pointer">Edit</div>
        </div>
      </div>

    </div>
  )
}