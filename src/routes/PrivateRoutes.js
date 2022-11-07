// Import library
import { Outlet, Navigate } from "react-router-dom";

// Import components
import { auth } from "../config/firebase";

const PrivateRoutes = () => {
    const currentUser = auth.currentUser;

    return !!currentUser ? <Outlet /> : <Navigate to="/welcome" />;
};

export default PrivateRoutes;
