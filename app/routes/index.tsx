import { useOptionalUser } from '~/utils'

export default function Home() {
  console.log(useOptionalUser())

  return <div>home</div>
}
