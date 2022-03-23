import React from 'react'
import { AppProps } from 'next/app'
import '../stylesheets/app.scss'
import DefaultLayout from '../ui/layouts/DefaultLayout'
import DashboardLayout from '../ui/layouts/DashboardLayout'
import { NextPageWithLayout } from '../webUtils/next'

const CustomApp: React.FC<AppProps & { Component: NextPageWithLayout }> = ({ Component, pageProps }) => {
    const LayoutComponent = React.useMemo(() => {
        switch (Component.layout) {
            case 'dashboard':
                return DashboardLayout
            case 'user':
            default:
                return DefaultLayout
        }
    }, [Component.layout])
    return (
        <LayoutComponent>
            <Component {...pageProps} />
        </LayoutComponent>
    )
}

export default CustomApp
