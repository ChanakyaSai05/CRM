import { CSidebar, CSidebarNav, CNavTitle, CNavItem } from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ home }) => {
  const history = useNavigate();
  const logoutFn = () => {
    localStorage.clear();
    history("/");
  };
  return (
    <CSidebar unfoldable className="bg-black vh-100">
      <CSidebarNav>
        <CNavItem className="bg-dark text-center d-flex">
          <i className="bi bi-bar-chart-fill m-2 px-2"></i>
          <h5 className="mx-5 my-1 fw-bolder">TETHERX</h5>
        </CNavItem>
        <CNavTitle className="">A CRM App for all your needs...</CNavTitle>
        <CNavItem className="d-flex align-items-center">
          <i className="bi bi-file-text m-2 px-2"></i>
          <a
            href="#target_ticket"
            className="mx-5 my-1 "
            style={{
              cursor: "pointer",
              color: "white",
              textDecoration: "none",
            }}
          >
            Tickets
          </a>
        </CNavItem>
        {home && (
          <CNavItem className="d-flex align-items-center">
            <i className="bi bi-file-text m-2 px-2"></i>
            <a
              href="#target_users"
              className="mx-5 my-1 "
              style={{
                cursor: "pointer",
                color: "white",
                textDecoration: "none",
              }}
            >
              Users
            </a>
          </CNavItem>
        )}
        <CNavItem className="d-flex align-items-center">
          <i className="bi bi-box-arrow-left m-2 px-2"></i>
          <div
            className="mx-5 my-1 "
            style={{ cursor: "pointer" }}
            onClick={logoutFn}
          >
            Logout
          </div>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};
export default Sidebar;
