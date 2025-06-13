import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:3000/api/verify", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 200) {
                    setAuth(true);
                } else {
                    setAuth(false);
                }
            } catch (error) {
                setAuth(false);
            }
        };

        verifyToken();
    }, []);

    if (auth === null) return <div>Loading...</div>;

    return auth ? children : <Navigate to="/" />;
};

export default PrivateRoute;