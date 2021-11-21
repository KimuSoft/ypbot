import axios, { AxiosError } from 'axios'

const discordApi = axios.create({
    baseURL: 'https://discord.com/api/v8',
})

discordApi.interceptors.response.use(
    (res) => {
        return res
    },
    (error: AxiosError) => {
        if (error.response?.status === 429) {
            return new Promise((resolve) => {
                setTimeout(resolve, Number(error.response?.headers['x-retry-after']))
            }).then(() => axios.request(error.config))
        }
        return Promise.reject(error)
    }
)

export { discordApi }
