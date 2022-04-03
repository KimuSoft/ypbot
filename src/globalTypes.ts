export type Guild = {
    meta: {
        id: string
        name: string
        icon?: string
    }
    isOwner: boolean
    invited: boolean
    channels: YPChannel[]
}

export type YPChannel = {
    id: string
    name: string
    type: 'GUILD_TEXT' | 'GUILD_NEWS'
    category: YPCategory | null
}

export type YPCategory = {
    name?: string
    id: string
    channels: YPChannel[]
}

export type YPUser = {
    id: string
    tag: string
    avatar: string
}
