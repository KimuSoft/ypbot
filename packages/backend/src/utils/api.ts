import type { AxiosError } from 'axios'
import axios               from 'axios'

export const discordApi = axios.create({
  baseURL: 'https://discord.com/api/v10'
})

discordApi.interceptors.response.use(
  (v) => v,
  async (err: AxiosError) => {
    if (err.response?.status === 429) {
      console.log(
        `Discord API rate limited. Retrying after ${err.response.headers['retry-after']} second(s)`
      )
      return await new Promise((resolve) =>
        setTimeout(resolve, Number(err.response?.headers['retry-after']) * 1000)
      ).then(async () => await discordApi.request(err.config))
    }

    console.error('Error from discord API', err.response?.data)

    return await Promise.reject(err.response?.data ?? err)
  }
)
