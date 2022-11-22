// Import library
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation } from "swiper";

// Import Swiper styles
import "swiper/scss";
import "swiper/scss/navigation";

// Import components
import { Loading } from "../../components";
import { useShop } from "../../contexts/ShopContext";
import labelDetail from "../../utils/labelDetail";
import { capitalizeFirstLetter, trimLetter } from "../../utils/format";

const ProductDetail = () => {
    // Get product id from params
    const { productId } = useParams();

    // Method context
    const { currentUser, find, findWithCondition, update } = useShop();

    // Product states
    const [product, setProduct] = useState();
    const [cart, setCart] = useState();
    const [skuId, setSkuId] = useState(0);
    const [amount, setAmount] = useState(1);
    const [tabItem, setTabItem] = useState("detail");

    const navigate = useNavigate();

    // UseEffect
    useEffect(() => {
        const getProduct = async () => {
            // Get product data from API
            const qSnapshot = await find("products", productId);
            const data = { ...qSnapshot.data() };

            // Set data value in products state
            setProduct(data);
        };
        getProduct();
    }, [find, productId]);

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
    const handleSkuClick = (e, id) => {
        if (e.target.getAttribute("data-quantity") === "false") {
            return;
        }

        if (id === skuId - 1) {
            setSkuId(0);
            return;
        }

        setSkuId(id + 1);
    };

    const handleAmount = (option) => {
        switch (option?.type) {
            case "increase":
                setAmount((prev) => prev + 1);
                break;
            case "decrease":
                if (amount === 1) {
                    return;
                }
                setAmount((prev) => prev - 1);
                break;
            default:
                return;
        }
    };

    const updateDataCart = async () => {
        // Get data product
        const { name, photos, cost, skus } = product;
        const quantity = amount;

        // Create product item object in cart collection
        const cartItem = {
            id: productId,
            name,
            photoURL: photos[0],
            sku: {
                color: skus[skuId - 1].color,
                quantity,
            },
            cost,
        };

        // Update total cost in cart
        const cartItems = [...cart.data.products, cartItem];
        const total = cartItems.reduce(
            (prev, item) =>
                prev + parseInt(item.cost.slice(0, -4)) * item.sku.quantity,
            0
        );
        await update("cart", cart.id, { products: cartItems, total });
        // Set cart state
        cart.data.products = [...cartItems];
        setCart({ ...cart });
    };

    const handleAddtoCart = () => {
        const cartItems = cart.data.products;
        if (cartItems.filter((e) => e.id === productId).length === 0) {
            updateDataCart();
        }
    };

    const handleOrder = async () => {
        const cartItems = cart.data.products;
        if (cartItems.filter((e) => e.id === productId).length === 0) {
            await updateDataCart();
        }

        navigate("/cart");
    };

    // If haven't product -> render loading
    if (!product) {
        return <Loading />;
    }

    return (
        <div className="product flow">
            {/* Product info */}
            <div className="product-info d-flex">
                <div className="product-info-img">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={product.photos.length > 1}
                        navigation={true}
                        modules={[Navigation]}
                        className={`mySwiper ${
                            product.slug !== "dienthoai" ? "h-full" : ""
                        }`}
                    >
                        {product.photos.map((photo, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    className={
                                        product.slug !== "dienthoai"
                                            ? "h-full"
                                            : ""
                                    }
                                    src={photo}
                                    alt={product.name}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div
                    className="product-info-content flow"
                    style={{ "--flow-spacer": "1rem" }}
                >
                    <div className="product-info-name ff-secondary fs-500 fw-medium">
                        {product.name}
                    </div>
                    <div className="product-info-cost ff-secondary fs-400 fw-medium">
                        {product.cost}
                    </div>
                    <p className="product-info-desc text-neutral-400">
                        {product.description}
                    </p>
                    <div className="product-info-skus d-flex">
                        {product.skus.map((sku, id) => (
                            <div
                                key={sku.color}
                                className="product-info-sku"
                                data-visible={id === skuId - 1}
                                data-quantity={sku.quantity !== 0}
                                onClick={(e) => handleSkuClick(e, id)}
                            >
                                {sku.color}
                            </div>
                        ))}
                    </div>
                    <div
                        className="d-flex items-center"
                        style={{ gap: "0.5rem" }}
                    >
                        <div className="product-info-amount d-flex items-center">
                            <span
                                className="material-symbols-rounded"
                                onClick={() =>
                                    handleAmount({ type: "decrease" })
                                }
                            >
                                remove
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span
                                className="material-symbols-rounded"
                                onClick={() =>
                                    handleAmount({ type: "increase" })
                                }
                            >
                                add
                            </span>
                        </div>
                        <p className="text-neutral-300 fs-200">
                            {!skuId
                                ? product.total
                                : product.skus[skuId - 1].quantity}{" "}
                            sản phẩm có sẵn
                        </p>
                    </div>
                    <div className="product-info-action d-flex">
                        <button
                            style={{ "--gap": "0.25rem" }}
                            className="button d-inline-flex items-center fs-200"
                            button-variant="outlined"
                            button-color="primary"
                            onClick={handleAddtoCart}
                        >
                            <span className="material-symbols-rounded">
                                add_shopping_cart
                            </span>
                            thêm vào giỏ hàng
                        </button>
                        <button
                            className="button fs-200"
                            button-variant="contained"
                            button-color="primary"
                            onClick={handleOrder}
                        >
                            mua ngay
                        </button>
                    </div>
                </div>
            </div>
            {/* Product tab */}
            <div className="product-tab">
                <div className="product-tab-list d-flex justify-center items-center">
                    <div
                        className="product-tab-item text-capitalize"
                        data-tab="detail"
                        data-active={tabItem === "detail"}
                        onClick={(e) =>
                            setTabItem(e.target.getAttribute("data-tab"))
                        }
                    >
                        chi tiết
                    </div>
                    <div
                        className="product-tab-item text-capitalize"
                        data-tab="review"
                        data-active={tabItem === "review"}
                        onClick={(e) =>
                            setTabItem(e.target.getAttribute("data-tab"))
                        }
                    >
                        đánh giá
                    </div>
                </div>
                <div className="product-tab-content">
                    {tabItem === "detail" && (
                        <div className="product-detail">
                            <div
                                className="ff-secondary fs-400 fw-semibold"
                                style={{ marginBottom: "0.5rem" }}
                            >
                                Chi tiết sản phẩm
                            </div>
                            {product.detail.map((info, index) => {
                                const objKey = Object.keys(info);
                                return (
                                    <p
                                        key={index}
                                        className="product-detail-item d-flex"
                                    >
                                        <span
                                            style={{
                                                width: "12rem",
                                                flexShrink: "0",
                                            }}
                                            className="fw-semibold"
                                        >
                                            {`${capitalizeFirstLetter(
                                                labelDetail[
                                                    product.categoryDetail
                                                ][index]
                                            )}`}
                                        </span>
                                        <span className="fw-medium">
                                            {trimLetter(info[objKey[0]])}
                                        </span>
                                    </p>
                                );
                            })}
                        </div>
                    )}
                    {tabItem === "review" && (
                        <div className="">
                            <div
                                className="ff-secondary fs-400 fw-semibold"
                                style={{ marginBottom: "0.5rem" }}
                            >
                                Đánh giá sản phẩm
                            </div>
                            <p>Review tab</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
