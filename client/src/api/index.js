import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5100' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const fetchPost = (id) => API.get(`/ideas/${id}`);
// export const fetchPosts = (page, dataToken) => API.get(`/ideas?page=${page}dataToken=${dataToken}`);
export const fetchPosts = (page, dataToken) => API.post(`/ideas?page=${page}`, dataToken);
export const fetchPostsByCreator = (name) => API.get(`/ideas/creator?name=${name}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/ideas/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/ideas', newPost);
export const likePost = (id) => API.patch(`/ideas/${id}/likePost`);
export const comment = (value, id) => API.post(`/ideas/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) => API.patch(`/ideas/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/ideas/${id}`);



export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
