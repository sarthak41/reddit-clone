import { getDoc, doc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { firestore } from "../firebase";
import Comment from "./Comment";

export default function Comments({
  postId,
  comments,
  user,
  setShowLoginModal,
}) {
  const [usernames, setUsernames] = useState();
  const currTime = new Date().getTime() / 1000;

  const renderComment = (id, username, seconds, text, points) => {
    return (
      <Comment
        cid={id}
        username={username}
        seconds={seconds}
        text={text}
        user={user}
        setShowLoginModal={setShowLoginModal}
      />
    );
  };

  const getUsernames = () => {
    if (comments) {
      const usernames = new Map();
      comments.forEach(async (comm) => {
        if (comm.data) {
          const comment = comm.data();
          const user = await getDoc(doc(firestore, "User", comment.uid));
          usernames.set(comment.time.seconds, user.data().username);
          setUsernames(usernames);
        }
      });
    }
  };

  const renderAllComments = () => {
    return (
      comments &&
      usernames && (
        <div className="card flex-column justify-start">
          {comments.map((comm) => {
            if (comm.data) {
              const comment = comm.data();
              const time = comment.time.seconds
                ? Math.floor(currTime - comment.time.seconds)
                : 0;

              return renderComment(
                comm.id,
                usernames.get(comment.time.seconds),
                time,
                comment.text,
                comment.points
              );
            } else {
              return renderComment(
                comm.id,
                user.username,
                Math.floor(currTime - comm.time.getTime() / 1000),
                comm.text,
                comm.points
              );
            }
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
