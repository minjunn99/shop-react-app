// Import library
import React from "react";

// Import components

const ShippingOrder = ({ fullName, phoneNumber, address, updateFields }) => {
    return (
        <>
            <div className="fs-400 fw-semibold">Thông tin đặt hàng</div>
            <div className="form-group w-full">
                <label className="form-label" htmlFor="displayName">
                    Họ và tên:
                </label>
                <input
                    type="text"
                    placeholder=" "
                    className="form-input"
                    value={fullName}
                    onChange={(e) => updateFields({ fullName: e.target.value })}
                />
            </div>
            <div className="form-group w-full">
                <label className="form-label" htmlFor="displayName">
                    Số điện thoại:
                </label>
                <input
                    type="text"
                    placeholder=" "
                    className="form-input"
                    value={phoneNumber}
                    onChange={(e) =>
                        updateFields({ phoneNumber: e.target.value })
                    }
                />
            </div>
            <div className="form-group w-full">
                <label className="form-label" htmlFor="displayName">
                    Nơi nhận hàng:
                </label>
                <input
                    type="text"
                    placeholder=" "
                    className="form-input"
                    value={address}
                    onChange={(e) => updateFields({ address: e.target.value })}
                />
            </div>
        </>
    );
};

export default ShippingOrder;
