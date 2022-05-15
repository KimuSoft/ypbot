import { RuleType } from '@prisma/client'
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from '@remix-run/server-runtime'
import { withZod } from '@remix-validated-form/with-zod'
import { validationError } from 'remix-validated-form'
import { z } from 'zod'
import { jsonValidator } from '~/components/rules/RuleElementEditor'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'

const ruleElementEditValidator = withZod(
  z.object({
    create: z.array(
      z.object({
        isSeparation: z.boolean(),
        name: z.string().min(1),
        ruleType: z.enum(['White', 'Black', 'Include']),
        regex: z.string().optional(),
      })
    ),
    edit: z.array(
      z.object({
        name: z.string().min(1),
        regex: z.string().optional(),
        isSeparation: z.boolean(),
        id: z.string(),
      })
    ),
    delete: z.array(z.string()),
  })
)

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)

  if (!user) return { error: 'unauthorized' }

  const rule = await prisma.rule.findFirst({
    where: {
      authorId: user.id,
      id: params.id!,
    },
  })

  console.log(rule)

  if (!rule) {
    return redirect('/app/rules')
  }

  const res = await jsonValidator.validate(await request.formData())
  if (res.error) {
    return validationError(res.error)
  }
  const res2 = await ruleElementEditValidator.validate(
    JSON.parse(res.data._json)
  )
  if (res2.error) {
    return validationError(res2.error)
  }
  const { data } = res2
  if (data.create.length) {
    await prisma.ruleElement.createMany({
      data: data.create.map((x) => ({
        name: x.name,
        regex: x.regex,
        isSeparation: x.isSeparation,
        ruleId: rule.id,
        ruleType: RuleType[x.ruleType],
      })),
    })
  }
  if (data.edit.length) {
    for (const elem of data.edit) {
      await prisma.ruleElement.updateMany({
        where: {
          ruleId: rule.id,
          id: elem.id,
        },
        data: {
          name: elem.name,
          regex: elem.regex,
          isSeparation: elem.isSeparation,
        },
      })
    }
  }
  if (data.delete.length) {
    await prisma.ruleElement.deleteMany({
      where: {
        ruleId: params.id!,
        id: {
          in: data.delete,
        },
      },
    })
  }
  console.log(data)
  return redirect(res.data.url)
}
