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

export default function Comments({ postId, comments }) {
  const [usernames, setUsernames] = useState();
  const currTime = new Date().getTime() / 1000;

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
      comments.forEach(async (comm) => {
        const user = await getDoc(doc(firestore, "User", comm.uid));
        usernames.set(comm.time.seconds, user.data().username);
        setUsernames(usernames);
      });
    }
  };

  const renderAllComments = () => {
    return (
      comments &&
      usernames && (
        <div className="card flex-column justify-start">
          {comments.map((comment) => {
            const time = comment.time.seconds
              ? Math.floor(currTime - comment.time.seconds)
              : 0;
            console.log(usernames);
            return renderComment(
              usernames.get(comment.time.seconds),
              time,
              comment.text
            );
          })}
        </div>
      )
    );
  };

  useEffect(() => {
    getUsernames();
  }, [comments]);

  return comments && usernames && renderAllComments();
}
