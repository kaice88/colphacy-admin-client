import { Button, Header } from '@mantine/core'
import useAuth from '../hooks/useAuth'


export default function HomeHeader() {
    const { logout } = useAuth()
    const handleLogout = () => {
        logout.mutate();
    }
    return (
        <Header height={{ base: 50, md: 70 }} p="xs">
            <div>Header</div>
            <Button onClick={handleLogout}>Logout</Button>
        </Header>
    )
}