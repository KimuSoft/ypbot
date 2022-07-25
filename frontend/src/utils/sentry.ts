import { dev } from '$app/env'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

Sentry.init({
  dsn: 'https://0e689abf305748e59d1d5e1a6861f578@sentry.oci.pikokr.dev/5',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: dev ? 'dev' : 'production',
})
