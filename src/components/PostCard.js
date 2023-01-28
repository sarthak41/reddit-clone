import { collection, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { firestore, storage } from "../firebase";
import { toTimeAgo } from "../helpers";
import commentIcon from "../images/svgs/comment.svg";
import shareIcon from "../images/svgs/share.svg";

export default function PostCard({
  pid,
  title,
  time,
  sub,
  img,
  cc,
  uid,
  points,
}) {
  const [username, setUsername] = useState("");
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    async function getUnameAndImg() {
      setUsername((await getDoc(doc(firestore, "User", uid))).data().username);
      if (img) setImgSrc(await getDownloadURL(ref(storage, `images/${img}`)));
    }
    getUnameAndImg();
  }, []);

  return (
    username && (
      <Link to={`/r/${sub}/post/${pid}`}>
        <div className="post-card-2 card-2" post-id={pid}>
          {/* <Vote
          points={points}
          position="left"
          user={user}
          setShowLoginModal={setShowLoginModal}
          dbVote={dbVote}
          setPoints={setPoints}
        /> */}
          <div className="info">
            <div style={{ color: "black" }}>r/{sub}</div>⋅
            <div>
              Posted by u/{username}{" "}
              {toTimeAgo(new Date().getTime() / 1000 - time.seconds)}
            </div>
            ⋅<div style={{ color: "black" }}>{points} points</div>
          </div>
          <h3 className="title">{title}</h3>
          {imgSrc && <img src={imgSrc} alt="" className="post-img" />}
          <div className="group info justify-start">
            <div className="centre">
              <img
                src={commentIcon}
                alt="Comment on this post"
                className="icon flex"
              />
              {cc} comments
            </div>
            <div className="centre">
              <img src={shareIcon} alt="Share this post" className="icon" />
              Share
            </div>
          </div>
        </div>
      </Link>
    )
  );
}
