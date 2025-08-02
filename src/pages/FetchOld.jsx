import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/api";

const FetchOld = () => {
  const [posts, setPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState([]);
  // const [isError, setIsError] = useState([]);

  const getPostsData = async () => {
    try {
      const res = await fetchPosts();
      console.log(res);
      res.status === 200 ? setPosts(res.data) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    getPostsData();
  }, []);

  return (
    <div>
      <ul className="section-accordion">
        {posts.map((curElem) => {
          const { id, title, body } = curElem;
          return (
            <li key={id}>
              <p>{title}</p>
              <p>{body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FetchOld;
