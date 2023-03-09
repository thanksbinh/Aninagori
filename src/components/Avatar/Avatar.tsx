import { FC } from "react";

type AvatarProps = {
  imageUrl: string;
  altText: string;
  size?: number;
};

const Avatar: FC<AvatarProps> = ({ imageUrl, altText, size = 8 }) => {
  return (
    <img
      className={`rounded-full w-${size} h-${size} object-cover`}
      src={imageUrl}
      alt={altText}
    />
  );
};

export default Avatar;
