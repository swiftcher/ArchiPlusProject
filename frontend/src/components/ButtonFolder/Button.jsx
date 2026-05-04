import "./button.css";

function Button({ text, onClick, type = "button" }) {
    return (
        <button className="btn" type={type} onClick={onClick}>
            {text}
        </button>
    );
}

export default Button;