import axios from 'axios'

export const api = axios.create({
    headers: {
        'X-YP-API': 'true',
    },
})
