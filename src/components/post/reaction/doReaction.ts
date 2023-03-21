import { db } from '@/firebase/firebase-app';
import { UserInfo } from '@/global/types';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

async function sentReaction(myUserInfo: UserInfo, myReaction: any, reactionToggle: boolean, authorName: string, content: string, postId: string, commentId?: string) {
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

async function notifyReaction(myUserInfo: UserInfo, username: string, content: string, postId: string, commentId?: string) {
  const notificationsRef = doc(db, 'notifications', username);
  await updateDoc(notificationsRef, {
    recentNotifications: arrayUnion({
      title: myUserInfo.username + ' reacted to your ' + (commentId ? 'comment: "' : 'post: "') + content.slice(0, 24) + '..."',
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

export { sentReaction, notifyReaction }