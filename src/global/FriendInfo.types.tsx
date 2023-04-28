import { Timestamp } from "firebase/firestore"

export interface FriendInfoRaw {
  username: string
  image: string
  anime_status?: {
    status: string
    title: string
    updated_at: Timestamp
  }
}
