// Import library
import React, { useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

// Import components
import { auth } from "../config/firebase";

// Create context
const ShopContext = React.createContext();

export function useShop() {
    return useContext(ShopContext);
}

// Create provider
export const ShopProvider = ({ children }) => {
    // Children are mounted?
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => {
            unsubcribe();
        };
    }, []);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function signin(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signout() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        signup,
        signin,
        signout,
    };

    return (
        <ShopContext.Provider value={value}>
            {!loading && children}
        </ShopContext.Provider>
    );
};
