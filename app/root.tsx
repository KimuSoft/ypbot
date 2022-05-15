import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import '../node_modules/react-toastify/dist/ReactToastify.css'
import { getUser } from './session.server'
import type { YPUser } from './models/user.server'
import { convertUser } from './models/user.server'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import toastify from 'react-toastify/dist/ReactToastify.css'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: toastify,
    },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'YP',
  viewport: 'width=device-width,initial-scale=1',
})

type LoaderData = {
  user: Awaited<YPUser | null>
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  return json<LoaderData>({
    user: user ? await convertUser(user) : null,
  })
}

export default function App() {
  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ToastContainer position="top-center" />
        <CssBaseline />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
