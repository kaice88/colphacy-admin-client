import { Navbar } from '@mantine/core'
import MainLink from './NavigationLink'
import { options } from './Options'

export default function DashboardNavbar() {
    const links = options.map(link => <MainLink {...link} key={link.label} />)

    return (
        <Navbar
            p="sm"
            hiddenBreakpoint="sm"
            width={{ sm: 220, lg: 250 }}
            className="navbar"
        >
            <Navbar.Section grow mt="md">
                {links}
            </Navbar.Section>
        </Navbar>
    )
}