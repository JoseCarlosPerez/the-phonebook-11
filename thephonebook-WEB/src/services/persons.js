import axios from "axios";
const BASEURL = '/api';

export default {
    get: () => axios.get(`${BASEURL}/persons`).then(response => response.data).catch(s => []),
    add: person => axios.post(`${BASEURL}/persons`, person).then(response => response.data).catch(s => null),
    modify: (id, person) => axios.put(`${BASEURL}/persons/${id}`, person).then(response => response.data).catch(s => null),
    delete: id => axios.delete(`${BASEURL}/persons/${id}`).then(response => response.status === 204).catch(s => false)
};