
export interface UserInfo {
  "id": string;
  "username": string;
  "image": string;
  "friend_list"?: Object[];
  "is_admin"?: boolean;
  "is_banned"?: boolean;
}