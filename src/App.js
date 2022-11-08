// Import library
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import styles
import "./sass/styles.scss";

// Import component
import { ShopProvider } from "./contexts/ShopContext";
import { AuthRoutes, PrivateRoutes } from "./routes";
import { Wrapper } from "./components";
import {
    Welcome,
    Signin,
    Signup,
    Home,
    Shop,
    Cart,
    ProductDetail,
    Profile,
    EditProfile,
} from "./pages";

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
                        <Route element={<Wrapper />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route
                                path="/products/:productId"
                                element={<ProductDetail />}
                            />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                                path="/profile/edit"
                                element={<EditProfile />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </ShopProvider>
        </Router>
    );
}

export default App;
