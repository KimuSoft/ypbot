import axios, { AxiosError } from 'axios'

export const discordApi = axios.create({
  baseURL: 'https://discord.com/api/v10',
})

discordApi.interceptors.response.use(
  (v) => v,
  (err: AxiosError) => {
    if (err.response?.status === 429) {
      console.log(
        `Discord API rate limited. Retrying after ${err.response!.headers['retry-after']} second(s)`
      )
      return new Promise((resolve) =>
        setTimeout(resolve, Number(err.response!.headers['retry-after']) * 1000)
      ).then(() => discordApi.request(err.config))
    }

    console.error('Error from discord API', err.response?.data)

    return Promise.reject(err.response?.data ?? err)
  }
)
