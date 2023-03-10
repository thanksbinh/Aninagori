import { useState, useEffect } from "react";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db, storage } from "@/firebase/firebase-app";
import Post,  { PostProps }  from "./Post";

const Posts = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);

    useEffect(() => {
      async function fetchData() {        
        const q = query(collection(db, "posts"), orderBy("timeStamp", "desc"));
        const fetchedPosts: PostProps[] = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());

          const post = {
            authorName: doc.data().authorName,
            avatarUrl: doc.data().avatarUrl,
            time: doc.data().timeStamp.toDate().toString(),
            content: doc.data().content,
            imageUrl: doc.data().imgUrl,
            likes: doc.data().likes,
            comments: doc.data().comments,
          } as PostProps;
          fetchedPosts.push(post);
        });
        setPosts(fetchedPosts);
      }  
      fetchData();
    }, []);
    
    return (
        <div>
            {posts.map((post) => (
                <Post
                    authorName={post.authorName}
                    avatarUrl={post.avatarUrl}
                    time={post.time}
                    content={post.content}
                    imageUrl={post.imageUrl}
                    likes={post.likes}
                    comments={post.comments}
                />
            ))}        
        </div>
    )
}

export default Posts