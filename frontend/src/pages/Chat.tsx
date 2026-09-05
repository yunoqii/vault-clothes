import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { apiFetch } from '../lib/apiFetch'

const SOCKET_URL = "http://localhost:3000";

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

function Chat() {
    const { conversationId: routeConversationId } = useParams();
    const [conversationId, setConversationId] = useState(routeConversationId ?? "");
    const [targetUsername, setTargetUsername] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState("");
    const [error, setError] = useState("");
    const socketRef = useRef<Socket | null>(null);

    // Connect once when the page mounts. Unlike apiFetch's one-off REST
    // calls, this is a single long-lived connection kept open in a ref
    // (not state — we never want it to trigger a re-render itself).
    useEffect(() => {
        const token = localStorage.getItem("token");
        const socket = io(SOCKET_URL, { auth: { token } });
        socketRef.current = socket;

        socket.on("connect_error", (err) => {
            setError(`Connection failed: ${err.message}`);
        });

        socket.on("new_message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("message_error", (payload: { error: string }) => {
            setError(payload.error);
        });

        socket.on("conversation_error", (payload: { error: string }) => {
            setError(payload.error);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const openConversation = async (id: string) => {
        setError("");
        setConversationId(id);
        setMessages([]);

        const response = await apiFetch(`/conversations/${id}/messages`);
        const data = await response.json();

        if (!response.ok) {
            setError(data.error ?? "Failed to load messages");
            return;
        }

        // History comes back newest-first (same cursor pagination as the
        // feed/listings) — reverse for a natural top-to-bottom chat order.
        setMessages([...data.messages].reverse());
        socketRef.current?.emit("join_conversation", id);
    };

    useEffect(() => {
        if (routeConversationId) {
            openConversation(routeConversationId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routeConversationId]);

    const handleStartChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const profileResponse = await apiFetch(`/users/${targetUsername.trim()}`);
        const profile = await profileResponse.json();

        if (!profileResponse.ok) {
            setError(profile.error ?? "User not found");
            return;
        }

        const conversationResponse = await apiFetch("/conversations", {
            method: "POST",
            body: JSON.stringify({ otherUserId: profile.id }),
        });
        const conversation = await conversationResponse.json();

        if (!conversationResponse.ok) {
            setError(conversation.error ?? "Failed to start conversation");
            return;
        }

        openConversation(conversation.id);
    };

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!messageText.trim() || !conversationId) return;

        socketRef.current?.emit("send_message", { conversationId, content: messageText });
        setMessageText("");
    };

    return (
        <div>
            <h1>Chat</h1>
            {error && <p>{error}</p>}

            {!conversationId && (
                <form onSubmit={handleStartChat}>
                    <input
                        value={targetUsername}
                        onChange={(e) => setTargetUsername(e.target.value)}
                        placeholder="Username to chat with"
                    />
                    <button>Start chat</button>
                </form>
            )}

            {conversationId && (
                <>
                    <div>
                        {messages.map((message) => (
                            <p key={message.id}>{message.content}</p>
                        ))}
                    </div>
                    <form onSubmit={handleSend}>
                        <input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Message"
                        />
                        <button>Send</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Chat
