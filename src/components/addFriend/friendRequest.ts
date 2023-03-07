import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { UserInfo } from "../nav/NavBar";
import { Notification } from "../nav/Notification/Notification";

export interface FriendRequestDoc {
  id: string,
  username: string,
  image: string,
  timestamp: string,
  read: string,
}

// Self info -> Person's friend request list
async function makeFriendRequest(myUserInfo: UserInfo, userId: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    friend_request_list: arrayUnion({
      id: myUserInfo.id,
      username: myUserInfo.username,
      image: myUserInfo.image,
      timestamp: new Date(),
    })
  });
}

// Person's info remove from Self friend request list
async function removeFriendRequest(myUserInfo: UserInfo, noti: Notification) {
  const myUserRef = doc(db, 'users', myUserInfo.id);
  updateDoc(myUserRef, {
    friend_request_list: arrayRemove({
      id: noti.sender.id,
      username: noti.sender.username,
      image: noti.sender.image,
      timestamp: noti.timestamp,
      read: noti.read,
    })
  });
}

// Person's info remove from Self friend request list
async function removeFriendRequestByRequest(myUserInfo: UserInfo, request: FriendRequestDoc) {
  const myUserRef = doc(db, 'users', myUserInfo.id);
  updateDoc(myUserRef, {
    friend_request_list: arrayRemove({
      id: request.id,
      username: request.username,
      image: request.image,
      timestamp: request.timestamp,
      read: request.read,
    })
  });
}

// Self info -> Person's friend list
async function addSelfToFriendList(myUserInfo: UserInfo, userInfo: UserInfo) {
  const friendUserRef = doc(db, 'users', userInfo.id);
  await updateDoc(friendUserRef, {
    friend_list: arrayUnion({
      username: myUserInfo.username,
      image: myUserInfo.image,
    })
  });
}

// Person's info -> Self friend list
async function addPersonToMyFriendList(myUserInfo: UserInfo, userInfo: UserInfo) {
  const myUserRef = doc(db, 'users', myUserInfo.id);
  await updateDoc(myUserRef, {
    friend_list: arrayUnion({
      username: userInfo.username,
      image: userInfo.image,
    })
  });
}

function beFriends(myUserInfo: UserInfo, userInfo: UserInfo) {
  addSelfToFriendList(myUserInfo, userInfo)
  addPersonToMyFriendList(myUserInfo, userInfo)
}

export { makeFriendRequest, removeFriendRequest, removeFriendRequestByRequest, beFriends }