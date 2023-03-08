import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, doc,  updateDoc } from "firebase/firestore";
import { UserInfo } from "../nav/NavBar";
import { FriendRequest } from "../nav/notification/FriendRequest";

async function notifyFriendRequestAccept(myUserInfo: UserInfo, userId: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    notification: arrayUnion({
      title: "You and " + myUserInfo.username + " are now friends!",
      url: "/user/" + myUserInfo.username,
      sender: {
        id: myUserInfo.id,
        username: myUserInfo.username,
        image: myUserInfo.image,
      },
      type: "friend request accepted",
      timestamp: new Date(),
      read: null,
    })
  });
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
async function removeFriendRequest(myUserInfo: UserInfo, noti: FriendRequest) {
  const myUserRef = doc(db, 'users', myUserInfo.id);
  updateDoc(myUserRef, {
    friend_request_list: arrayRemove(noti)
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
  notifyFriendRequestAccept(myUserInfo, userInfo.id)
}

export { makeFriendRequest, removeFriendRequest, beFriends }