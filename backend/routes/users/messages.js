const socketIO = require("socket.io");

function initSocket(server, db) {
    const io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        // USER REGISTRATION (IMPORTANT)
        socket.on("join_user", (userId) => {
            socket.join(`user_${userId}`);
            console.log("User joined personal room:", userId);
        });

        // JOIN CONVERSATION
        socket.on("join_conversation", (conversationId) => {
            socket.join(`conv_${conversationId}`);
            console.log("Joined conversation:", conversationId);
        });

        // SEND MESSAGE
        socket.on("send_message", (data) => {

            const { conversation_id, sender_id, content } = data;

            const sql = `
                INSERT INTO messages (conversation_id, sender_id, content)
                VALUES (?, ?, ?)
            `;

            db.query(sql, [conversation_id, sender_id, content], (err, result) => {

                if (err) {
                    console.log(err);
                    return;
                }

                const savedMessage = {
                    id: result.insertId,
                    conversation_id,
                    sender_id,
                    content,
                    created_at: new Date()
                };

                // GET USERS IN CONVERSATION
                const usersSql = `
                    SELECT U_ID
                    FROM conversation_users
                    WHERE convo_id = ?
                `;

                db.query(usersSql, [conversation_id], (err2, users) => {

                    if (err2) {
                        console.log(err2);
                        return;
                    }

                    users.forEach((u) => {

                        // 1. LIVE CHAT (if open)
                        io.to(`conv_${conversation_id}`).emit(
                            "receive_message",
                            savedMessage
                        );

                        // 2. SIDEBAR UPDATE (NEW CONVO OR MOVE TO TOP)
                        io.to(`user_${u.U_ID}`).emit(
                            "conversation_updated",
                            {
                                convo_id: conversation_id,
                                last_message: content,
                                last_message_time: new Date(),
                                sender_id: sender_id
                            }
                        );
                    });
                });
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = initSocket;