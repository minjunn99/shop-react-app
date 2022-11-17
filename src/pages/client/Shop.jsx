// Import library
import React, { useEffect, useState, useMemo, useRef } from "react";

// Import components
import { Loading, ProductCard } from "../../components";
import { useShop } from "../../contexts/ShopContext";
import categories from "../../assets/category";

const Shop = () => {
    // Method context
    const { all } = useShop();

    // Ref variable
    const searchRef = useRef();

    // Product states
    const [products, setProducts] = useState();
    const [filter, setFilter] = useState("all");

    // Store product filter
    const productsFilter = useMemo(() => {
        if (filter === "all") {
            return products;
        }

        const dataFilter = products.filter(
            (product) => product.category === filter
        );

        return dataFilter;
    }, [products, filter]);

    // UseEffect
    useEffect(() => {
        const getProducts = async () => {
            // Store products data from API
            const data = [];
            const qSnapshot = await all("products");
            qSnapshot.forEach((doc) => {
                const docData = doc.data();

                data.push({
                    id: doc.id,
                    ...docData,
                });
            });

            // Set data value in products state
            setProducts(data);
        };

        getProducts();
    }, [all]);

    // Method event
    const handleCategoryClick = (slug) => {
        setFilter(slug);
    };

    const handleSearchClick = (search) => {
        console.log(search);
    };

    // If haven't products -> render loading
    if (!products) {
        return <Loading />;
    }

    return (
        <div className="shop flow">
            <div className="section-heading">Cửa hàng</div>
            {/* Search input */}
            <div className="shop-search">
                <div className="shop-search-input form-group">
                    <input
                        type="text"
                        ref={searchRef}
                        placeholder="Tìm kiếm sản phẩm"
                        className="form-input"
                    />
                </div>
                <div
                    className="shop-search-btn"
                    onClick={() => handleSearchClick(searchRef.current.value)}
                >
                    <span className="material-symbols-rounded">search</span>
                </div>
            </div>
            {/* Category */}
            <div className="shop-categories d-flex items-center">
                <div
                    className="shop-categories-item"
                    style={{ height: "100%" }}
                    data-visible={filter === "all"}
                    onClick={() => handleCategoryClick("all")}
                >
                    <p className="fs-200 text-neutral-500 fw-medium text-capitalize">
                        tất cả
                    </p>
                </div>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="shop-categories-item d-flex items-center"
                        data-visible={filter === category.label}
                        onClick={() => handleCategoryClick(category.label)}
                    >
                        <img
                            style={{
                                width: "2rem",
                                aspectRatio: "1",
                                objectFit: "cover",
                            }}
                            src={category.url}
                            alt="Banner shop"
                        />
                        <p className="fs-200 text-neutral-500 fw-medium text-capitalize">
                            {category.label}
                        </p>
                    </div>
                ))}
            </div>
            {/* Shop show product */}
            <div className="shop-grid d-grid">
                {productsFilter.map((product) => {
                    /* Single product card */
                    return <ProductCard key={product.id} data={product} />;
                })}
            </div>
        </div>
    );
};

export default Shop;
