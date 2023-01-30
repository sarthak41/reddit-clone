import React from "react";
import addphotoIcon from "../images/svgs/addphoto.svg";
import {
  doc,
  addDoc,
  getDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { firestore, storage } from "../firebase/index";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

export default function Submit({
  user,
  setShowLoginModal,
  subreddit,
  setSubreddit,
}) {
  const [alertMsg, setAlertMsg] = useState("");
  const [imgName, setImgName] = useState("");

  const createPost = async (event) => {
    try {
      event.preventDefault();
      const timestamp = Math.floor(new Date().getTime() / 1000);
      const subreddit = document.getElementById("subreddit");
      const subname = subreddit.value.trim().toLowerCase();
      const title = document.getElementById("title");
      const postBody = document.getElementById("post-body");
      const postImg = document.getElementById("post-img");

      const subRef = doc(firestore, "Subreddit", subname);
      const sub = await getDoc(subRef);
      const subData = sub.data();

      if (!subData) throw new Error("Subreddit doesn't exist");
      else if (!title) throw new Error("Title Required");
      else {
        let post = {
          time: new Date(),
          uid: user.uid,
          sid: subname,
          points: 0,
          title: title.value,
          commentCount: 0,
        };
        if (postBody.value) {
          post = { ...post, text: postBody.value };
        }
        if (postImg.files[0]) {
          post = { ...post, imgid: timestamp + "-" + postImg.files[0].name };
        }
        await addDoc(collection(firestore, "Post"), post);
        if (postImg.files[0]) {
          const storageRef = ref(
            storage,
            `images/${timestamp}-${postImg.files[0].name}`
          );
          await uploadBytes(storageRef, postImg.files[0]);
        }
        setAlertMsg("Your post has been made!");
        setTimeout(() => {
          setAlertMsg("");
        }, 2000);
      }
    } catch (error) {
      setAlertMsg(error.message);
    }
  };

  return !user ? (
    <div className="after-nav center">
      Please{" "}
      <button className="btn-link" onClick={() => setShowLoginModal(true)}>
        login
      </button>{" "}
      to post
    </div>
  ) : (
    <div className="after-nav center grid">
      <div className="post">
        {alertMsg && <div className="err-msg position-top">{alertMsg}</div>}
        <h3>Create a post</h3>
        <form onSubmit={createPost}>
          <input
            type="text"
            id="subreddit"
            placeholder="Subreddit"
            value={subreddit ? subreddit : ""}
            required
            maxLength="300"
            onChange={(e) => setSubreddit(e.target.value)}
          />
          <input
            id="title"
            type="text"
            placeholder="Title"
            required
            maxLength="300"
          />
          <textarea
            name="post-body"
            id="post-body"
            cols="30"
            rows="10"
            placeholder="Text (optional)"
            maxLength="40000"
          ></textarea>
          <div className="flex ">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <label htmlFor="post-img">
                <img src={addphotoIcon} alt="Add to post" className="icon" />
              </label>
              <span>{imgName}</span>
              {imgName && (
                <button
                  type="button"
                  onClick={() => {
                    const img = document.getElementById("post-img");
                    img.value = "";
                    setImgName("");
                  }}
                >
                  Remove image
                </button>
              )}
              <input
                id="post-img"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  setImgName(e.target.files[0].name);
                }}
              />
            </div>
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
      <div className="rule-card">
        <h4>Posting to Reddit</h4>
        <ol>
          <li> Remember the human</li>
          <li> Behave like you would in real life</li>
          <li> Look for the original source of content</li>
          <li> Search for duplicates before posting</li>
          <li> Read the community’s rules</li>
        </ol>
      </div>
    </div>
  );
}
