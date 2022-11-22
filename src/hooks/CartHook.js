// Import library
import { useEffect, useState } from "react";

// Import components
import { useShop } from "../contexts/ShopContext";

function useCart() {
    // Method context
    const { currentUser, findWithCondition } = useShop();

    // Usestate
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState();

    // UseEffect
    useEffect(() => {
        // Get cart collection in firestore
        const getCart = async () => {
            let data = [];
            const qSnapshot = await findWithCondition("cart", {
                field: "uid",
                condition: "==",
                data: currentUser.uid,
            });
            qSnapshot.forEach((doc) => {
                data.push({ id: doc.id, data: { ...doc.data() } });
            });

            setCart(data[0]);
            setLoading(false);
        };

        getCart();
    }, [findWithCondition, currentUser]);

    return (
        !loading && {
            cartId: cart.id,
            cartItems: cart.data.products,
        }
    );
}

export default useCart;
