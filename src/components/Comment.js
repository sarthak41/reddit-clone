import React, { useState } from "react";
import Vote from "./Vote";
import { toTimeAgo } from "../helpers/index";
import { useEffect } from "react";
import { firestore } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export default function Comment({
  username,
  seconds,
  text,
  cid,
  user,
  setShowLoginModal,
}) {
  const [dbVote, setDbVote] = useState(0);
  const [points, setPoints] = useState();

  async function getPoints() {
    if (user && cid) {
      const comment = await getDoc(doc(firestore, "Comment", cid));
      const points = comment.data().points;
      setPoints(points);
    }
  }

  async function getVote() {
    if (user && cid) {
      const voteQuery = query(
        collection(firestore, "Vote"),
        where("cid", "==", cid),
        where("uid", "==", user.uid)
      );
      const voteSnapshot = await getDocs(voteQuery);
      const vote = voteSnapshot.docs[0];

      if (vote) {
        const voteData = vote.data().point;
        if (!voteData) {
          setDbVote(0);
        } else {
          setDbVote(voteData);
        }
      }
    }
  }

  useEffect(() => {
    getVote();
    getPoints();
  }, [user, cid]);

  return (
    <div className="flex-col justify-start gap-8 comment">
      <div className="info">
        <div style={{ color: "black" }}>{username}</div> ⋅{" "}
        <div>{toTimeAgo(seconds)}</div>
      </div>
      <div>{text}</div>
      <div className="centre info gap-20" comment-id={cid}>
        <Vote
          points={points}
          position="bottom"
          user={user}
          setShowLoginModal={setShowLoginModal}
          dbVote={dbVote}
          setPoints={setPoints}
        />
        {/* <button>Reply</button> */}
      </div>
    </div>
  );
}
