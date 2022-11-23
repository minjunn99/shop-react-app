// Import library
import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

// Import components

const PayOrder = ({ cartItems, onPayment }) => {
    return (
        <>
            <div className="fs-400 fw-semibold text-center">
                Thông tin thanh toán
            </div>
            {/* Danh sách sản phẩm đặt mua */}
            <div className="d-grid">
                <div className="fw-semibold">Danh sách sản phẩm</div>
                {cartItems.map((cartItem, index) => (
                    <div className="d-flex items-center" key={index}>
                        <img
                            style={{
                                width: "5rem",
                                aspectRatio: "1",
                                objectFit: "cover",
                            }}
                            src={cartItem.photoURL}
                            alt={cartItem.name}
                        />
                        <div className="flex-grow-1">
                            <div className="text-truncate">{cartItem.name}</div>
                            <p className="fs-200 text-neutral-300">
                                Số lượng: {cartItem.sku.quantity}
                            </p>
                        </div>
                        <p className="fs-200">{cartItem.cost}</p>
                    </div>
                ))}
                <div className="d-flex justify-between items-center">
                    <div>Tổng thanh toán</div>
                    <p className="fs-200">
                        {`${cartItems.reduce(
                            (prev, curr) =>
                                prev +
                                curr.sku.quantity *
                                    parseInt(curr.cost.slice(0, -4)),
                            0
                        )} VNĐ`}
                    </p>
                </div>
            </div>
            {/* Thanh toán */}
            <div className="d-grid">
                <div className="fw-semibold">Hình thức thanh toán</div>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    fundingSource="paypal"
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: `${(
                                            cartItems.reduce(
                                                (prev, curr) =>
                                                    prev +
                                                    curr.sku.quantity *
                                                        parseInt(
                                                            curr.cost.slice(
                                                                0,
                                                                -4
                                                            )
                                                        ),
                                                0
                                            ) * 0.0000402455
                                        ).toFixed(2)}`,
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then(function (details) {
                            console.log(
                                "Transaction completed by",
                                details.payer.name.given_name
                            );
                            onPayment();
                        });
                    }}
                />
            </div>
        </>
    );
};

export default PayOrder;
