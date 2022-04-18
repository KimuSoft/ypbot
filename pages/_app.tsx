import React from 'react'
import { AppProps } from 'next/app'
import '../stylesheets/app.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import DefaultLayout from '../ui/layouts/DefaultLayout'
import DashboardLayout from '../ui/layouts/DashboardLayout'
import { NextPageWithLayout } from '../webUtils/next'
import { SkeletonTheme } from 'react-loading-skeleton'

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
        <SkeletonTheme baseColor="#1c1917" highlightColor="#44403c">
            <LayoutComponent>
                <Component {...pageProps} />
            </LayoutComponent>
        </SkeletonTheme>
    )
}

export default CustomApp
