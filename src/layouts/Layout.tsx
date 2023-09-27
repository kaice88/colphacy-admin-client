import { AppShell } from "@mantine/core"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Navbar from "./Navbar/Navbar";

const Layout: React.FC = () => {
  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      navbar={<Navbar />}
      header={<Header />}
    >
      {/* <Bread></Bread> */}
      <div className="content">
        <Outlet></Outlet>
      </div>
    </AppShell>
  );
};
export default Layout;
