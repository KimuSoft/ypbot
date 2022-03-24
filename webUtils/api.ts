import axios from 'axios'

export const api = axios.create({
    headers: {
        'x-yp-api': 'true',
    },
})
