export const setToken = (t) => localStorage.setItem('token', t);
export const getToken = () => localStorage.getItem('token');
export const setUser = (u) => localStorage.setItem('user', JSON.stringify(u));
export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
export const clearAuth = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };
