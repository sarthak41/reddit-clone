import React, { useState } from "react";
import Vote from "./Vote";
import { toTimeAgo } from "../helpers/index";

export default function Comment({
  username,
  seconds,
  text,
  id,
  points,
  user,
  setShowLoginModal,
  dbVote,
}) {
  return (
    <div className="flex-col justify-start gap-8 comment">
      <div className="info">
        <div style={{ color: "black" }}>{username}</div> ⋅{" "}
        <div>{toTimeAgo(seconds)}</div>
      </div>
      <div>{text}</div>
      <div className="centre info gap-20" comment-id={id}>
        <Vote
          points={points}
          position="bottom"
          user={user}
          setShowLoginModal={setShowLoginModal}
          dbVote={dbVote}
        />
        <button>Reply</button>
      </div>
    </div>
  );
}
