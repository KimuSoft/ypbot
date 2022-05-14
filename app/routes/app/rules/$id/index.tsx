import { useCurrentRule } from '~/util/rules'

export default function RuleEdit() {
  const rule = useCurrentRule()

  return <div>{rule.id}</div>
}
