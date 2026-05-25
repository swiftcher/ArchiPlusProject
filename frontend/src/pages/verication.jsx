import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiPrivate from "../api/apiPrivate";

export default function VerifyEmail() {

    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");

        console.log("TOKEN:", token);

        const verifyEmail = async () => {
        try {
            const res = await apiPrivate.post("/auth/verify-email", {
            token
            });

            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
        };

        if (token) {
            verifyEmail();
        }

    }, []);

    return <h1>Verifying email... you can close this window </h1>;
}