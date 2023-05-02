import { FC } from "react";

type AvatarProps = {
  imageUrl: string;
  altText: string;
  size?: number;
  className?: string
};

const Avatar: FC<AvatarProps> = ({ imageUrl, altText, size, className = '' }) => {
  return (
    <img
      className={`rounded-full w-${size} h-${size} object-cover ${className}`}
      src={imageUrl || '/bocchi.jpg'}
      alt={altText}
    />
  );
};

export default Avatar;