// Import library
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import styles
import "./sass/styles.scss";

// Import component
import { ShopProvider } from "./contexts/ShopContext";
import { AuthRoutes, PrivateRoutes } from "./routes";
import { Welcome, Signin, Signup, Home } from "./pages";

function App() {
    return (
        <Router>
            <ShopProvider>
                <Routes>
                    <Route element={<AuthRoutes />}>
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>
                    <Route element={<PrivateRoutes />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
            </ShopProvider>
        </Router>
    );
}

export default App;
