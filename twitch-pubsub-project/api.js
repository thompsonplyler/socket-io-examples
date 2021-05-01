import axios from 'axios';

let api = axios.create({
    mode: 'cors',
    headers: {
        'Client-ID': 'nope',
        'Accept': 'nope'
    }
})

export default api; 