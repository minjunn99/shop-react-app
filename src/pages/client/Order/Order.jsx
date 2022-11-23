// Import library
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Import components
import { useShop } from "../../../contexts/ShopContext";
import { useCart, useOrder } from "../../../hooks";
import ShippingOrder from "./ShippingOrder";
import PayOrder from "./PayOrder";

const INITIAL_DATA = {
    fullName: "",
    phoneNumber: "",
    address: "",
};

const Order = () => {
    // Method context
    const { find, create, update, currentUser } = useShop();

    // Order states
    const [data, setData] = useState(INITIAL_DATA);

    const navigate = useNavigate();

    // Method
    function updateFields(fields) {
        setData((prev) => {
            return { ...prev, ...fields };
        });
    }

    const handleUpdateProduct = async (item) => {
        // Get product data from API
        const qSnapshot = await find("products", item.id);
        const data = { ...qSnapshot.data() };

        // Update product data
        const skuOrder = data.skus.find((sku) => sku.color === item.sku.color);
        skuOrder.quantity -= parseInt(item.sku.quantity);
        const total = data.skus.reduce(
            (prev, item) => prev + parseInt(item.quantity),
            0
        );

        await update("products", item.id, {
            skus: [...data.skus],
            total,
        });
    };

    const handlePayment = async () => {
        // Update skus for all product in cart
        await Promise.all(
            [...cartItems].map((cartItem) => handleUpdateProduct(cartItem))
        );

        // Create order collection
        await create("order", {
            uid: currentUser.uid,
            ...data,
            products: [...cartItems],
            totalCost: cartItems.reduce(
                (prev, curr) =>
                    prev + curr.sku.quantity * parseInt(curr.cost.slice(0, -4)),
                0
            ),
        });

        // Update cart data
        await update("cart", cartId, {
            products: [],
            total: 0,
        });

        // Navigate to order success page
        navigate("/order-success");
    };

    // Custom hooks
    const { cartId, cartItems } = useCart();
    const { step, isFirstPage, isLastPage, next, back } = useOrder([
        <ShippingOrder {...data} updateFields={updateFields} />,
        <PayOrder
            cartItems={cartItems}
            updateFields={updateFields}
            onPayment={handlePayment}
        />,
    ]);

    // Method events
    const handleSubmit = (e) => {
        e.preventDefault();

        // If insufficient data are available
        if (Object.values(data).some((data) => data.length === 0)) {
            return;
        }

        // If not last page, render next page
        if (!isLastPage) {
            next();
            return;
        }
    };

    return (
        <div className="order flow">
            <div className="section-heading">Thủ tục thanh toán</div>
            <form
                className="order-form form d-flex direction-column"
                onSubmit={handleSubmit}
            >
                {step}
                <div
                    style={{ marginTop: "auto" }}
                    className="d-flex justify-between items-center"
                >
                    {!isFirstPage ? (
                        <button
                            className="button"
                            button-variant="outlined"
                            button-color="primary"
                            type="button"
                            onClick={back}
                        >
                            trở lại
                        </button>
                    ) : (
                        <Link
                            className="button"
                            button-variant="outlined"
                            button-color="primary"
                            to="/cart"
                        >
                            giỏ hàng
                        </Link>
                    )}
                    {isLastPage ? (
                        ""
                    ) : (
                        <button
                            button-variant="contained"
                            button-color="primary"
                            type="submit"
                        >
                            Tiếp tục
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Order;
