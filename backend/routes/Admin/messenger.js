const express = require("express");
const router = express.Router();

const db = require("../../db");

const verifyToken = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/roleAuthMiddleware");

router.get("/:conversationId", verifyToken, isAdmin, (req,res)=>{

const sql = `
SELECT *
FROM messages
WHERE conversation_id = ?
ORDER BY created_at ASC
`;

db.query(
sql,
[req.params.conversationId],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);

});

});
// GET ALL SUPPORT CONVERSATIONS

router.get("/", verifyToken, isAdmin, (req, res) => {
  const adminId = req.user.U_ID;

  const sql = `

SELECT

c.id AS convo_id,

c.title,


u.U_ID,
u.U_Name,
u.U_LastName,
u.U_Email,


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



JOIN conversation_users cu_admin

ON c.id = cu_admin.convo_id



JOIN conversation_users cu_customer

ON c.id = cu_customer.convo_id



JOIN Users u

ON cu_customer.U_ID = u.U_ID



WHERE 

cu_admin.U_ID = ?

AND

u.U_Role = 'customer'



GROUP BY c.id


ORDER BY last_message_time DESC



`;

  db.query(sql, [adminId], (err, result) => {
    if (err) {
      console.log("ADMIN MESSENGER ERROR:", err);

      return res.status(500).json(err);
    }

    res.json(result);
  });
});

module.exports = router;
