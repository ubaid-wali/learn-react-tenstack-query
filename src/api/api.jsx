import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// to fetch the data

export const fetchPosts = async (pageNumber) => {
  const res = await api.get(`/posts?_start=${pageNumber}&_limit=3`);
  return res.status === 200 ? res.data : [];
};

// to fetch the inv. data

export const fetchInvPost = async (id) => {
  try {
    const res = await api.get(`/posts/${id}`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
  }
};

// ..pagination
// https://jsonplaceholder.typicode.com/posts?_start=1&_limit=3
