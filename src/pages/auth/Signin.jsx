// Import library
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// Import components
import { useShop } from "../../contexts/ShopContext";

const Signin = () => {
    // Use value of ShopProvider
    const { signin } = useShop();

    // State variable
    const [error, setError] = useState("");

    // Ref variable
    const emailRef = useRef();
    const passwordRef = useRef();

    // Navigate variable
    const navigate = useNavigate();

    // Handle event function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!emailRef.current.value || !passwordRef.current.value) {
            setError("Bạn cần nhập đủ thông tin!");
            return;
        }

        // Sign in
        try {
            await signin(emailRef.current.value, passwordRef.current.value);
        } catch (error) {
            console.log(error);
            setError("Lỗi đăng nhập. Vui lòng thực hiện lại!");
            return;
        }

        // Navigate to homepage
        navigate("/");
    };

    return (
        <form className="form flow" onSubmit={handleSubmit}>
            <div className="form-heading text-center">Đăng nhập!</div>
            <div className="form-group">
                <input
                    type="email"
                    ref={emailRef}
                    placeholder="Nhập email"
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Nhập mật khẩu"
                    className="form-input"
                />
            </div>
            <div>
                {error && (
                    <p
                        className="fs-200 fw-semibold"
                        style={{
                            color: "#ff3333",
                        }}
                    >
                        {error}
                    </p>
                )}
            </div>
            <div className="text-right">
                <a className="fs-200" href="#!">
                    Quên mật khẩu?
                </a>
            </div>
            <button
                className="button w-full text-center"
                button-variant="contained"
                button-color="primary"
            >
                Đăng nhập
            </button>
            <div className="text-center text-neutral-300 fw-medium fs-200">
                Bạn chưa có tài khoản?{" "}
                <Link className="form-link" to="/signup">
                    Đăng ký
                </Link>
            </div>
        </form>
    );
};

export default Signin;
