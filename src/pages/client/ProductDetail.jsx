// Import library
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    const { find } = useShop();

    // Product states
    const [product, setProduct] = useState();
    const [skuId, setSkuId] = useState(0);
    const [amount, setAmount] = useState(1);
    const [tabItem, setTabItem] = useState("detail");

    // UseEffect
    useEffect(() => {
        const getProduct = async () => {
            // Store product data from API
            const qSnapshot = await find("products", productId);
            const data = { ...qSnapshot.data() };
            console.log(data);

            // Set data value in products state
            setProduct(data);
        };

        getProduct();
    }, [find, productId]);

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
                            <span className="material-symbols-rounded">
                                remove
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className="material-symbols-rounded">
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
                                    <p className="product-detail-item d-flex">
                                        <span
                                            style={{
                                                width: "12rem",
                                                flexShrink: "0",
                                            }}
                                            className="fw-semibold"
                                        >
                                            {`${capitalizeFirstLetter(
                                                labelDetail[product.category][
                                                    index
                                                ]
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
