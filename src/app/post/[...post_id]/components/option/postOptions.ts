import { db } from "@/firebase/firebase-app"
import {
  deleteDoc,
  doc,
  getDoc,
  writeBatch,
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore"

import { storage } from "@/firebase/firebase-app"
import { deleteObject, ref } from "firebase/storage"

export async function moveToTrash(postId: string) {
  const postRef = doc(db, "posts", postId)
  const postDoc = await getDoc(postRef)

  if (postDoc.data()?.imageUrl && typeof postDoc.data()?.imageUrl === "object") {
    const imageProimseArray = postDoc.data()?.imageUrl.map((image: string) => deleteMediaFiles(image))
    await Promise.all([
      await deleteCollection(postId),
      await Promise.all(imageProimseArray),
      await deleteMediaFiles(postDoc.data()?.imageUrl, postDoc.data()?.videoUrl),
      await deleteDoc(postRef),
    ])
    return
  }

  await Promise.all([
    await deleteCollection(postId),
    await deleteMediaFiles(postDoc.data()?.imageUrl, postDoc.data()?.videoUrl),
    await deleteDoc(postRef),
  ])

  console.log("Post moved to trash")
}

export async function banUser(authorName?: string) {
  if (!authorName) return

  const userQuery = query(collection(db, "users"), where("username", "==", authorName), limit(1))
  const userRef = (await getDocs(userQuery)).docs[0].ref
  updateDoc(userRef, { is_banned: true })
}

async function deleteMediaFiles(imageUrl?: string, videoUrl?: string) {
  try {
    if (imageUrl) {
      await deleteObject(ref(storage, imageUrl))
      console.log("Image deleted")
    } else if (videoUrl) {
      await deleteObject(ref(storage, videoUrl))
      console.log("Video deleted")
    } else {
      console.log("No media to delete")
    }
  } catch (error) {
    console.log("Delete media error", error)
  }
}

async function deleteCollection(postId: string) {
  const collectionRef = collection(db, "posts", postId, "comments")
  const cmtQuery = query(collectionRef, limit(10))

  return new Promise((resolve: any, reject) => {
    deleteQueryBatch(cmtQuery, resolve).catch(reject)
  })
}

async function deleteQueryBatch(query: any, resolve: any) {
  const snapshot = await getDocs(query)

  const batchSize = snapshot.size
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve()
    console.log("Comments deleted")
    return
  }

  // Delete documents in a batch
  const batch = writeBatch(db)
  snapshot.docs.forEach((doc: { ref: any }) => {
    batch.delete(doc.ref)
  })
  await batch.commit()

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve)
  })
}
