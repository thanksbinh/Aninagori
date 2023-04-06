'use client';
import { Timestamp } from "firebase/firestore";

export interface Notification {
  title: string;
  url: string;
  sender: {
    id: string;
    username: string;
    image: string;
  };
  type: string;
  timestamp: Timestamp;
  read: boolean | null;
}
