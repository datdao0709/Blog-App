import { getItem, setItem } from '../utils/localStorage';
import { generateId } from '../utils/generateId';

const POSTS_KEY = 'posts';

export const getAllPosts = () => {
    return getItem(POSTS_KEY) || [];
};

export const getPostById = (id) => {
    const posts = getAllPosts();
    return posts.find(post => post.id === id);
};

export const addPost = (post) => {
    const posts = getAllPosts();
    const newPost = { ...post, id: generateId() };
    posts.push(newPost);
    setItem(POSTS_KEY, posts);
    return newPost;
};

export const updatePost = (id, updatedData) => {
    const posts = getAllPosts();
    const updatedPosts = posts.map(post =>
        post.id === id ? { ...post, ...updatedData } : post
    );
    setItem(POSTS_KEY, updatedPosts);
};

export const deletePost = (id) => {
    const posts = getAllPosts();
    const updatedPosts = posts.filter(post => post.id !== id);
    setItem(POSTS_KEY, updatedPosts);
};