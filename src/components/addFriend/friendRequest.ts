import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { UserInfo } from "../nav/NavBar";
import { Notification } from "../nav/Notification/NotificationComponent";

// Self info -> Person's friend request list
async function makeFriendRequest(myUserInfo: UserInfo, userId: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    friend_request_list: arrayUnion({
      username: myUserInfo.username,
      image: myUserInfo.image,
      timestamp: new Date(),
      read: false,
    })
  });
}

// Person's info remove from Self friend request list
async function removeFriendRequest(myUserInfo: UserInfo, noti: Notification) {
  const myUserRef = doc(db, 'users', myUserInfo.id);
  updateDoc(myUserRef, {
    friend_request_list: arrayRemove({
      username: noti.sender.username,
      image: noti.sender.image,
      timestamp: noti.timestamp,
      read: noti.read,
    })
  });
}

// Self info -> Person's friend list
async function addSelfToFriendList(myUserInfo: UserInfo, noti: Notification) {
  const usernameQuery = query(collection(db, "users"), where("username", "==", noti.sender.username))
  const querySnapshot = await getDocs(usernameQuery)

  if (querySnapshot.docs.length != 1) {
    console.log("Username invalid!");
    return;
  }

  const friendUserRef = querySnapshot.docs[0].ref
  await updateDoc(friendUserRef, {
    friend_list: arrayUnion({
      username: myUserInfo.username,
      image: myUserInfo.image,
    })
  });
}

// Person's info -> Self friend list
async function addPersonToMyFriendList(myUserInfo: UserInfo, noti: Notification) {
  const myUserRef = doc(db, 'users', myUserInfo.id);
  await updateDoc(myUserRef, {
    friend_list: arrayUnion({
      username: noti.sender.username,
      image: noti.sender.image,
    })
  });
}

function beFriends(myUserInfo: UserInfo, noti: Notification) {
  addSelfToFriendList(myUserInfo, noti)
  addPersonToMyFriendList(myUserInfo, noti)
}

export { makeFriendRequest, removeFriendRequest, beFriends }