import type { Rule, RuleElement } from '@prisma/client'
import { useMatchesData } from '~/utils'

export const useCurrentRule = () => {
  const data = useMatchesData('routes/app/rules/$id')
  if (!data) throw new Error('current route is not a rule route')
  return data.rule as Rule & { elements: RuleElement[] }
}
