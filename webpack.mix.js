const mix = require('laravel-mix')

mix.ts('web/src/main.tsx', 'web/dist').react().options({
    manifest: false,
    resourceRoot: '/assets',
})
