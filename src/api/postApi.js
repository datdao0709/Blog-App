import {getItem, setItem} from '../utils/localStorage';
import {generateId} from '../utils/generateId';

const POSTS_KEY = 'posts';

export const getAllPosts = () => getItem(POSTS_KEY) || [];
export const getPostById = (id) => getAllPosts().find(p => String(p.id) === String(id)) || null;

export const createPost = (post = {}) => {
    const posts = getAllPosts();
    const newPost = {
        id: generateId(),
        title: (post.title || '').trim() || 'Không có tiêu đề',
        content: post.content || '',
        isPublic: post.isPublic ?? true,
        authorId: post.authorId || null,
        authorName: post.authorName || post.author || null,
        createdAt: new Date().toISOString(),
        updatedAt: null
    };

    posts.push(newPost);
    setItem(POSTS_KEY, posts);
    return newPost;
};

export const updatePost = (id, updatedData = {}) => {
    const posts = getAllPosts();
    let updatedPost = null;
    const newPosts = posts.map(p => String(p.id) === String(id) ? (updatedPost = {
        ...p,
        ...updatedData,
        title: updatedData.title !== undefined ? (updatedData.title || '').trim() || 'Không có tiêu đề' : p.title,
        content: updatedData.content !== undefined ? updatedData.content || '' : p.content, // Bỏ sanitizeHtml khi lưu
        updatedAt: new Date().toISOString()
    }) : p);
    if (!updatedPost) throw new Error('Bài viết không tồn tại');
    setItem(POSTS_KEY, newPosts);
    return updatedPost;
};

export const deletePost = (id) => {
    const posts = getAllPosts();
    if (!posts.some(p => String(p.id) === String(id))) throw new Error('Bài viết không tồn tại');
    setItem(POSTS_KEY, posts.filter(p => String(p.id) !== String(id)));
    return true;
};
