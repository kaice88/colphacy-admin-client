import { NavLink as RouterNavLink } from 'react-router-dom'
import { NavLink } from '@mantine/core'

interface MainLinkProps {
    icon: React.ReactNode
    url: string
    label: string
}

export default function NavigationLink({ icon, label, url }: MainLinkProps) {
    return (
        <RouterNavLink to={url}>
            {({ isActive }) => <NavLink label={label} active={isActive} icon={icon} />}
        </RouterNavLink>
    )
}