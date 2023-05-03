import { Timestamp } from "firebase/firestore"

export interface PostInfoRaw {
  id: string
  authorName: string
  avatarUrl: string

  content: string
  imageUrl?: string[]
  videoUrl?: string

  post_anime_data?: {
    anime_id: number
    anime_name: string
    episodes_seen?: string
    score?: number
    tag?: string[]
    total_episodes?: string
    watching_progress?: string
  }

  reactions: [{
    username: string
    image: string
    type: string
  }]

  timestamp: Timestamp
}

export interface PostInfo {
  id: string
  authorName: string
  avatarUrl: string

  content: string
  imageUrl?: string | string[]
  videoUrl?: string
  tag?: string[]

  post_anime_data?: {
    anime_id: number
    anime_name: string
    episodes_seen?: number
    score?: string
    tag?: string[]
    total_episodes?: number
    watching_progress?: string
    my_status?: string
  }

  reactions: ReactionInfo[]
  lastComment?: CommentInfo

  timestamp: string
}

export interface CommentInfo {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  reactions?: any[];
  replies?: any[];
  id?: string;

  // Only replies have these
  parentId?: string;
  realTimestamp?: Timestamp;
}

export interface ReactionInfo {
  username: string
  image?: string
  type: string
}