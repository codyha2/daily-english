import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import type { StudyRoom } from "../types.js";

export class WebSocketServer {
    private io: Server;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        this.setupHandlers();
    }

    private setupHandlers() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`[WebSocket] Client connected: ${socket.id}`);

            // Join room
            socket.on("join-room", (data: { roomId: string; userId: string; userName: string }) => {
                socket.join(data.roomId);
                socket.data.userId = data.userId;
                socket.data.userName = data.userName;
                socket.data.roomId = data.roomId;

                // Broadcast to room
                this.io.to(data.roomId).emit("member-joined", {
                    userId: data.userId,
                    userName: data.userName,
                    timestamp: new Date().toISOString(),
                });

                console.log(`[WebSocket] ${data.userName} joined room ${data.roomId}`);
            });

            // Leave room
            socket.on("leave-room", (data: { roomId: string }) => {
                socket.leave(data.roomId);

                if (socket.data.roomId && socket.data.userName) {
                    this.io.to(socket.data.roomId).emit("member-left", {
                        userId: socket.data.userId,
                        userName: socket.data.userName,
                        timestamp: new Date().toISOString(),
                    });
                }

                console.log(`[WebSocket] ${socket.data.userName} left room ${data.roomId}`);
            });

            // Progress update
            socket.on("progress-update", (data: {
                wordId: string;
                result: "know" | "forgot";
                recallPercent: number;
            }) => {
                if (socket.data.roomId) {
                    // Broadcast progress to room members
                    this.io.to(socket.data.roomId).emit("member-progress", {
                        userId: socket.data.userId,
                        userName: socket.data.userName,
                        ...data,
                        timestamp: new Date().toISOString(),
                    });
                }
            });

            // Chat message
            socket.on("chat-message", (data: { message: string }) => {
                if (socket.data.roomId) {
                    this.io.to(socket.data.roomId).emit("chat-message", {
                        userId: socket.data.userId,
                        userName: socket.data.userName,
                        message: data.message,
                        timestamp: new Date().toISOString(),
                    });
                }
            });

            // Session control
            socket.on("start-session", () => {
                if (socket.data.roomId) {
                    this.io.to(socket.data.roomId).emit("session-started", {
                        startedBy: socket.data.userId,
                        timestamp: new Date().toISOString(),
                    });
                }
            });

            // Disconnect
            socket.on("disconnect", () => {
                if (socket.data.roomId && socket.data.userName) {
                    this.io.to(socket.data.roomId).emit("member-left", {
                        userId: socket.data.userId,
                        userName: socket.data.userName,
                        timestamp: new Date().toISOString(),
                    });
                }
                console.log(`[WebSocket] Client disconnected: ${socket.id}`);
            });
        });
    }

    // Broadcast event to specific room
    public broadcastToRoom(roomId: string, event: string, data: any) {
        this.io.to(roomId).emit(event, data);
    }

    // Get connected clients in room
    public async getRoomClients(roomId: string): Promise<number> {
        const sockets = await this.io.in(roomId).fetchSockets();
        return sockets.length;
    }
}

export let wsServer: WebSocketServer | null = null;

export function initializeWebSocket(httpServer: HttpServer) {
    wsServer = new WebSocketServer(httpServer);
    console.log("[WebSocket] Server initialized");
    return wsServer;
}
