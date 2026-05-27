import ProductCarousel from "../components/CarouselFolder/Carousel";
import { useContext,useEffect,useState,useRef } from "react";
import { ProductContext } from "../context/ProductContext";
import "./home.css";
import convo from "../assets/convo.jpg";
import apiPrivate from "../api/apiPrivate";
import song from "../assets/Vogue.mp3";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";



export default function Home() {
  const [cart, setCart] = useState([]);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  

const audioRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);

const playMusic = async () => {
    if (!audioRef.current) return;

    await audioRef.current.play();
    setIsPlaying(true);
};

const pauseMusic = () => {
    audioRef.current.pause();
    setIsPlaying(false);
};

const resetMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; 
    setIsPlaying(false);
};

useEffect(() => {
  if (!user)
        return;

    const loadCart = async () => {
      

        try {

            const res = await apiPrivate.get("cart/userCart");

            setCart(res.data?.data || []);

        } catch (err) {
            console.log(err);
        }
    };

    loadCart();

}, [user]);

  const { products } = useContext(ProductContext);



  const homeProducts = [...products].sort((a, b) =>
    a.P_Name.localeCompare(b.P_Name)
  );

  // simple split for demo (you can replace later with real data)
  const featuredProducts = homeProducts.slice(0, 10);
  const newProducts = homeProducts.slice(10, 16);



  return (
    <div className="home">

      {/* HERO */}
      <section className="home-hero">

        <div className="hero-left">
        <img src={convo} />
        </div>

        <div className="hero-text">
        <h1>
          Vouge! It's <span className="brand">ArchiPlus</span>
        </h1>

        <p>
          Where ideas, design, and creativity are <span className="highlight">shared</span>
        </p>
      </div>
        
         

         {/* VINYL PLAYER */}
         
<div className="vinyl-player">
  

   <div className={`vinyl ${isPlaying ? "spin" : ""}`}>
    <div className="vinyl-center"></div>
    <div className="vinyl-dot"></div>
</div>

    <audio ref={audioRef} src={song} />

    <div className="vinyl-controls">
      {isPlaying ?  <button
            className="vinyl-btn pause"
            onClick={pauseMusic}
        >
            ❚❚
        </button>:
        <button
            className="vinyl-btn play"
            onClick={playMusic}
        >
            ▶
        </button>
      
        
        }
        <button
            className="vinyl-btn pause"
            onClick={resetMusic}
        >
            ⟲
        </button> 
  
        

        

    </div>

</div>
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="home-categories">
        <div className="category-card" onClick={() => navigate("/categories?cat=3DPrinted")}>3D-Printed</div>
        <div className="category-card" onClick={() => navigate("/categories?cat=Canvas")}>Canvas</div>
        <div className="category-card" onClick={() => navigate("/categories?cat=Fabrics")}>Fabrics</div>
        <div className="category-card" onClick={() => navigate("/categories?cat=Digital Art")}>Digital Art</div>
        <div className="category-card" onClick={() => navigate("/categories?cat=Material Art")}>Material art</div>
      </section>

      {/* FEATURED */}
      <section className="home-section">
        <h2 className="home-title">Featured Products</h2>
        <ProductCarousel products={featuredProducts} cart={cart} />
      </section>

      {/* NEW ARRIVALS */}
      <section className="home-section">
        <h2 className="home-title">New Arrivals</h2>
        <ProductCarousel products={newProducts} cart={cart} />
      </section>

    </div>
  );
}