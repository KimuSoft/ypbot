import type { YPGuild } from '~/models/guild.server'
import { useMatchesData } from '~/utils'

export const useGuildList = (): YPGuild[] => {
  const data = useMatchesData('routes/app')
  if (!data) return []
  return data.guilds as YPGuild[]
}
