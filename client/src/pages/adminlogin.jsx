import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:3000/api/adminlogin",
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            if (res.data.error) {
                setError(res.data.error);
            } else {
                const token = res.data.token;
                localStorage.setItem("token", token);
                navigate(`/admindashboard`);
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred. Please try again.");
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-sm text-center">
                    <p className="text-gray-600">
                        Not registered?
                        <button
                            onClick={() => navigate("/adminsign")}
                            className="text-blue-500 hover:underline ml-1"
                        >
                            Register here
                        </button>
                    </p>
                    <p className="text-gray-500 mt-2">
                        Note: Your account will require owner approval before you can access admin features.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;