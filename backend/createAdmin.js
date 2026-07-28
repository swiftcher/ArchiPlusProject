

const bcrypt = require("bcryptjs");
const db = require("./db");

const createAdmin = async () => {

    const password = "123456";

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO Users
        (U_Name, U_LastName, U_Email, U_Password, U_Role, U_IsVerified)
        VALUES (?, ?, ?, ?, 'admin', true)
    `;

    db.query(
        sql,
        [
            "Admin",
            "Account",
            "admin@test.com",
            hashedPassword
        ],
        (err, result) => {

            if(err){
                console.error(err);
                return;
            }

            console.log("Admin created:", result.insertId);
            process.exit();
        }
    );
};

createAdmin();