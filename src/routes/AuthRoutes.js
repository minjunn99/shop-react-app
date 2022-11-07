// Import library
import { Outlet, Navigate } from "react-router-dom";

// Import components
import { auth } from "../config/firebase";

const AuthRoutes = () => {
    const currentUser = auth.currentUser;

    return !!currentUser ? (
        <Navigate to="/" />
    ) : (
        <main
            style={{ minHeight: "100vh" }}
            className="d-flex justify-center items-center"
        >
            <Outlet />
        </main>
    );
};
export default AuthRoutes;
