const mix = require('laravel-mix')

mix.disableNotifications()

mix.babelConfig({
    plugins: ['macros'],
})

mix.ts('web/src/main.tsx', 'web/dist').react().options({
    manifest: false,
    resourceRoot: '/assets',
})
