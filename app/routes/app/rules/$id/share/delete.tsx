import type { ActionFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'

export const action: ActionFunction = async ({ params, request }) => {
  const codeId = (await request.formData()).get('id')?.toString()

  if (!codeId) return redirect(`/app/rules`)

  const user = await getUser(request)

  if (!user) return redirect('/app')

  const id = params.id
  const item = await prisma.rule.findFirst({
    where: { id, authorId: user.id },
  })

  console.log(item)

  if (!item) return redirect('/app/rules')

  await prisma.shareCode.deleteMany({
    where: {
      ruleId: item.id,
      id: codeId,
    },
  })

  return redirect(`/app/rules/${item.id}/share`)
}
