import { Timestamp } from "firebase/firestore";

export interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  reactions?: any[];
  replies?: any[];
  // A comment has an id
  id?: string;
  // A reply has these
  parentId?: string;
  realTimestamp?: Timestamp;
}
