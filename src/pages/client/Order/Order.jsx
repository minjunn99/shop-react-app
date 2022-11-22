// Import library
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Import components
import { useCart, useOrder } from "../../../hooks";
import ShippingOrder from "./ShippingOrder";
import PayOrder from "./PayOrder";

const INITIAL_DATA = {
    fullName: "",
    phoneNumber: "",
    address: "",
};

const Order = () => {
    // Order states
    const [data, setData] = useState(INITIAL_DATA);

    // Method
    function updateFields(fields) {
        setData((prev) => {
            return { ...prev, ...fields };
        });
    }

    // Custom hooks
    const { cartItems } = useCart();
    const { step, isFirstPage, isLastPage, next, back } = useOrder([
        <ShippingOrder {...data} updateFields={updateFields} />,
        <PayOrder
            {...data}
            cartItems={cartItems}
            updateFields={updateFields}
        />,
    ]);

    // Method events
    const handleSubmit = (e) => {
        e.preventDefault();

        // If not last page, render next page
        if (!isLastPage) {
            next();
            return;
        }

        // Order method
        console.log(data);
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
                    <button
                        button-variant="contained"
                        button-color="primary"
                        type="submit"
                    >
                        {isLastPage ? "Thanh toán" : "Tiếp tục"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Order;
