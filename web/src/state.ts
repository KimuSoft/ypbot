import { atom, selector } from 'recoil'
import { YPUser } from '../../src/sharedTypings'
import { api } from './api'

export const userState = selector<YPUser | null>({
    key: 'user',
    get: async () => {
        try {
            const { data } = await api.get<YPUser>('/me')
            return data
        } catch (e) {
            return null
        }
    },
})

export const guildSidebarOpen = atom({
    key: 'guildSidebarOpen',
    default: false,
})
