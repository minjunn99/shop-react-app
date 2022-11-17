// Import library
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import components
import { useShop } from "../../../contexts/ShopContext";
import { Loading } from "../../../components";

const Profile = () => {
    // Method context
    const { currentUser, find } = useShop();

    // User states
    const [user, setUser] = useState();

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

    // If haven't user -> render loading
    if (!user) {
        return <Loading />;
    }

    return (
        <div className="profile flow">
            <div className="section-heading">Hồ sơ người dùng</div>
            <div className="profile-form form flow">
                <div className="form-photo">
                    <img
                        className="form-preview"
                        src={user.photoURL}
                        alt={user.fullName}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="fullName">
                        Họ tên
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={user.fullName}
                        placeholder="Họ tên"
                        className="form-input"
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="displayName">
                        Tên hiển thị
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        value={user.displayName}
                        placeholder="Tên hiển thị"
                        className="form-input"
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        placeholder="Email"
                        className="form-input"
                        readOnly
                    />
                </div>
                <Link
                    to={`/profile/edit/${currentUser.uid}`}
                    className="button"
                    button-variant="contained"
                    button-color="primary"
                >
                    Chỉnh sửa hồ sơ
                </Link>
            </div>
        </div>
    );
};

export default Profile;
