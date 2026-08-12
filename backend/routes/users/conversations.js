const express = require("express");
const router = express.Router();

const db = require("../../db");
const verifyToken = require("../../middleware/authMiddleware");

// GET MESSAGES
router.get("/:conversationId", verifyToken, (req, res) => {
  const sql = `
SELECT *
FROM messages
WHERE conversation_id = ?
ORDER BY created_at ASC
`;

  db.query(sql, [req.params.conversationId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

// GET USER CONVERSATIONS
router.get("/", verifyToken, (req, res) => {
  const userId = req.user.U_ID;

  const sql = `

SELECT

c.id AS convo_id,

c.title,


(
SELECT m.content
FROM messages m
WHERE m.conversation_id=c.id
ORDER BY m.created_at DESC
LIMIT 1
)
AS last_message,


(
SELECT m.created_at
FROM messages m
WHERE m.conversation_id=c.id
ORDER BY m.created_at DESC
LIMIT 1
)
AS last_message_time


FROM conversations c


JOIN conversation_users cu

ON cu.convo_id=c.id


WHERE cu.U_ID=?


ORDER BY last_message_time DESC

`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json(err);
    }

    res.json(results);
  });
});

// CREATE OR GET SUPPORT CHAT
router.post("/create-or-get", verifyToken, (req, res) => {
  const userId = req.user.U_ID;

  // CHECK EXISTING CHAT

  const checkSql = `

SELECT c.id

FROM conversations c


JOIN conversation_users cu

ON cu.convo_id=c.id


WHERE cu.U_ID=?


LIMIT 1

`;

  db.query(checkSql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    // ALREADY EXISTS

    if (result.length > 0) {
      return res.json({
        convo_id: result[0].id,
      });
    }

    // FIND ADMIN

    const adminSql = `

SELECT

U_ID

FROM Users

WHERE U_Role='admin'

LIMIT 1

`;

    db.query(adminSql, (err, admins) => {
      if (err) return res.status(500).json(err);

      if (admins.length === 0) {
        return res.status(400).json({
          message: "No admin available",
        });
      }

      const adminId = admins[0].U_ID;

      // CREATE CONVERSATION

      const createSql = `

INSERT INTO conversations(title)

VALUES('Support')

`;

      db.query(createSql, (err, conv) => {
        if (err) return res.status(500).json(err);

        const convoId = conv.insertId;

        const addUser = `

INSERT INTO conversation_users
(convo_id,U_ID)

VALUES(?,?)

`;

        // ADD CUSTOMER

        db.query(addUser, [convoId, userId], (err) => {
          if (err) return res.status(500).json(err);

          // ADD ADMIN

          db.query(addUser, [convoId, adminId], (err) => {
            if (err) return res.status(500).json(err);

            const io = req.app.get("io");

            const conversation = {
              convo_id: convoId,

              title: "Support",

              last_message_time: new Date(),
            };

            // NOTIFY USER

            io.to(`user_${userId}`).emit("conversation_updated", conversation);

            // NOTIFY ADMIN

            io.to(`user_${adminId}`).emit("conversation_updated", conversation);

            res.json(conversation);
          });
        });
      });
    });
  });
});

module.exports = router;
