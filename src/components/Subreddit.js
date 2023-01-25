import React from "react";
import { useParams } from "react-router-dom";

export default function Subreddit() {
  let { subId } = useParams();
  subId = subId.toLowerCase();
  return <div className="after-nav">{subId}</div>;
}
