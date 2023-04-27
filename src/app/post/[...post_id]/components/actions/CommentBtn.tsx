import { AiOutlineComment } from "@react-icons/all-files/ai/AiOutlineComment"

const Comment = ({ inputRef, commentCount }: { inputRef: any, commentCount: number }) => {
  const onComment = () => {
    inputRef.current && inputRef.current.focus()
  }

  return (
    <div className="flex text-ani-text-gray">
      <button
        title="comment"
        onClick={onComment}
        className="flex items-center space-x-1 hover:text-[#3BC361]"
      >
        <AiOutlineComment className="w-5 h-5" />
      </button>
      <span className="ml-2">{commentCount}</span>
    </div>
  )
}

export default Comment