import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import PostCard from "./PostCard";

export default function Home() {
  const [posts, setPosts] = useState();

  const getPosts = async () => {
    const postQuery = query(
      collection(firestore, "Post"),
      orderBy("time", "desc"),
      limit(20)
    );
    const posts = await getDocs(postQuery);

    const postData = [];
    posts.forEach((post) => {
      postData.push({ pid: post.id, ...post.data() });
    });

    setPosts(postData);
  };

  useEffect(() => {
    if (posts === undefined) getPosts();
  }, [posts]);

  return (
    <div className="after-nav posts">
      {posts &&
        posts.map((post) => (
          <PostCard
            pid={post.pid}
            title={post.title}
            img={post.imgid}
            sub={post.sid}
            time={post.time}
            cc={post.commentCount}
            uid={post.uid}
            points={post.points}
          />
        ))}
    </div>
  );
}
