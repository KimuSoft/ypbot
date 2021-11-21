import common from '../../lang/ko/common.json'

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common'
        resources: {
            common: typeof common
        }
    }
}
