import { AppShell } from "@mantine/core"
import { Outlet, useNavigate } from "react-router-dom"
import Header from "./Header"
import Navbar from "./Navbar/Navbar";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated])

  return (
    <>
      {isAuthenticated &&
        <AppShell
          padding="md"
          navbarOffsetBreakpoint="sm"
          navbar={<Navbar />}
          header={<Header />}
        >
          <div className="content">
            <Outlet></Outlet>
          </div>
        </AppShell>}
    </>

  );
};
export default Layout;
