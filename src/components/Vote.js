import React, { useState } from "react";
import downvoteIcon from "../images/svgs/arrow-down.svg";
import upvoteIcon from "../images/svgs/arrow-up.svg";
import "../styles/vote.css";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  where,
  query,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";

export default function Vote({
  points,
  position,
  user,
  setShowLoginModal,
  dbVote,
}) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    setUpvoted(dbVote === 1 ? true : false);
    setDownvoted(dbVote === -1 ? true : false);
  }, [dbVote]);

  const setVotes = (voteType) => {
    if (voteType === 1) {
      setUpvoted(true);
      setDownvoted(false);
    } else if (voteType === -1) {
      setUpvoted(false);
      setDownvoted(true);
    }
  };

  const submitVote = async (event, voteType) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      const voteBtnDiv = event.target.parentNode.parentNode.parentNode;
      console.log(voteBtnDiv);

      const postId = voteBtnDiv.getAttribute("post-id");
      const commentId = voteBtnDiv.getAttribute("comment-id");
      console.log(postId, commentId);

      let idType;

      if (postId) {
        idType = "pid";
      } else {
        idType = "cid";
      }

      const voteQuery = query(
        collection(firestore, "Vote"),
        where(idType, "==", idType === "pid" ? postId : commentId),
        where("uid", "==", user.uid)
      );
      const voteSnapshot = await getDocs(voteQuery);
      const voteData = voteSnapshot.docs[0];
      if (voteData) {
        if (voteData.data().point !== voteType) {
          setVotes(voteType);
          await updateDoc(doc(firestore, "Vote", voteData.id), {
            point: voteType,
          });
        } else {
          setUpvoted(false);
          setDownvoted(false);
          await deleteDoc(doc(firestore, "Vote", voteData.id));
        }
      } else {
        setVotes(voteType);
        if (postId)
          await addDoc(collection(firestore, "Vote"), {
            uid: user.uid,
            pid: postId,
            point: voteType,
          });
        else if (commentId)
          await addDoc(collection(firestore, "Vote"), {
            uid: user.uid,
            cid: commentId,
            point: voteType,
          });
      }
    }
  };

  return (
    <div className={`vote-sec vote-${position} centre`}>
      <button className="vote-btn" onClick={(e) => submitVote(e, 1)}>
        <img
          src={upvoteIcon}
          alt="Upvote"
          className={`upvote ${upvoted ? "orange-filled" : ""}`}
        />
      </button>
      <div>{points}</div>
      <button className="vote-btn" onClick={(e) => submitVote(e, -1)}>
        <img
          src={downvoteIcon}
          alt="Downvote"
          className={`downvote ${downvoted ? "violet-filled" : ""}`}
        />
      </button>
    </div>
  );
}
