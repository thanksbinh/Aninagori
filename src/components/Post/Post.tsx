import { FC } from "react";
import Avatar from "../Avatar/Avatar";

type PostProps = {
  authorName: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
  id: string;
};

const Post: FC<PostProps> = ({
  authorName,
  avatarUrl,
  timestamp,
  content,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pb-0 rounded-b-none">
      <div className="flex items-center space-x-4 mx-2">
        <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        <div>
          <p className="font-bold text-[#dddede]">{authorName}</p>
          <p className="text-gray-500 text-sm">{timestamp}</p>
        </div>
      </div>

      <p className="text-lg mt-4 mb-2 text-[#dddede] mx-2">{content}</p>
      {imageUrl && (
        <div className="mt-4 mx-2">
          <img src={imageUrl} alt={""} className="rounded-2xl" />
        </div>
      )}

      <div className="flex item-center justify-between my-4"></div>
    </div>
  );
};

export default Post;
export type { PostProps };