// Import library
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

// Import components
import { useShop } from "../../contexts/ShopContext";
import { db } from "../../config/firebase";
import { UserConstructor } from "../../utils/constructor";
import {
    emailRegex,
    passwordRegex,
    phoneNumberRegex,
} from "../../utils/validation";
import { dateFormat } from "../../utils/format";

const Signup = () => {
    // Use value of ShopProvider
    const { signup } = useShop();

    // State variable
    const [error, setError] = useState("");

    // Ref variable
    const fullNameRef = useRef();
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const rePasswordRef = useRef();
    const phoneNumberRef = useRef();

    // Navigate variable
    const navigate = useNavigate();

    // Handle event function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (
            !fullNameRef.current.value ||
            !displayNameRef.current.value ||
            !emailRef.current.value ||
            !passwordRef.current.value ||
            !rePasswordRef.current.value ||
            !phoneNumberRef.current.value
        ) {
            setError("Bạn cần nhập đủ thông tin!");
            return;
        }

        if (!emailRegex.test(emailRef.current.value)) {
            setError("Email không hợp lệ!");
            return;
        }

        if (!passwordRegex.test(passwordRef.current.value)) {
            setError("Mật khẩu không hợp lệ!");
            return;
        }

        if (passwordRef.current.value !== rePasswordRef.current.value) {
            setError("Mật khẩu không trùng nhau!");
            return;
        }

        if (!phoneNumberRegex.test(phoneNumberRef.current.value)) {
            setError("Số điện thoại không hợp lệ!");
            return;
        }

        // Signup
        const userObj = new UserConstructor();
        userObj.fullName = fullNameRef.current.value;
        userObj.displayName = displayNameRef.current.value;
        userObj.email = emailRef.current.value;
        userObj.phoneNumber = phoneNumberRef.current.value;
        userObj.createdAt = dateFormat(Date.now());

        try {
            const res = await signup(
                emailRef.current.value,
                passwordRef.current.value
            );
            const { uid } = res.user;
            await setDoc(doc(db, "users", uid), {
                ...userObj,
            });
        } catch (error) {
            console.log(error);
            setError("Lỗi đăng ký. Vui lòng thực hiện lại");
            return;
        }

        // Navigate to home page
        navigate("/");
    };

    return (
        <form
            className="form flow"
            onSubmit={handleSubmit}
            style={{ "--form-width": "36rem" }}
        >
            <div className="form-heading text-center">Đăng ký</div>
            <div className="d-flex">
                <div className="form-group w-full">
                    <input
                        type="text"
                        ref={fullNameRef}
                        placeholder="Nhập họ tên"
                        className="form-input"
                    />
                </div>
                <div className="form-group w-full">
                    <input
                        type="text"
                        ref={displayNameRef}
                        placeholder="Nhập tên hiển thị"
                        className="form-input"
                    />
                </div>
            </div>
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
            <div className="form-group">
                <input
                    type="password"
                    ref={rePasswordRef}
                    placeholder="Nhập lại mật khẩu"
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    ref={phoneNumberRef}
                    placeholder="Nhập số điện thoại"
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
            <button
                className="button w-full text-center"
                button-variant="contained"
                button-color="primary"
            >
                đăng ký
            </button>
            <div className="text-center text-neutral-300 fw-medium fs-200">
                Bạn đã có tài khoản?{" "}
                <Link className="form-link" to="/signin">
                    Đăng nhập
                </Link>
            </div>
        </form>
    );
};

export default Signup;
