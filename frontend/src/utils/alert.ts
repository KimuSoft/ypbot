import { alerts } from '@/stores'

export enum AlertSeverity {
  Info,
  Success,
  Error,
}

export type Alert = {
  severity: AlertSeverity
  title: string
  description?: string
  time?: number

  timeout?: any

  key: number
}

type AlertOptions = {
  title: string
  description?: string
  severity?: AlertSeverity
  time?: number
}

export const enqueueAlert = (options: AlertOptions) => {
  const obj = {
    severity: options.severity ?? AlertSeverity.Info,
    title: options.title,
    time: options.time,
    description: options.description,
    timeout: options.time
      ? setTimeout(() => {
          alerts.update((d) => d.filter((x) => x !== obj))
        }, options.time)
      : undefined,
    key: Date.now(),
  }
  alerts.update((d) => [obj, ...d])
}
