// Import library
import React, { useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    addDoc,
} from "firebase/firestore";

// Import components
import { auth, db } from "../config/firebase";

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

    // UseEffect
    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => {
            unsubcribe();
        };
    }, []);

    // Method
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function signin(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signout() {
        return signOut(auth);
    }

    function all(collectionName) {
        return getDocs(collection(db, collectionName));
    }

    function find(collectionName, collectionId) {
        const docRef = doc(db, collectionName, collectionId);
        return getDoc(docRef);
    }

    function create(collectionName, collectionData) {
        const docRef = collection(db, collectionName);
        return addDoc(docRef, {
            ...collectionData,
        });
    }

    function update(collectionName, collectionId, collectionData) {
        const docRef = doc(db, collectionName, collectionId);
        return updateDoc(docRef, {
            ...collectionData,
        });
    }

    // Props
    const value = {
        currentUser,
        signup,
        signin,
        signout,
        all,
        find,
        create,
        update,
    };

    return (
        <ShopContext.Provider value={value}>
            {!loading && children}
        </ShopContext.Provider>
    );
};
