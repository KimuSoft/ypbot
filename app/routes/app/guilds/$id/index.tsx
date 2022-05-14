import { useCurrentGuild } from '~/util/guilds'

export default function GuildPage() {
  const guild = useCurrentGuild()

  console.log(guild)

  return <div>{guild.id}</div>
}
