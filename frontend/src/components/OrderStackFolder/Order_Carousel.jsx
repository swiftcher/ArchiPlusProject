import Order from "../OrderFolder/Order";
import "./order_Carousel.css";

function OrderCarousel({ orders }) {
    return (
        <div className="order-carousel">
            {orders.map((order) => (
                <Order key={order.O_ID} {...order} />
            ))}
        </div>
    );
}

export default OrderCarousel;