import React from 'react'
import { Add, Delete, Edit, Save } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { RuleElement, RuleType } from '@prisma/client'
import { ValidatedForm } from 'remix-validated-form'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { SubmitButton } from '../app/forms/SubmitButton'
import { useLocation, useSubmit } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { z } from 'zod'
import { ValidatedTextField } from '../app/forms/ValidatedTextField'
import { ValidatedCheckbox } from '../app/forms/ValidatedCheckbox'
import { zfd } from 'zod-form-data'
import { useCurrentRule } from '~/util/rules'
import clsx from 'clsx'
import { green, red, yellow } from '@mui/material/colors'

const createValidator = withZod(
  z.object({
    value: z.string().min(1),
    regex: z.string().optional(),
    separate: zfd.checkbox(),
  })
)

const editValidator = withZod(
  z.object({
    name: z.string().min(1),
    regex: z.string().optional(),
    isSeparation: zfd.checkbox(),
    id: z.string(),
  })
)

export const jsonValidator = withZod(
  z.object({
    _json: z.string(),
    url: z.string(),
  })
)

type RuleCreateType = Omit<RuleElement, 'ruleId' | 'includedRuleId'>

type EditorContextType = {
  create: [RuleCreateType[], (value: RuleCreateType[]) => void]
  edit: [RuleCreateType[], (value: RuleCreateType[]) => void]
  delete: [string[], (value: string[]) => void]
  elements: RuleElement[]
  reset: () => void
}

const EditorContext = React.createContext<EditorContextType>({
  create: [[], () => null],
  edit: [[], () => null],
  delete: [[], () => null],
  elements: [],
  reset: () => null,
})

export const RuleElementEditor: React.FC<{ ruleType: RuleType }> = ({
  ruleType,
}) => {
  const rule = useCurrentRule()

  const [value, setValue] = React.useState<{
    create: RuleCreateType[]
    edit: RuleCreateType[]
    delete: string[]
  }>({
    create: [],
    edit: [],
    delete: [],
  })

  return (
    <EditorContext.Provider
      value={{
        create: [value.create, (v) => setValue({ ...value, create: v })],
        edit: [value.edit, (v) => setValue({ ...value, edit: v })],
        delete: [value.delete, (v) => setValue({ ...value, delete: v })],
        elements: rule.elements,
        reset: () => {
          setValue({
            create: [],
            edit: [],
            delete: [],
          })
        },
      }}
    >
      <RuleElementEditorRoot ruleType={ruleType} />
    </EditorContext.Provider>
  )
}

const RuleEditContent: React.FC<{
  element: RuleElement
  close: () => void
}> = ({ element, close }) => {
  const v = React.useContext(EditorContext)
  const [isAdvanced, setIsAdvanced] = React.useState(false)

  return (
    <ValidatedForm
      validator={editValidator}
      defaultValues={{
        name: element.name,
        isSeparation: element.isSeparation,
        regex: element.regex || undefined,
      }}
      onSubmit={(data) => {
        const elem = v.edit[0].find((x) => x.id === data.id)
        if (elem) {
          elem.name = data.name
          elem.isSeparation = data.isSeparation
          elem.regex = data.regex || null
          v.edit[1](v.edit[0])
          return close()
        }
        v.edit[1]([
          ...v.edit[0],
          {
            id: data.id,
            name: data.name,
            isSeparation: data.isSeparation,
            regex: isAdvanced ? data.regex || null : data.name,
            ruleType: element.ruleType,
          },
        ])
        return close()
      }}
    >
      <DialogTitle>규칙 수정하기</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={1}>
          <input type="hidden" name="id" value={element.id} />
          <ValidatedTextField
            name="name"
            label="단어"
            variant="standard"
            required
            fullWidth
          />
          {isAdvanced && (
            <ValidatedTextField
              name="regex"
              label="정규 표현식"
              variant="standard"
              fullWidth
            />
          )}
          <FormControl>
            <FormControlLabel
              control={<ValidatedCheckbox name="isSeparation" />}
              label="자모 분리"
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdvanced}
                  onChange={(e, v) => {
                    setIsAdvanced(v)
                  }}
                />
              }
              label="고급 설정"
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()} color="error">
          취소
        </Button>
        <SubmitButton>수정하기</SubmitButton>
      </DialogActions>
    </ValidatedForm>
  )
}

const RuleElementEditorRoot: React.FC<{ ruleType: RuleType }> = ({
  ruleType,
}) => {
  const v = React.useContext(EditorContext)

  const location = useLocation()

  const rule = useCurrentRule()

  const existingElements = v.elements
  const [create, setCreate] = v.create
  const [createModalOpen, setCreateModalOpen] = React.useState(false)

  const [ruleToEdit, setRuleToEdit] = React.useState<RuleElement | null>(null)

  const submit = useSubmit()

  const title = React.useMemo(() => {
    switch (ruleType) {
      case 'Black':
        return '금지'
      case 'Include':
        return '포함'
      case 'White':
        return '강제'
    }
  }, [ruleType])

  const elements = React.useMemo(() => {
    console.log(existingElements)
    return [
      ...create.filter((x) => x.ruleType === ruleType),
      ...existingElements
        .filter((x) => x.ruleType === ruleType)
        .map((x) => {
          const i = v.edit[0].find((y) => x.id === y.id)

          if (!i) return x

          return { ...x, ...i }
        }),
    ]
  }, [create, existingElements, ruleType, v.edit])

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'name',
        headerName: '단어',
        width: 240,
      },
      {
        field: 'regex',
        headerName: 'Regexp',
        width: 240,
      },
      {
        field: 'isSeparation',
        headerName: '자모 분리',
        type: 'boolean',
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: '작업',
        getActions: ({ row: params }: { row: RuleElement }) => {
          const isNotTouched =
            !!v.create[0].find((x) => x.id === params.id) ||
            !!v.delete[0].find((x) => x === params.id)

          const deleteElem = (
            <GridActionsCellItem
              key={1}
              icon={<Delete />}
              label="삭제"
              onClick={() => {
                if (/^create-{1,}[0-9]$/.test(params.id)) {
                  setCreate(create.filter((x) => x.id !== params.id))
                } else if (v.delete[0].includes(params.id)) {
                  v.delete[1](v.delete[0].filter((x) => x !== params.id))
                } else {
                  v.edit[1](v.edit[0].filter((x) => x.id !== params.id))
                  v.delete[1]([...v.delete[0], params.id])
                }
              }}
            />
          )

          const res = [
            !isNotTouched ? (
              <GridActionsCellItem
                key={0}
                icon={<Edit />}
                label="수정"
                onClick={() => {
                  setRuleToEdit(params)
                }}
              />
            ) : (
              deleteElem
            ),
          ]

          if (!isNotTouched) {
            res.push(deleteElem)
          }

          return res
        },
      },
    ],
    [create, setCreate, v.create, v.delete, v.edit]
  )

  const [isAdvanced, setIsAdvanced] = React.useState(false)

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
      <Dialog open={createModalOpen} maxWidth="xs" fullWidth>
        <ValidatedForm
          validator={createValidator}
          defaultValues={{
            value: '',
            regex: '',
            separate: false,
          }}
          onSubmit={(data) => {
            setCreate([
              ...create,
              {
                id: `create-${create.length}`,
                isSeparation: data.separate,
                name: data.value,
                ruleType,
                regex: isAdvanced ? data.regex || null : data.value,
              },
            ])
            setCreateModalOpen(false)
          }}
        >
          <DialogTitle>규칙 추가하기</DialogTitle>
          <DialogContent>
            <Stack direction="column" gap={1}>
              <ValidatedTextField
                name="value"
                label="단어"
                variant="standard"
                required
                fullWidth
              />
              {isAdvanced && (
                <ValidatedTextField
                  name="regex"
                  label="정규 표현식"
                  variant="standard"
                  fullWidth
                />
              )}
              <FormControl>
                <FormControlLabel
                  control={<ValidatedCheckbox name="separate" />}
                  label="자모 분리"
                />
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAdvanced}
                      onChange={(e, v) => {
                        setIsAdvanced(v)
                      }}
                    />
                  }
                  label="고급 설정"
                />
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)} color="error">
              취소
            </Button>
            <SubmitButton>추가하기</SubmitButton>
          </DialogActions>
        </ValidatedForm>
      </Dialog>
      <Dialog open={!!ruleToEdit} maxWidth="xs" fullWidth>
        {ruleToEdit && (
          <RuleEditContent
            close={() => setRuleToEdit(null)}
            element={ruleToEdit}
          />
        )}
      </Dialog>
      <Stack sx={{ flexGrow: 1 }} direction="column" gap={2}>
        <Stack direction="row" gap={2} alignItems="flex-end">
          <Typography variant="h6" fontWeight={600}>
            {title} 규칙 관리
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <SubmitButton
            type="button"
            onClick={() => {
              const data = new FormData()
              data.set('url', location.pathname)
              data.set(
                '_json',
                JSON.stringify({
                  create: v.create[0],
                  edit: v.edit[0],
                  delete: v.delete[0],
                })
              )

              submit(data, {
                action: `/app/rules/${rule.id}/updateRules`,
                method: 'post',
              })
              v.reset()
            }}
            startIcon={<Save />}
            variant="outlined"
          >
            저장
          </SubmitButton>
          <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={() => setCreateModalOpen(true)}
          >
            추가
          </Button>
        </Stack>
        <DataGrid
          sx={{
            '& .rule_toDelete, &.rule_toDelete:hover': {
              background: `${red[500]} !important`,
            },
            '& .rule_toAdd, &.rule_toAdd:hover': {
              background: `${green[500]} !important`,
            },
            '& .rule_toEdit, &.rule_toEdit:hover': {
              background: `${yellow[500]} !important`,
            },
          }}
          getRowClassName={(row) => {
            const classes: string[] = []

            if (v.delete[0].includes(row.row.id)) {
              classes.push('rule_toDelete')
            } else if (v.create[0].find((x) => x.id === row.row.id)) {
              classes.push('rule_toAdd')
            } else if (v.edit[0].find((x) => x.id === row.row.id)) {
              classes.push('rule_toEdit')
            }

            return clsx(...classes)
          }}
          columns={columns}
          rows={elements as any}
        />
      </Stack>
      {v.create[0].length + v.edit[0].length + v.delete[0].length ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            height: '100%',
            width: 300,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6">변경사항</Typography>
          <Typography variant="body1" color="">
            저장을 눌러 변경사항을 적용해 주세요
          </Typography>
          <List
            sx={{ flexGrow: 1, padding: 0, height: 0, overflowY: 'auto' }}
            component={Paper}
            variant="outlined"
          >
            {create.length ? (
              <>
                <ListSubheader>추가됨</ListSubheader>
                {create.map((x, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={x.name} secondary={x.regex} />
                  </ListItem>
                ))}
              </>
            ) : null}
            {v.edit[0].length ? (
              <>
                <ListSubheader>수정됨</ListSubheader>
                {v.edit[0].map((x, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={x.name} secondary={x.regex} />
                  </ListItem>
                ))}
              </>
            ) : null}
            {v.delete[0].length ? (
              <>
                <ListSubheader>제거됨</ListSubheader>
                {v.delete[0]
                  .map((x) => v.elements.find((y) => y.id === x)!)
                  .map((x, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={x.name} />
                    </ListItem>
                  ))}
              </>
            ) : null}
          </List>
        </Paper>
      ) : null}
    </Box>
  )
}
