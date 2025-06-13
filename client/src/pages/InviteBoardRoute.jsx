import { useParams, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import WhiteboardCanvas from "./WhiteboardCanvas";
import { useEffect, useState } from "react";

const InviteBoardRoute = () => {
    const { boardId } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [valid, setValid] = useState(null);
    const [inviteInfo, setInviteInfo] = useState(null);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.boardId === boardId) {
                // Save token for later use (optional)
                localStorage.setItem("token", token);
                setInviteInfo(decoded);
                setValid(true);
            } else {
                setValid(false);
            }
        } catch {
            setValid(false);
        }
    }, [token, boardId]);

    if (valid === null) return <p>Validating...</p>;
    if (valid === false) return <p>Invalid or expired invite token.</p>;

    return (
        <div>
            <p className="text-center text-sm text-gray-600 mb-2">
                You were invited to board <strong>{boardId}</strong> by <strong>{inviteInfo?.fromName || inviteInfo?.from}</strong>
            </p>
            <p className="text-center text-xs text-gray-500 mb-4">
                Logged in as: <strong>{inviteInfo?.to}</strong>
            </p>
            <WhiteboardCanvas />
        </div>
    );
};

export default InviteBoardRoute;