import { NextPage } from 'next'

export type NextPageWithLayout = NextPage & {
    layout?: LayoutType
}

export type LayoutType = 'dashboard' | 'user'
