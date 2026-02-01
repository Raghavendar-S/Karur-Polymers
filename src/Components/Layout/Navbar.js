import { Link } from "react-router-dom";
import "./NavbarFooter.css";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useUser } from "../../Context/UserProvider";

export function Navbar() {
  const { user } = useUser();

  return (
    <>
      <header className="navbar_header">
        <a href="/" className="logo">
          <img src="../assets/logo.png" alt="logo" />
        </a>
        <input type="checkbox" id="menu-bar" />
        <label htmlFor="menu-bar">
          <i className="ri-menu-line"></i>
        </label>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">
                <i className="ri-home-4-line"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/products">
                <i className="ri-box-3-line"></i> Products
              </Link>
            </li>
            <li>
              <a href="/#choose">
                <i className="ri-information-line"></i> About Us
              </a>
            </li>
            <li>
              <a href="/#contact">
                <i className="ri-contacts-book-line"></i> Contact
              </a>
            </li>
            <li>
              <Link to="/cart">
                <Badge badgeContent={user.cart?.length} color="primary">
                  <ShoppingCartIcon />
                  Cart
                </Badge>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
