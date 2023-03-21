import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/types";
import { collection, addDoc, updateDoc, doc, arrayUnion, serverTimestamp, Timestamp, getDoc } from "firebase/firestore";

const sendComment = async (myUserInfo: UserInfo, commentStr: string, authorName: string, postContent: string, postId: string) => {
  const commentObject = {
    username: myUserInfo.username,
    avatarUrl: myUserInfo.image,
    content: commentStr,
    timestamp: serverTimestamp(),
  }

  const commentsRef = collection(db, 'posts', postId, "comments");
  const docAdd = await addDoc(commentsRef, commentObject)

  const postRef = doc(db, "posts", postId)
  updateDoc(postRef, { lastComment: { ...commentObject, id: docAdd.id } })
  if (myUserInfo.username != authorName)
    notifyComment("post comment", myUserInfo, authorName, postContent, postId, docAdd.id)

  return {
    ...commentObject,
    id: docAdd.id,
  };
}

const sendReply = async (myUserInfo: UserInfo, replyStr: string, postId: string, commentId: string) => {
  const content = {
    username: myUserInfo.username,
    avatarUrl: myUserInfo.image,
    content: replyStr,
    timestamp: new Date(),
    reactions: [],
  }

  const commentRef = doc(db, 'posts', postId, "comments", commentId!);

  const commentDoc = await getDoc(commentRef)
  if (!commentDoc.exists()) return;

  const commentContent = commentDoc.data().content
  const authorName = commentDoc.data().username

  updateDoc(commentRef, {
    replies: arrayUnion(content)
  })
  if (myUserInfo.username != authorName) {
    notifyComment("comment reply", myUserInfo, authorName, commentContent, postId, commentId, true)
  }

  const tagUsername = replyStr.startsWith('@') ? replyStr.split(" ")[0].replace('@', '') : ""
  if (tagUsername && tagUsername != authorName && tagUsername != myUserInfo.username) {
    notifyComment("comment mention", myUserInfo, tagUsername, commentContent, postId, commentId, true)
  }

  return {
    ...content,
    realTimestamp: Timestamp.fromDate(content.timestamp),
    parentId: commentId,
  }
}

const notifyComment = async (type: string, myUserInfo: UserInfo, rcvUsername: string, commentStr: string, postId: string, commentId: string, reply?: boolean) => {
  let title = ""
  if (type === "post comment") {
    title = myUserInfo.username + ' commented to your post: "' + commentStr.slice(0, 24) + (commentStr.length > 24 ? '..."' : ".")
  } else if (type === "comment reply") {
    title = myUserInfo.username + ' replied to your comment: "' + commentStr.slice(0, 24) + (commentStr.length > 24 ? '..."' : ".")
  } else if (type === "comment mention") {
    title = myUserInfo.username + ' mentioned you in a comment."'
  }

  const notificationsRef = doc(db, 'notifications', rcvUsername);
  await updateDoc(notificationsRef, {
    recentNotifications: arrayUnion({
      title: title,
      url: '/post/' + postId + '/comment/' + commentId,
      sender: {
        username: myUserInfo.username,
        image: myUserInfo.image,
      },
      type: type,
      timestamp: new Date(),
    })
  });
}

export { sendComment, sendReply }