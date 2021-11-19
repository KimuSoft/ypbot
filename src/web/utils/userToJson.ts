import { YPUser } from '../../sharedTypings'

export const userToJson = (user: Express.User): YPUser => {
    return {
        id: user.yp.id,
        tag: user.discord.tag,
        avatar: user.discord.displayAvatarURL({ dynamic: true, size: 512 }),
    }
}
