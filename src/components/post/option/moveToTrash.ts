import { storage } from "@/firebase/firebase-app";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db } from "@/firebase/firebase-app";

export async function moveToTrash(postId: string) {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);

  const imageUrl = postDoc.data()?.imageUrl;
  const videoUrl = postDoc.data()?.videoUrl;

  try {
    if (imageUrl) {
      await deleteObject(ref(storage, imageUrl))
      console.log("Image deleted")
    }
    else if (videoUrl) {
      await deleteObject(ref(storage, videoUrl))
      console.log("Video deleted")
    }
    else {
      console.log("No media to delete")
    }
  } catch (error) {
    console.log("Delete media error", error)
  }

  deleteDoc(postRef)
  console.log('Post moved to trash')
}