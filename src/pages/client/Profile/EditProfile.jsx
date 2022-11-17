// Import library
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// Import components
import { useShop } from "../../../contexts/ShopContext";
import { storage } from "../../../config/firebase";
import { Loading } from "../../../components";
import { phoneNumberRegex } from "../../../utils/validation";

const EditProfile = () => {
    // Method context
    const { currentUser, find, update } = useShop();

    // User states
    const [user, setUser] = useState();
    const [avatar, setAvatar] = useState();
    const [error, setError] = useState("");

    // User ref
    const avaRef = useRef();
    const fullNameRef = useRef();
    const displayNameRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();
    const submitBtnRef = useRef();

    const navigate = useNavigate();

    // UseEffect
    useEffect(() => {
        const getUser = async () => {
            // Get user data from API
            const qSnapshot = await find("users", currentUser.uid);
            const data = { ...qSnapshot.data() };

            // Set data value in user state
            setUser(data);
        };

        getUser();
    }, [currentUser, find]);

    useEffect(() => {
        if (user) {
            fullNameRef.current.value = user.fullName;
            displayNameRef.current.value = user.displayName;
            emailRef.current.value = user.email;
            phoneNumberRef.current.value = user.phoneNumber;
        }
    }, [user]);

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    // Method event
    function handleOpenFile() {
        avaRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);
        setAvatar(file);
        submitBtnRef.current.setAttribute("data-visible", "true");
    };

    const handleInputChange = () => {
        const userDataRef = {
            fullName: fullNameRef.current.value,
            displayName: displayNameRef.current.value,
            phoneNumber: phoneNumberRef.current.value,
        };

        const userData = {
            fullName: user.fullName,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
        };

        if (JSON.stringify(userDataRef) === JSON.stringify(userData)) {
            submitBtnRef.current.setAttribute("data-visible", "false");
        } else {
            submitBtnRef.current.setAttribute("data-visible", "true");
        }
    };

    async function uploadAndGetPhotoUrl() {
        const imgRef = ref(
            storage,
            `avatar/${displayNameRef.current.value}/${
                displayNameRef.current.value + v4()
            }`
        );

        await uploadBytes(imgRef, avatar);
        return getDownloadURL(imgRef);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !fullNameRef.current.value ||
            !displayNameRef.current.value ||
            !phoneNumberRef.current.value
        ) {
            setError("Bạn cần nhập đủ thông tin tài khoản!");
            return;
        }

        if (!phoneNumberRegex.test(phoneNumberRef.current.value)) {
            setError("Số điện thoại không hợp lệ. Bạn cần nhập lại!");
            return;
        }

        const userObj = {};

        if (fullNameRef.current.value !== user.fullName) {
            userObj.fullName = fullNameRef.current.value;
        }

        if (displayNameRef.current.value !== user.displayName) {
            userObj.displayName = displayNameRef.current.value;
        }

        if (phoneNumberRef.current.value !== user.phoneNumber) {
            userObj.phoneNumber = phoneNumberRef.current.value;
        }

        if (avatar) {
            const url = await uploadAndGetPhotoUrl();
            userObj.photoURL = url;
        }

        await update("users", currentUser.uid, userObj);

        navigate("/profile");
    };

    // If haven't user -> render loading
    if (!user) {
        return <Loading />;
    }

    return (
        <div className="profile flow">
            <div className="section-heading">Cập nhật hồ sơ người dùng</div>
            <form className="profile-form form flow" onSubmit={handleSubmit}>
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
                <div className="form-photo">
                    <img
                        className="form-preview"
                        src={avatar ? avatar.preview : user.photoURL}
                        alt={user.fullName}
                    />
                    <div className="form-photo-icon" onClick={handleOpenFile}>
                        <span className="material-symbols-rounded">
                            add_photo_alternate
                        </span>
                    </div>
                    <input
                        type="file"
                        id="file"
                        ref={avaRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="fullName">
                        Họ tên
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        ref={fullNameRef}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Họ tên"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="displayName">
                        Tên hiển thị
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        ref={displayNameRef}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Tên hiển thị"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        style={{ opacity: "0.6" }}
                        type="email"
                        id="email"
                        ref={emailRef}
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        placeholder="Email"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">
                        Số điện thoại
                    </label>
                    <input
                        type="text"
                        id="phoneNumber"
                        ref={phoneNumberRef}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Số điện thoại"
                        className="form-input"
                    />
                </div>
                <button
                    className="button form-button w-full text-center"
                    button-variant="contained"
                    button-color="primary"
                    ref={submitBtnRef}
                    data-visible={false}
                >
                    cập nhật
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
