import {getItem, setItem} from '../utils/localStorage';
import {generateId} from '../utils/generateId';
import sanitizeHtml from 'sanitize-html';

const COMMENTS_KEY = 'comments';
const SANITIZE_OPTIONS = {
    allowedTags: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {}
};

export const getComments = () => getItem(COMMENTS_KEY) || [];

export const getCommentsByPostId = (postId) => {
    const comments = getComments();
    return postId ? comments.filter(comment => String(comment.postId) === String(postId)) : [];
};

export const addComment = (postId, comment) => {
    const comments = getComments();
    const sanitizedContent = sanitizeHtml(comment.content || '', SANITIZE_OPTIONS).trim();

    const now = new Date().toISOString();
    const newComment = {
        id: generateId(),
        postId: String(postId),
        content: sanitizedContent,
        author: comment.author || 'Khách',
        authorId: comment.authorId || null,
        createdAt: now,
        updatedAt: now
    };

    comments.push(newComment);
    setItem(COMMENTS_KEY, comments);
    return newComment;
};

export const updateComment = (commentId, updatedData) => {
    const comments = getComments();
    let updatedComment = null;

    const updatedList = comments.map(c => {
        if (c.id === commentId) {
            updatedComment = {
                ...c,
                ...updatedData,
                content: typeof updatedData.content === 'string'
                    ? sanitizeHtml(updatedData.content, SANITIZE_OPTIONS).trim()
                    : c.content,
                updatedAt: new Date().toISOString()
            };
            return updatedComment;
        }
        return c;
    });

    if (!updatedComment) throw new Error('Không tìm thấy bình luận.');
    setItem(COMMENTS_KEY, updatedList);
    return updatedComment;
};

export const deleteComment = (commentId) => {
    const comments = getComments();
    if (!comments.some(c => c.id === commentId)) throw new Error('Không tìm thấy bình luận.');
    setItem(COMMENTS_KEY, comments.filter(c => c.id !== commentId));
    return true;
};
