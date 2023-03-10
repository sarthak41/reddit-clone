import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore, storage } from "../firebase";
import { toTimeAgo } from "../helpers";
import "../styles/post.css";
import commentIcon from "../images/svgs/comment.svg";
import shareIcon from "../images/svgs/share.svg";
import Comments from "./Comments";
import Vote from "./Vote";

export default function Post({ setShowLoginModal, user }) {
  let { subId, postId } = useParams();
  subId = subId.toLowerCase();

  const currTime = new Date().getTime() / 1000;

  const [alertMsg, setAlertMsg] = useState("");

  const [username, setUsername] = useState("");
  const [timePosted, setTimePosted] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [img, setImg] = useState(null);
  const [comments, setComments] = useState();
  const [commentCount, setCommentCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [dbVote, setDbVote] = useState(0);

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    async function getVote() {
      if (user && postId) {
        const voteQuery = query(
          collection(firestore, "Vote"),
          where("pid", "==", postId),
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
    getVote();
  }, [user, postId]);

  const getComments = async (postRef) => {
    const commentsRef = collection(firestore, "Comment");
    const commentQuery = query(commentsRef, where("pid", "==", postRef.id));
    const comments = await getDocs(commentQuery);
    setComments(comments.docs);
  };

  const renderPost = () => {
    return (
      <div className="post-card card" post-id={postId}>
        <Vote
          points={points}
          position="left"
          user={user}
          setShowLoginModal={setShowLoginModal}
          dbVote={dbVote}
          setPoints={setPoints}
        />
        <div className="info">
          <div style={{ color: "black" }}>r/{subId}</div>???
          <div>
            Posted by u/{username} {timePosted}
          </div>
        </div>
        <h3 className="title">{title}</h3>
        {img && <img src={img} alt="" className="post-img" />}
        <div style={{ whiteSpace: "pre-wrap" }}>{body}</div>
        <div className="group info justify-start">
          <div className="centre">
            <img
              src={commentIcon}
              alt="Comment on this post"
              className="icon flex"
            />
            {commentCount} comments
          </div>
          <div className="centre">
            <img src={shareIcon} alt="Share this post" className="icon" />
            Share
          </div>
        </div>
      </div>
    );
  };

  const filterPost = async (postRef) => {
    const post = postRef.data();
    const user = (await getDoc(doc(firestore, "User", post.uid))).data();
    if (post.imgid) {
      const imgRef = ref(storage, `images/${post.imgid}`);
      const img = await getDownloadURL(ref(storage, `images/${post.imgid}`));
      setImg(img);
    }

    const timeDiff = Math.floor(currTime - post.time.seconds);

    setUsername(user.username);
    setTimePosted(toTimeAgo(timeDiff));
    setTitle(post.title);
    setBody(post.text);
    setCommentCount(post.commentCount);
    setPoints(post.points);

    await getComments(postRef);
  };

  const getPost = async () => {
    try {
      const sub = await getDoc(doc(firestore, "Subreddit", subId));
      const postRef = await getDoc(doc(firestore, "Post", postId));
      if (!sub.data()) throw new Error("Sorry, this page does not exist");
      else if (postRef.data().sid !== subId)
        throw new Error("Sorry, could not find this post");
      else {
        filterPost(postRef);
      }
    } catch (error) {
      setAlertMsg(error.message);
    }
  };

  const postComment = async (event) => {
    try {
      event.preventDefault();
      const commentText = document.getElementById("comment").value;
      const pid = postId;
      const uid = user.uid;

      const comment = {
        pid: pid,
        uid: uid,
        time: new Date(),
        text: commentText,
        points: 0,
      };

      const commentDoc = await addDoc(
        collection(firestore, "Comment"),
        comment
      );
      await updateDoc(doc(firestore, "Post", postId), {
        commentCount: commentCount + 1,
      });
      setCommentCount(commentCount + 1);
      setComments([...comments, { ...comment, id: commentDoc.id }]);
      setAlertMsg("Comment posted");
      setTimeout(() => {
        setAlertMsg("");
      }, 1500);
    } catch (error) {
      setAlertMsg(error.message);
    }
  };

  const renderCommentForm = () => {
    return (
      <div className="post-comment card post">
        <form onSubmit={postComment} style={{ padding: 0 }}>
          <textarea
            name="comment"
            id="comment"
            cols="30"
            rows="10"
            placeholder="What are your thoughts?"
            required
          ></textarea>
          <button type="submit" disabled={!user}>
            Comment
          </button>
        </form>
        {!user ? (
          <div style={{ marginTop: "2rem" }}>
            Please{" "}
            <button
              className="btn-link"
              onClick={() => setShowLoginModal(true)}
            >
              login
            </button>{" "}
            to comment{" "}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="after-nav flex-column">
      {alertMsg && <div className="err-msg position-top">{alertMsg}</div>}
      {renderPost()}
      {renderCommentForm()}
      <Comments
        user={user}
        postId={postId}
        comments={comments}
        setShowLoginModal={setShowLoginModal}
      />
    </div>
  );
}
