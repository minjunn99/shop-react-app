// Import library
import React from "react";
import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Autoplay, Navigation, Controller } from "swiper";

// Import Swiper styles
import "swiper/scss";
import "swiper/scss/navigation";

// Import components
import slides from "../../assets/slides";
import categories from "../../assets/category";

const Home = () => {
    return (
        <div className="home flow">
            {/* Home Banner */}
            <div className="home-banner">
                <Swiper
                    slidesPerView={1}
                    breakpoints={{
                        1040: {
                            slidesPerView: 2,
                        },
                    }}
                    spaceBetween={30}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    navigation={true}
                    modules={[Autoplay, Navigation, Controller]}
                    className="mySwiper"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img
                                style={{
                                    width: "100%",
                                    objectFit: "cover",
                                    borderRadius: "0.5rem",
                                }}
                                src={slide.url}
                                alt="Banner shop"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* Home category */}
            <div className="home-category">
                <div className="section-heading">Danh mục nổi bật</div>
                <div className="home-grid d-grid">
                    {categories.map((category, index) => (
                        <Link
                            to={`/category/${category.slug}`}
                            className="d-flex justify-center items-center direction-column"
                            style={{
                                backgroundColor: "#fff",
                                paddingBlock: "0.5rem",
                                borderRadius: "0.5em",
                            }}
                            key={index}
                        >
                            <img
                                style={{
                                    width: "3.75rem",
                                    aspectRatio: "1",
                                    objectFit: "cover",
                                }}
                                src={category.url}
                                alt="Banner shop"
                            />
                            <p className="fs-200 text-neutral-500 fw-medium text-capitalize">
                                {category.label}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
