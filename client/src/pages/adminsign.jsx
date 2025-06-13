import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Adminsign = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both fields");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/adminsign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                // optionally save token: localStorage.setItem('adminToken', data.token);
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError("Login failed. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">Important:</p>
                    <p>Once you register, the owner must manually approve your admin access in the database before you can log in.</p>
                </div>
            </div>
        </div>
    );
};

export default Adminsign;