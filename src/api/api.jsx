import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// to fetch the data

export const fetchPosts = async (pageNumber) => {
  try {
    const res = await api.get(`/posts?_start=${pageNumber}&_limit=3`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
  }
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

export const deletePost = (id) => {
  try {
    return api.delete(`/posts/${id}`);
  } catch (error) {
    console.log(error);
  }
};

//  to update the post
export const updatePost = (id) => {
  try {
    return api.patch(`/posts/${id}`, { title: "I have updated" });
  } catch (error) {
    console.log(error);
  }
};

// infinite scrolling

export const fetchUsers = async ({ pageParam = 1 }) => {
  try {
    const res = await axios.get(
      `https://api.github.com/users?per_page=10&page=${pageParam}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// ..pagination
// https://jsonplaceholder.typicode.com/posts?_start=1&_limit=3
