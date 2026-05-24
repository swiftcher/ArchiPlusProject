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

        socket.on("join_conversation", (conversationId) => {
        console.log("JOIN CONVERSATION:", conversationId, socket.id);

        socket.join(`conv_${conversationId}`);

        console.log("ROOMS AFTER JOIN:", socket.rooms);
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
            created_at: new Date(),
            title: "Support"
        };

        // GET PARTICIPANTS
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

               users.forEach((u) => {

                // push notification / sidebar update
                io.to(`user_${u.U_ID}`).emit(
                    "receive_message",
                    savedMessage
                );
                });

                // realtime active chat updates
                io.to(`conv_${conversation_id}`).emit(
                    "receive_message",
                    savedMessage
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