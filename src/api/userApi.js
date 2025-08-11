export const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

export const login = (username, password) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('Sai tên đăng nhập hoặc mật khẩu');
    return user;
};

export const register = (newUser) => {
    const users = getUsers();
    if (users.some(u => u.username === newUser.username)) throw new Error('Tên người dùng đã tồn tại');
    const user = {id: Date.now().toString(), ...newUser};
    users.push(user);
    saveUsers(users);
    return user;
};

export const updateUser = (id, data) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Không tìm thấy user');
    users[index] = {...users[index], ...data};
    saveUsers(users);
    return users[index];
};

export const getUserByUsername = (username) => {
    const users = getUsers();
    return users.find(u => u.username === username);
};

export const deleteUser = (id, mode = 'keep') => {
    let users = getUsers().filter(u => u.id !== id);
    saveUsers(users);

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const comments = JSON.parse(localStorage.getItem('comments')) || [];

    if (mode === 'hard') {
        const remainingPosts = posts.filter(p => p.authorId !== id);
        const remainingComments = comments.filter(c => c.authorId !== id && remainingPosts.some(p => p.id === c.postId));
        localStorage.setItem('posts', JSON.stringify(remainingPosts));
        localStorage.setItem('comments', JSON.stringify(remainingComments));
    } else if (mode === 'anonymize') {
        const updatedPosts = posts.map(p => p.authorId === id ? {
            ...p,
            authorId: null,
            authorName: 'Người dùng đã xoá'
        } : p);
        const updatedComments = comments.map(c => c.authorId === id ? {
            ...c,
            authorId: null,
            authorName: 'Người dùng đã xoá'
        } : c);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        localStorage.setItem('comments', JSON.stringify(updatedComments));
    }
    return true;
};