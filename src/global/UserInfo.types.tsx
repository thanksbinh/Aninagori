export interface UserInfo {
  id: string
  username: string
  image: string

  name?: string
  email?: string

  friend_list?: Object[]

  is_admin?: boolean
  is_banned?: boolean

  mal_connect?: any
}
