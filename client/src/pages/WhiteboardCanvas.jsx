import React, { useRef, useEffect, useState } from "react";
import socket from "../utils/socket";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const WhiteboardCanvas = () => {
    const [searchParams] = useSearchParams();
    const { boardId: boardIdPath } = useParams();
    const boardIdQuery = searchParams.get("boardId");
    const boardId = boardIdPath || boardIdQuery;
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const drawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const textInputRef = useRef(null);

    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(5);
    const [tool, setTool] = useState("pen"); // 'pen', 'eraser', 'text'
    const [textInput, setTextInput] = useState({
        open: false,
        x: 0,
        y: 0,
        text: ""
    });
    const [brushSize, setBrushSize] = useState("medium"); // small, medium, large

    // Update brush size based on selection
    useEffect(() => {
        switch (brushSize) {
            case "small":
                setLineWidth(3);
                break;
            case "medium":
                setLineWidth(5);
                break;
            case "large":
                setLineWidth(10);
                break;
            default:
                setLineWidth(5);
        }
    }, [brushSize]);

    // Update context properties when color/tool changes
    useEffect(() => {
        if (!ctxRef.current) return;

        if (tool === "eraser") {
            ctxRef.current.strokeStyle = "#FFFFFF";
            ctxRef.current.lineWidth = lineWidth * 3; // Make eraser thicker
        } else {
            ctxRef.current.strokeStyle = color;
            ctxRef.current.lineWidth = lineWidth;
        }
    }, [color, tool, lineWidth]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        ctxRef.current.fillStyle = "#FFFFFF";
        ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);

        // Save cleared canvas
        const base64Image = canvas.toDataURL("image/png");
        axios.post("http://localhost:3000/api/whiteboard/save", {
            boardId,
            imageData: base64Image
        }).catch(err => {
            console.error("Failed to save canvas:", err);
        });
    };

    const startTextInput = (x, y) => {
        setTextInput({
            open: true,
            x,
            y,
            text: ""
        });
    };

    const finishTextInput = () => {
        if (textInput.text.trim()) {
            ctxRef.current.font = `${lineWidth * 5}px Arial`;
            ctxRef.current.fillStyle = color;
            ctxRef.current.fillText(textInput.text, textInput.x, textInput.y);

            // Save after adding text
            const canvas = canvasRef.current;
            const base64Image = canvas.toDataURL("image/png");
            axios.post("http://localhost:3000/api/whiteboard/save", {
                boardId,
                imageData: base64Image
            }).catch(err => {
                console.error("Failed to save canvas:", err);
            });
        }
        setTextInput({ open: false, x: 0, y: 0, text: "" });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctxRef.current = ctx;

        // Initialize with white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Emit joinBoard event after initializing canvas
        socket.emit("joinBoard", boardId);

        // Load existing canvas image
        const loadCanvas = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/whiteboard/${boardId}`);
                if (res.data.imageData) {
                    const img = new Image();
                    img.src = res.data.imageData;
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                    };
                }
            } catch (err) {
                console.error("Failed to load canvas:", err);
            }
        };
        loadCanvas();

        const startDrawing = (event) => {
            if (tool === "text") return;

            drawing.current = true;
            const { offsetX, offsetY } = getCoordinates(event);
            lastPos.current = { x: offsetX, y: offsetY };
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(offsetX, offsetY);
        };

        const draw = (event) => {
            if (!drawing.current || tool === "text") return;

            const { offsetX, offsetY } = getCoordinates(event);

            ctxRef.current.lineTo(offsetX, offsetY);
            ctxRef.current.stroke();

            // Emit drawing data, include boardId
            socket.emit("drawing", {
                boardId,
                startX: lastPos.current.x,
                startY: lastPos.current.y,
                endX: offsetX,
                endY: offsetY,
                color: tool === "eraser" ? "#FFFFFF" : color,
                width: ctxRef.current.lineWidth
            });

            lastPos.current = { x: offsetX, y: offsetY };
        };

        const stopDrawing = () => {
            if (!drawing.current) return;
            drawing.current = false;
            ctxRef.current.closePath();
        };

        const handleDoubleClick = (event) => {
            if (tool !== "text") return;
            const { offsetX, offsetY } = getCoordinates(event);
            startTextInput(offsetX, offsetY);
        };

        const getCoordinates = (event) => {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: event.clientX - rect.left,
                offsetY: event.clientY - rect.top
            };
        };

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseleave", stopDrawing);
        canvas.addEventListener("dblclick", handleDoubleClick);

        socket.on("drawing", (data) => {
            // Save current context settings
            const originalStrokeStyle = ctxRef.current.strokeStyle;
            const originalLineWidth = ctxRef.current.lineWidth;

            ctxRef.current.strokeStyle = data.color;
            ctxRef.current.lineWidth = data.width;
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(data.startX, data.startY);
            ctxRef.current.lineTo(data.endX, data.endY);
            ctxRef.current.stroke();

            // Restore original settings
            ctxRef.current.strokeStyle = originalStrokeStyle;
            ctxRef.current.lineWidth = originalLineWidth;
        });

        const saveInterval = setInterval(() => {
            const base64Image = canvas.toDataURL("image/png");
            axios.post("http://localhost:3000/api/whiteboard/save", {
                boardId,
                imageData: base64Image
            }).catch(err => {
                console.error("Failed to save canvas:", err);
            });
        }, 5000);

        return () => {
            socket.off("drawing");
            clearInterval(saveInterval);
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", stopDrawing);
            canvas.removeEventListener("mouseleave", stopDrawing);
            canvas.removeEventListener("dblclick", handleDoubleClick);
        };
    }, [boardId]);

    return (
        <>
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex gap-4 items-center border border-gray-200">
                {/* Tool Selection */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool("pen")}
                        className={`p-2 rounded-lg ${tool === "pen" ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-100 hover:bg-gray-200"}`}
                        title="Pen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setTool("eraser")}
                        className={`p-2 rounded-lg ${tool === "eraser" ? "bg-red-100 border-2 border-red-500" : "bg-gray-100 hover:bg-gray-200"}`}
                        title="Eraser"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setTool("text")}
                        className={`p-2 rounded-lg ${tool === "text" ? "bg-green-100 border-2 border-green-500" : "bg-gray-100 hover:bg-gray-200"}`}
                        title="Text"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300 mx-1"></div>

                {/* Color Picker */}
                <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 p-0 border border-gray-300 rounded-lg cursor-pointer"
                        title="Stroke Color"
                    />
                </div>

                {/* Brush Size */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Brush</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setBrushSize("small")}
                            className={`p-1 rounded-lg ${brushSize === "small" ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                            <div className="w-4 h-4 rounded-full bg-white"></div>
                        </button>
                        <button
                            onClick={() => setBrushSize("medium")}
                            className={`p-1 rounded-lg ${brushSize === "medium" ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                            <div className="w-6 h-6 rounded-full bg-white"></div>
                        </button>
                        <button
                            onClick={() => setBrushSize("large")}
                            className={`p-1 rounded-lg ${brushSize === "large" ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-white"></div>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300 mx-1"></div>

                {/* Clear Button */}
                <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:from-red-600 hover:to-red-700 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Clear Canvas
                </button>
            </div>

            {/* Text Input */}
            {textInput.open && (
                <div
                    className="fixed z-50 bg-white p-1 border border-gray-300 rounded-lg shadow-lg"
                    style={{
                        left: textInput.x,
                        top: textInput.y,
                        transform: 'translateY(-100%)'
                    }}
                >
                    <input
                        ref={textInputRef}
                        type="text"
                        value={textInput.text}
                        onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                        onBlur={finishTextInput}
                        onKeyDown={(e) => e.key === 'Enter' && finishTextInput()}
                        autoFocus
                        className="px-3 py-2 text-base outline-none rounded-lg w-64"
                        placeholder="Type text here..."
                    />
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full bg-white"
                style={{ cursor: tool === "text" ? "text" : "crosshair" }}
            />
        </>
    );
};

export default WhiteboardCanvas;