// Import library
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Import components
import { Loading, ProductCard } from "../../components";
import { useShop } from "../../contexts/ShopContext";

const Category = () => {
    // Get product id from params
    const { slug } = useParams();

    // Method context
    const { findWithCondition } = useShop();

    // Products states
    const [products, setProducts] = useState();

    // UseEffect
    useEffect(() => {
        // Get products collection with condition in firestore
        const getProducts = async () => {
            let data = [];
            const qSnapshot = await findWithCondition("products", {
                field: "slug",
                condition: "==",
                data: slug,
            });
            qSnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });

            setProducts(data);
        };

        getProducts();
    }, [findWithCondition, slug]);

    // If haven't product s-> render loading
    if (!products) {
        return <Loading />;
    }

    return (
        <div className="category flow">
            <div className="section-heading">Danh mục sản phẩm</div>
            <div className="category-grid d-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} data={product} />
                ))}
            </div>
        </div>
    );
};

export default Category;
