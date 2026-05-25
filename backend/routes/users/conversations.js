
const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');

router.get("/:conversationId", (req, res) => {

    const sql = `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
    `;

    db.query(sql, [req.params.conversationId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

router.get("/", verifyToken,(req, res) => {
    console.log("HEADERS:", req.headers.authorization);
    console.log("USER OBJECT:", req.user);
    console.log("USER id:", req.user.U_ID);
    const userId = req.user.U_ID; // correct field



    const sql = `
        SELECT 
            c.id AS convo_id,
            c.title,

            (
                SELECT m.content
                FROM messages m
                WHERE m.conversation_id = c.id
                ORDER BY m.created_at DESC
                LIMIT 1
            ) AS last_message,

            (
                SELECT m.created_at
                FROM messages m
                WHERE m.conversation_id = c.id
                ORDER BY m.created_at DESC
                LIMIT 1
            ) AS last_message_time

        FROM conversations c
        JOIN conversation_users cu 
            ON cu.convo_id = c.id
        WHERE cu.U_ID = ?
        GROUP BY c.id
        ORDER BY last_message_time DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "DB error" });
        }

        res.json(results);
    });
});
router.post("/create-or-get", verifyToken,(req, res) => {
    const userId = req.user.U_ID;
    const adminId = 3;

    const checkSql = `
        SELECT c.id
        FROM conversations c
        JOIN conversation_users cu1 ON cu1.convo_id = c.id
        JOIN conversation_users cu2 ON cu2.convo_id = c.id
        WHERE cu1.U_ID = ? AND cu2.U_ID = ?
        LIMIT 1
    `;

    db.query(checkSql, [userId, adminId], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res.json({ convo_id: result[0].id });
        }

        const insertConv = `INSERT INTO conversations (title) VALUES ('Support')`;

        db.query(insertConv, (err2, convRes) => {
            if (err2) return res.status(500).json(err2);

            const convoId = convRes.insertId;

            const insertUserSql = `
                INSERT INTO conversation_users (convo_id, U_ID)
                VALUES (?, ?)
            `;

            db.query(insertUserSql, [convoId, userId], (err3) => {
                if (err3) return res.status(500).json(err3);

                db.query(insertUserSql, [convoId, adminId], (err4) => {
                    if (err4) return res.status(500).json(err4);

                    res.json({ convo_id: convoId });
                });
            });
        });
    });
});
router.post("/create", verifyToken, (req, res) => {

    const userId = req.user.U_ID;
    const adminId = 3;

    const insertConv = `
        INSERT INTO conversations (title)
        VALUES (?)
    `;

    db.query(insertConv, [req.body.title || null], (err, convRes) => {

        if (err) return res.status(500).json(err);

        const convoId = convRes.insertId;

        const insertUserSql = `
            INSERT INTO conversation_users (convo_id, U_ID)
            VALUES (?, ?)
        `;

        // add user
        db.query(insertUserSql, [convoId, userId], (err1) => {
            if (err1) return res.status(500).json(err1);

            // add admin
            db.query(insertUserSql, [convoId, adminId], (err2) => {
                if (err2) return res.status(500).json(err2);

                // ✅ SOCKET MUST BE HERE (INSIDE CALLBACK)
                const io = req.app.get("io");

                const newConversation = {
                    convo_id: convoId,
                    title: req.body.title || `Conversation ${convoId}`,
                    last_message_time: new Date()
                };

                io.to(`user_${userId}`).emit(
                    "conversation_updated",
                    newConversation
                );

                io.to(`user_${adminId}`).emit(
                    "conversation_updated",
                    newConversation
                );

                // ✅ SEND RESPONSE ONLY ONCE
                return res.json(newConversation);
            });
        });
    });
});

module.exports = router;