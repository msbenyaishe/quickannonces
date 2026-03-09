import { useSelector } from "react-redux";
import { selectUserRole } from "../features/auth/authSlice";
import VisitorNavbar from "./navbars/VisitorNavbar";
import UserNavbar from "./navbars/UserNavbar";
import AdminNavbar from "./navbars/AdminNavbar";

export default function DynamicNavbar() {
  const role = useSelector(selectUserRole);

  if (role === "admin") {
    return <AdminNavbar />;
  }

  if (role === "user") {
    return <UserNavbar />;
  }

  return <VisitorNavbar />;
}

