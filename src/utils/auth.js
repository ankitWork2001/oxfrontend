import jwtDecode from 'jwt-decode';

export const decodeUserFromToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (e) {
        console.warn('Invalid token:', e.message);
        return null;
    }
};