import type { YPGuild } from '~/models/guild.server'
import { useMatchesData } from '~/utils'

export const useGuildList = (): YPGuild[] => {
  const data = useMatchesData('routes/app')
  if (!data) return []
  return data.guilds as YPGuild[]
}

export const useCurrentGuild = (): YPGuild => {
  const data = useMatchesData('routes/app/guilds/$id')
  if (!data) throw new Error('current route is not a guild route')
  return data.guild as YPGuild
}
