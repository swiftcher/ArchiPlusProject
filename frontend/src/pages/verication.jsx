import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {

    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");

        console.log("TOKEN:", token);

        const verifyEmail = async () => {

            try {

                const res = await fetch(
                    "http://localhost:5000/api/auth/verify-email",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({ token })
                    }
                );

                const data = await res.json();

                console.log(data);

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