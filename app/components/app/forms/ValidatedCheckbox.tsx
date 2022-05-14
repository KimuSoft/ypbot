import type { CheckboxProps } from '@mui/material'
import { Checkbox } from '@mui/material'
import { useTransition } from '@remix-run/react'
import React from 'react'

export const ValidatedCheckbox: React.FC<CheckboxProps & { name: string }> = ({
  name,
  ...props
}) => {
  const submitting = useTransition().state === 'submitting'
  return (
    <Checkbox name={name} {...props} disabled={props.disabled || submitting} />
  )
}
