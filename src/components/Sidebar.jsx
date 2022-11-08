// Import library
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// Import component
import { useShop } from "../contexts/ShopContext";

const Sidebar = () => {
    // Use value of ShopProvider
    const { signout } = useShop();

    // Navigate variable
    const navigate = useNavigate();

    // Handle event function
    const handleClick = () => {
        // Log out
        signout();
        // Navigate to welcome
        navigate("/welcome");
    };

    return (
        <aside className="sidebar d-flex direction-column">
            {/* Logo */}
            <Link to="/" className="sidebar-logo">
                es
            </Link>
            {/* Menu */}
            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/" end>
                        <span className="material-symbols-rounded">home</span>
                        trang chủ
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/shop">
                        <span className="material-symbols-rounded">
                            local_mall
                        </span>
                        cửa hàng
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/cart">
                        <span className="material-symbols-rounded">
                            shopping_cart
                        </span>
                        giỏ hàng
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/profile">
                        <span className="material-symbols-rounded">
                            person_filled
                        </span>
                        cá nhân
                    </NavLink>
                </li>
            </ul>
            <div
                className="sidebar-button sidebar-link"
                to="/profile"
                onClick={handleClick}
            >
                <span className="material-symbols-rounded">logout</span>
                đăng xuất
            </div>
        </aside>
    );
};

export default Sidebar;
