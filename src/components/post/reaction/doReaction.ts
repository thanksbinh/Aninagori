import { db } from '@/firebase/firebase-app';
import { UserInfo } from '@/global/types';
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';

async function sentReaction(myUserInfo: UserInfo, myReaction: any, reactionToggle: boolean, authorName: string, content: string, postId: string, commentId?: string, reply?: any) {
  const docRef = commentId ?
    doc(db, 'posts', postId, 'comments', commentId) :
    doc(db, 'posts', postId)

  if (!reactionToggle) {
    await updateDoc(docRef, {
      reactions: arrayUnion(myReaction)
    });
    if (myUserInfo.username != authorName)
      notifyReaction(myUserInfo, authorName, content, postId, commentId)
  } else {
    await updateDoc(docRef, {
      reactions: arrayRemove(myReaction)
    });
  }
}

async function sentReactionReply(myUserInfo: UserInfo, replyReactions: Object[], reactionToggle: boolean, reply: any, postId: string) {
  let oldReply = {
    avatarUrl: reply.avatarUrl,
    content: reply.content,
    timestamp: new Timestamp(reply.realTimestamp!.seconds, reply.realTimestamp!.nanoseconds),
    username: reply.username,
  } as any

  if (reply.reactions)
    oldReply = { ...oldReply, reactions: reply.reactions }

  const docRef = doc(db, 'posts', postId, 'comments', reply.parentId)

  if (!reactionToggle) {
    updateDoc(docRef, {
      replies: arrayRemove(oldReply)
    });
    updateDoc(docRef, {
      replies: arrayUnion({ ...oldReply, reactions: replyReactions })
    });
    if (myUserInfo.username != reply.username)
      notifyReaction(myUserInfo, reply.username, reply.content, postId, reply.parentId)
  } else {
    updateDoc(docRef, {
      replies: arrayRemove(oldReply)
    });
    updateDoc(docRef, {
      replies: arrayUnion({ ...oldReply, reactions: replyReactions })
    });
  }
}

async function notifyReaction(myUserInfo: UserInfo, rcvUsername: string, content: string, postId: string, commentId?: string) {
  const notificationsRef = doc(db, 'notifications', rcvUsername);
  await updateDoc(notificationsRef, {
    recentNotifications: arrayUnion({
      title: myUserInfo.username + ' reacted to your ' + (commentId ? 'comment: "' : 'post: "') + content.slice(0, 24) + (content.length > 24 ? '..."' : ""),
      url: '/post/' + postId + (commentId ? '/comment/' + commentId : ''),
      sender: {
        username: myUserInfo.username,
        image: myUserInfo.image,
      },
      type: 'reaction',
      timestamp: new Date(),
    })
  });
}

export { sentReaction, sentReactionReply }