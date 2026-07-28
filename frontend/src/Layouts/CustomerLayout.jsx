import { Outlet } from "react-router-dom";
import Header from "../components/HeaderFolder/Header";
import Footer from "../components/FooterFolder/Footer";

export default function CustomerLayout(){

    return (
        <>
            <Header />

            <Outlet />

            <Footer />
        </>
    );
}
