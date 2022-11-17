// Import library
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import components
import { Loading } from "../../components";
import { useShop } from "../../contexts/ShopContext";

import emptyCard from "../../assets/empty-cart.svg";

const Cart = () => {
    // Method context
    const { currentUser, findWithCondition, update } = useShop();

    // Cart states
    const [cart, setCart] = useState();

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
        };

        getCart();
    }, [findWithCondition, currentUser]);

    // Method event
    const handleUpdate = async (event, { index, type }) => {
        event.target.parentNode.setAttribute("data-visible", false);
        const sku = cart.data.products[index].sku;

        switch (type) {
            case "increase":
                sku.quantity += 1;
                break;
            case "decrease":
                if (sku.quantity === 1) {
                    event.target.parentNode.setAttribute("data-visible", true);
                    return;
                }
                sku.quantity -= 1;
                break;
            default:
                return;
        }

        cart.data.total = cart.data.products.reduce(
            (prev, item) =>
                prev + parseInt(item.cost.slice(0, -4)) * item.sku.quantity,
            0
        );

        await update("cart", cart.id, {
            products: cart.data.products,
            total: cart.data.total,
        });
        setCart({ ...cart });

        event.target.parentNode.setAttribute("data-visible", true);
    };

    const handleDelete = async (index) => {
        const products = cart.data.products;
        products.splice(index, 1);

        cart.data.total =
            cart.data.products.length !== 0
                ? cart.data.products.reduce(
                      (prev, item) =>
                          prev +
                          parseInt(item.cost.slice(0, -4)) * item.sku.quantity,
                      0
                  )
                : 0;

        await update("cart", cart.id, {
            products,
            total: cart.data.total,
        });
        setCart({ ...cart });
    };

    // If haven't cart -> render loading
    if (!cart) {
        return <Loading />;
    }

    return (
        <div className="cart h-full d-flex direction-column">
            <div className="d-flex justify-between items-center">
                <div className="fs-500 text-capitalize">Giỏ hàng</div>
                <p className="text-neutral-300 fw-medium">
                    {cart.data.products.length} mặt hàng
                </p>
            </div>
            {/* Cart Items */}
            {cart.data.products.length ? (
                <div className="flex-grow-1 flow">
                    <div className="cart-list d-grid">
                        {cart.data.products.map((product, index) => (
                            <div
                                className="cart-item d-flex items-center"
                                key={product.id}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    className="cart-item-img"
                                >
                                    <img
                                        className="img-fluid"
                                        src={product.photoURL}
                                        alt={product.name}
                                    />
                                </Link>
                                <div className="cart-item-info flex-grow-1">
                                    <div className="fs-400 text-neutral-500 text-truncate">
                                        <Link to={`/product/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </div>
                                    <p className="text-neutral-300">
                                        {product.sku.color}
                                    </p>
                                </div>
                                <div
                                    className="cart-item-quantity d-flex items-center text-neutral-500"
                                    data-visible={true}
                                >
                                    <span
                                        className="material-symbols-rounded"
                                        onClick={(e) =>
                                            handleUpdate(e, {
                                                index,
                                                type: "decrease",
                                            })
                                        }
                                    >
                                        remove
                                    </span>
                                    {product.sku.quantity}
                                    <span
                                        className="material-symbols-rounded"
                                        onClick={(e) =>
                                            handleUpdate(e, {
                                                index,
                                                type: "increase",
                                            })
                                        }
                                    >
                                        add
                                    </span>
                                </div>
                                <div className="cart-item-cost text-neutral-500 text-truncate">
                                    {`${
                                        parseInt(product.cost.slice(0, -4)) *
                                        product.sku.quantity
                                    } VNĐ`}
                                </div>
                                <div className="cart-item-icon">
                                    <span
                                        className="material-symbols-rounded"
                                        onClick={() => handleDelete(index)}
                                    >
                                        delete
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex items-center">
                        <Link
                            to="/shop"
                            className="button"
                            button-variant="outlined"
                            button-color="primary"
                        >
                            tiếp tục mua hàng
                        </Link>
                        <button
                            className="button"
                            button-variant="contained"
                            button-color="primary"
                        >
                            mua ngay
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-grow-1 d-flex justify-center items-center">
                    <div
                        className="flow text-center"
                        style={{ "--flow-spacer": "1.5rem" }}
                    >
                        <p className="fw-medium">
                            Bạn chưa có mặt hàng nào trong giỏ hàng của mình
                        </p>
                        <img
                            style={{
                                width: "min(100%, 16rem)",
                                height: "auto",
                                marginInline: "auto",
                            }}
                            src={emptyCard}
                            alt="Empty cart"
                        />
                        <Link
                            to="/shop"
                            className="button"
                            button-variant="contained"
                            button-color="primary"
                        >
                            tiếp tục mua hàng
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
