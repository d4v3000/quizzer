import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_NODE_URL || "http://localhost:4000";

export const socket = io(URL);
