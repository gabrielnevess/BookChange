import axios from "axios";

export const baseURL = "http://localhost:3333";
const api = axios.create({
    baseURL
});

api.postOrGetAll = (url = []) => {
    return axios.all(url);
};

api.postOrPut = (url, id, ativo, data, config = {}) => {
    const method = id ? 'put' : 'post';
    const apiUrl = id ? `${url}/${id}${ativo}` : url;
    return api[method](apiUrl, data, config);
};

export default api;