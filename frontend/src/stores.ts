import type { YPUser } from 'shared'
import { writable } from 'svelte/store'
import type { Alert } from './utils/alert'

export const currentUser = writable<YPUser | null>(null)

export const alerts = writable<Alert[]>([])
