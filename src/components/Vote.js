import React, { useState } from "react";
import downvoteIcon from "../images/svgs/arrow-down.svg";
import upvoteIcon from "../images/svgs/arrow-up.svg";
import "../styles/vote.css";
import { useEffect } from "react";
import {
  collection,
  doc,
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
  setPoints,
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

      const postId = voteBtnDiv.getAttribute("post-id");
      const commentId = voteBtnDiv.getAttribute("comment-id");

      let idType;
      let coll;

      if (postId) {
        idType = "pid";
        coll = "Post";
      } else {
        idType = "cid";
        coll = "Comment";
      }

      const id = idType === "pid" ? postId : commentId;

      const voteQuery = query(
        collection(firestore, "Vote"),
        where(idType, "==", id),
        where("uid", "==", user.uid)
      );
      const voteSnapshot = await getDocs(voteQuery);
      const voteData = voteSnapshot.docs[0];
      if (voteData) {
        if (voteData.data().point !== voteType) {
          //change upvote to downvote or vice versa
          setVotes(voteType);
          await updateDoc(doc(firestore, "Vote", voteData.id), {
            point: voteType,
          });

          await updateDoc(doc(firestore, coll, id), {
            points: points + voteType - voteData.data().point,
          });
          setPoints(points + voteType - voteData.data().point);
        } else {
          //retract vote
          setUpvoted(false);
          setDownvoted(false);
          await deleteDoc(doc(firestore, "Vote", voteData.id));

          await updateDoc(doc(firestore, coll, id), {
            points: points - voteType,
          });
          setPoints(points - voteType);
        }
      } else {
        //first time vote
        setVotes(voteType);
        if (postId) {
          await addDoc(collection(firestore, "Vote"), {
            uid: user.uid,
            pid: postId,
            point: voteType,
          });
        } else if (commentId) {
          await addDoc(collection(firestore, "Vote"), {
            uid: user.uid,
            cid: commentId,
            point: voteType,
          });
        }

        await updateDoc(doc(firestore, coll, id), {
          points: points + voteType,
        });
        setPoints(points + voteType);
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
