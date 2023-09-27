import { AppShell } from "@mantine/core"
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <AppShell header={{ height: '100px' }} padding="md">
      <AppShell.Header>
        <div>Header</div>
      </AppShell.Header>
      <AppShell.Main><Outlet></Outlet></AppShell.Main>
    </AppShell>
  );
};
export default Layout;
