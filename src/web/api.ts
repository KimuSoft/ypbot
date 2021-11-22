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
            console.log(`Rate limited. retrying after ${error.response?.data.retry_after}s`)
            return new Promise((resolve) => {
                setTimeout(resolve, error.response?.data.retry_after * 1000)
            }).then(() => axios.request(error.config))
        }
        return Promise.reject(error)
    }
)

export { discordApi }
