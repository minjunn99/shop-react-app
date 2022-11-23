// Import library
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

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
    Category,
    ProductDetail,
    Profile,
    EditProfile,
    Order,
    OrderSuccess,
} from "./pages";

function App() {
    return (
        <Router>
            <PayPalScriptProvider
                options={{
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                }}
            >
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
                                    path="/category/:slug"
                                    element={<Category />}
                                />
                                <Route
                                    path="/product/:productId"
                                    element={<ProductDetail />}
                                />
                                <Route path="/profile" element={<Profile />} />
                                <Route
                                    path="/profile/edit/:userId"
                                    element={<EditProfile />}
                                />
                                <Route path="/order" element={<Order />} />
                                <Route
                                    path="/order-success"
                                    element={<OrderSuccess />}
                                />
                            </Route>
                        </Route>
                    </Routes>
                </ShopProvider>
            </PayPalScriptProvider>
        </Router>
    );
}

export default App;
