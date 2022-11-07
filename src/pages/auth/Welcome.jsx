// Import library
import React from "react";
import { Link } from "react-router-dom";

// Import components
import welcomeImg from "../../assets/welcome.svg";

const Welcome = () => {
    return (
        <div className="welcome">
            <div className="welcome-img">
                <img src={welcomeImg} alt="welcome background" />
            </div>
            <div className="welcome-content flow">
                <div className="ff-secondary fs-500 text-center fw-bold">
                    Chào mừng đến với ES
                </div>
                <div className="fs-300 text-center fw-bold">
                    Nơi bạn có thể đặt mua những thiết bị điện tử hàng đầu
                </div>
                <div className="welcome-buttons d-flex justify-center items-center">
                    <Link
                        to="/signin"
                        className="button w-full text-center"
                        button-variant="contained"
                        button-color="primary"
                    >
                        đăng nhập
                    </Link>
                    <Link
                        to="/signup"
                        className="button w-full text-center"
                        button-variant="contained"
                        button-color="primary"
                    >
                        đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
