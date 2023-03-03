import { FC } from "react";

type AvatarProps = {
  imageUrl: string;
  altText: string;
  size?: number;
};

const Avatar: FC<AvatarProps> = ({ imageUrl, altText, size = 8 }) => {
  return (
    <img
      className={`rounded-full w-${40} h-${40} object-cover`}
      src={imageUrl}
      alt={altText}
    />
  );
};

export default Avatar;
