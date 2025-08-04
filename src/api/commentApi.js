import { getItem, setItem } from '../utils/localStorage';
import { generateId } from '../utils/generateId';

const COMMENTS_KEY = 'comments';

export const getComments = () => {
    return getItem(COMMENTS_KEY) || [];
};

export const getCommentsByPostId = (postId) => {
    const comments = getComments();
    return comments.filter(comment => comment.postId === postId);
};

export const addComment = (postId, comment) => {
    const comments = getComments();
    const newComment = { ...comment, postId, id: generateId() };
    comments.push(newComment);
    setItem(COMMENTS_KEY, comments);
};