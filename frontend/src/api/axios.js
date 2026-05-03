import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8181',
    headers: {
        'Content-Type': 'application/json'
    }
});

const token = (() => {
    try {
        return localStorage.getItem('token');
    } catch {
        return null;
    }
})();
if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default instance;
