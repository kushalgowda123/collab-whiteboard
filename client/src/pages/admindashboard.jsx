import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [boardId, setBoardId] = useState("");
    const [viewBoardId, setViewBoardId] = useState("");
    const [downloadBoardId, setDownloadBoardId] = useState("");
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token"); // or context value

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:3000/api/invite/send",
                { email, boardId },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || "Error sending invite");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4">Send Board Invite</h2>
                <input
                    type="text"
                    placeholder="Board ID"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                    className="w-full p-2 border mb-4 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Recipient Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border mb-4 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Send Invite
                </button>
                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </form>
            <div className="bg-white mt-6 p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Open Existing Whiteboard</h2>
                <input
                    type="text"
                    placeholder="Enter Board ID"
                    value={viewBoardId}
                    onChange={(e) => setViewBoardId(e.target.value)}
                    className="w-full p-2 border mb-4 rounded"
                    required
                />
                <button
                    onClick={() => {
                        if (viewBoardId) {
                            navigate(`/whiteboard?boardId=${viewBoardId}`);
                        }
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Open Whiteboard
                </button>
            </div>
            <div className="bg-white mt-6 p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Download Whiteboard</h2>
                <input
                    type="text"
                    placeholder="Enter Board ID to Download"
                    value={downloadBoardId}
                    onChange={(e) => setDownloadBoardId(e.target.value)}
                    className="w-full p-2 border mb-4 rounded"
                    required
                />
                <button
                    onClick={async () => {
                        if (!downloadBoardId.trim()) {
                            alert("Please enter a valid Board ID");
                            return;
                        }

                        try {
                            const res = await axios.get(
                                `http://localhost:3000/api/download?boardId=${downloadBoardId}`,
                                { responseType: "blob" }
                            );

                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", `${downloadBoardId}_whiteboard.png`);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        } catch (err) {
                            console.error("Download error:", err);
                            alert("Failed to download whiteboard.");
                        }
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                    Download Whiteboard
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;