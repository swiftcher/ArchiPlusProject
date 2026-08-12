import { useEffect, useState } from "react";
import apiPublic from "../../api/apiPublic";
import "./productModal.css";

function ProductModal({ product, onClose }) {
    const [feedback, setFeedback] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(true);

    useEffect(() => {
        if (!product) {
            return;
        }

        const loadFeedback = async () => {
            setLoadingFeedback(true);

            try {
                const res = await apiPublic.get(
                    `/feedback/product/${product.P_ID}`
                );

                console.log("Feedback API response:", res.data);

                const feedbackData = res.data?.data;

                if (Array.isArray(feedbackData)) {
                    setFeedback(feedbackData);
                } else {
                    console.error(
                        "Unexpected feedback response:",
                        res.data
                    );
                    setFeedback([]);
                }
            } catch (error) {
                console.error(
                    "Failed to load product feedback:",
                    error
                );

                setFeedback([]);
            } finally {
                setLoadingFeedback(false);
            }
        };

        loadFeedback();
    }, [product]);

    if (!product) {
        return null;
    }

    const averageRating =
        feedback.length > 0
            ? feedback.reduce(
                  (sum, item) =>
                      sum + Number(item.F_Rating || 0),
                  0
              ) / feedback.length
            : 0;

    const renderStars = (rating) => {
        const numericRating = Number(rating) || 0;

        return (
            <span
                className="modal-stars"
                aria-label={`${numericRating} out of 5 stars`}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={
                            star <= Math.round(numericRating)
                                ? "modal-star filled"
                                : "modal-star"
                        }
                    >
                        ★
                    </span>
                ))}
            </span>
        );
    };

    return (
        <div
            className="product-modal-overlay"
            onClick={onClose}
        >
            <div
                className="product-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* CLOSE */}

                <button
                    className="product-modal-close"
                    onClick={onClose}
                    aria-label="Close product details"
                >
                    ×
                </button>

                {/* PRODUCT IMAGE */}

                <div className="product-modal-image-wrapper">
                    {product.P_Picture ? (
                        <img
                            src={product.P_Picture}
                            alt={product.P_Name}
                            className="product-modal-image"
                        />
                    ) : (
                        <div className="product-modal-no-image">
                            No Image
                        </div>
                    )}
                </div>

                {/* PRODUCT CONTENT */}

                <div className="product-modal-content">

                    <div className="product-modal-main-info">

                        <span className="modal-category">
                            {product.Cat_Name}
                        </span>

                        <h2>{product.P_Name}</h2>

                        <p className="modal-description">
                            {product.P_Description}
                        </p>

                    </div>

                    {/* PRICE / STOCK */}

                    <div className="modal-product-details">

                        <div className="modal-price">
                            $
                            {Number(
                                product.P_Price
                            ).toFixed(2)}
                        </div>

                        <div
                            className={
                                Number(
                                    product.AvailableStock
                                ) <= 5
                                    ? "modal-stock low"
                                    : "modal-stock"
                            }
                        >
                            <span className="modal-stock-label">
                                Stock
                            </span>

                            <strong>
                                {product.AvailableStock}
                            </strong>
                        </div>

                    </div>

                    {/* =========================
                        RATING
                    ========================= */}

                    <section className="modal-rating">

                        <div className="modal-section-title">
                            <h3>Rating</h3>

                            {!loadingFeedback &&
                                feedback.length > 0 && (
                                    <span className="rating-count">
                                        {feedback.length}{" "}
                                        {feedback.length === 1
                                            ? "review"
                                            : "reviews"}
                                    </span>
                                )}
                        </div>

                        {loadingFeedback ? (

                            <p className="feedback-loading">
                                Loading rating...
                            </p>

                        ) : feedback.length > 0 ? (

                            <div className="modal-average-rating">

                                {renderStars(
                                    averageRating
                                )}

                                <strong>
                                    {averageRating.toFixed(1)}
                                </strong>

                                <span>
                                    / 5
                                </span>

                            </div>

                        ) : (

                            <p className="no-rating">
                                No ratings yet.
                            </p>

                        )}

                    </section>

                    {/* =========================
                        REVIEWS
                    ========================= */}

                    <section className="modal-reviews">

                        <div className="modal-section-title">

                            <h3>
                                Customer Reviews
                            </h3>

                        </div>

                        {loadingFeedback ? (

                            <p className="feedback-loading">
                                Loading reviews...
                            </p>

                        ) : feedback.length === 0 ? (

                            <div className="no-reviews">
                                <p>
                                    No reviews yet.
                                </p>

                                <small>
                                    Be the first customer
                                    to review this product.
                                </small>
                            </div>

                        ) : (

                            <div className="feedback-list">

                                {feedback.map((item) => (

                                    <div
                                        className="feedback-item"
                                        key={item.F_ID}
                                    >

                                        <div className="feedback-header">

                                            <div className="feedback-user">

                                                <strong>
                                                    {item.U_Name ||
                                                        "Anonymous"}
                                                </strong>

                                                <small>
                                                    {item.F_Date
                                                        ? new Date(
                                                              item.F_Date
                                                          ).toLocaleDateString()
                                                        : ""}
                                                </small>

                                            </div>

                                            <div className="feedback-rating">

                                                {renderStars(
                                                    item.F_Rating
                                                )}

                                                <span>
                                                    {Number(
                                                        item.F_Rating
                                                    ) || 0}
                                                    /5
                                                </span>

                                            </div>

                                        </div>

                                        {item.F_Comment && (

                                            <p className="feedback-comment">
                                                "{item.F_Comment}"
                                            </p>

                                        )}

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>
            </div>
        </div>
    );
}

export default ProductModal;