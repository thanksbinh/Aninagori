import { FriendInfo } from "./FriendInfo.types"

export interface UserInfo {
  id: string
  username: string
  image: string

  name?: string
  email?: string

  friend_list?: FriendInfo[]

  is_admin?: boolean
  is_banned?: boolean

  mal_connect?: any
}
