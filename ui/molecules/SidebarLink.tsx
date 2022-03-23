import React from 'react'
import { IconType } from 'react-icons'
import SidebarLinkBase from '../atoms/SidebarLinkBase'
import { useRouter } from 'next/router'
import Link from 'next/link'

const SidebarLink: React.FC<{ path: string; title: React.ReactNode; icon: IconType; as?: string }> = ({ path, title, as, icon: Icon }) => {
    const router = useRouter()

    return (
        <Link href={path} passHref as={as}>
            <a>
                <SidebarLinkBase active={router.pathname === path}>
                    <Icon size={16} />
                    <span>{title}</span>
                </SidebarLinkBase>
            </a>
        </Link>
    )
}

export default SidebarLink
