'use client'

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
      className={`rounded-full w-${size} h-${size} object-cover ${className} flex-shrink-0`}
      src={imageUrl || '/bocchi.jpg'}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = "/bocchi.jpg";
      }}
      alt={altText}
      title={altText}
    />
  );
};

export default Avatar;