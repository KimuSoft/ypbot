import 'frontend/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App ({ Component, pageProps }: AppProps): React.ReactNode {
  return <Component {...pageProps} />
}
