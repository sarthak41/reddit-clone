import {
  getDocs,
  collection,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { firestore } from "../firebase";
import { toTimeAgo } from "../helpers";

export default function Comments({ postId }) {
  const [comments, setComments] = useState(null);
  const [usernames, setUsernames] = useState();
  const currTime = new Date().getTime() / 1000;

  const getComments = async () => {
    const postRef = await getDoc(doc(firestore, "Post", postId));
    const commentsRef = collection(firestore, "Comment");
    const commentQuery = query(commentsRef, where("pid", "==", postRef.id));
    const comments = await getDocs(commentQuery);
    setComments(comments);
  };

  const renderComment = (username, seconds, text) => {
    return (
      <div className="flex-column justify-start gap-8">
        <div className="info">
          <div style={{ color: "black" }}>{username}</div> ⋅{" "}
          <div>{toTimeAgo(seconds)}</div>
        </div>
        <div>{text}</div>
      </div>
    );
  };

  const getUsernames = () => {
    if (comments) {
      const usernames = new Map();
      comments.docs.forEach(async (comm) => {
        const c = comm.data();
        const user = await getDoc(doc(firestore, "User", c.uid));
        usernames.set(comm.id, user.data().username);
      });
      console.log(usernames);
      setUsernames(usernames);
    }
  };

  const renderAllComments = () => {
    return (
      comments &&
      usernames && (
        <div className="card flex-column justify-start">
          {comments.docs.map((commentRef) => {
            const comment = commentRef.data();
            console.log(usernames.get(commentRef.id));
            return renderComment(
              usernames.get(commentRef.id),
              Math.floor(currTime - comment.time.seconds),
              comment.text
            );
          })}
        </div>
      )
    );
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  useEffect(() => {
    getUsernames();
  }, [comments]);

  return comments && usernames ? renderAllComments() : null;
}
