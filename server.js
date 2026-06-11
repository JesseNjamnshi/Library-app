const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// simple session (for demo)
let currentUser = null;

// DB connection
const db = mysql.createConnection({
    host: "localhost",
    user: "admin_user",
    password: "YOUR_PASSWORD_HERE",
    database: "library_db"
});

db.connect(err => {
    if (err) {
        console.error("DB error:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM Users WHERE username = ? AND password = ?",
        [username, password],
        (err, results) => {
            if (err) return res.status(500).send(err);

            if (results.length === 0) {
                return res.send("Invalid login");
            }

            currentUser = results[0];
            res.send(`Logged in as ${currentUser.role}`);
        }
    );
});

// ---------------- ADMIN CHECK ----------------
function isAdmin(req, res, next) {
    if (!currentUser || currentUser.role !== "admin") {
        return res.send("Admin only");
    }
    next();
}

// ---------------- BOOKS ----------------
app.get("/books", (req, res) => {
    db.query("SELECT * FROM Books", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/books", isAdmin, (req, res) => {
    const { title, author, genre, total_copies } = req.body;

    db.query(
        "INSERT INTO Books (title, author, genre, total_copies) VALUES (?, ?, ?, ?)",
        [title, author, genre, total_copies],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Book added");
        }
    );
});

app.put("/books/:id", isAdmin, (req, res) => {
    const { title, author, genre, total_copies } = req.body;

    db.query(
        "UPDATE Books SET title = ?, author = ?, genre = ?, total_copies = ? WHERE book_id = ?",
        [title, author, genre, total_copies, req.params.id],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Update failed");
            }
            res.send("Book updated");
        }
    );
});

app.delete("/books/:id", isAdmin, (req, res) => {
    db.query(
        "DELETE FROM Books WHERE book_id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Deleted");
        }
    );
});

// ---------------- MEMBERS ----------------
app.get("/members", (req, res) => {
    db.query("SELECT * FROM Members", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/members", (req, res) => {
    const { name, email } = req.body;

    db.query(
        "INSERT INTO Members (name, email) VALUES (?, ?)",
        [name, email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Member added");
        }
    );
});

// ---------------- ACTIVE LOANS ----------------
app.get("/loans", (req, res) => {
    db.query(
        "SELECT * FROM Loans",
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error fetching loans");
            }
            res.json(results);
        }
    );
});

// ---------------- BORROW / RETURN ----------------
app.post("/borrow", (req, res) => {
    const member_id = parseInt(req.body.member_id);
    const book_id = parseInt(req.body.book_id);

    console.log("Borrow:", member_id, book_id);

    db.query(
        "CALL borrow_book(?, ?)",
        [member_id, book_id],
        (err) => {
            if (err) {
                console.log("ERROR:", err);
                return res.send("Borrow failed");
            }
            res.send("Book borrowed");
        }
    );
});

app.post("/return", (req, res) => {
    const loan_id = parseInt(req.body.loan_id);

    db.query(
        "CALL return_book(?)",
        [loan_id],
        (err) => {
            if (err) {
                console.log("ERROR:", err);
                return res.send("Return failed");
            }
            res.send("Book returned");
        }
    );
});

// ---------------- REPORTS ----------------
app.get("/report/popular-books", (req, res) => {
    db.query(`
        SELECT book_id, COUNT(*) AS total
        FROM Loans
        GROUP BY book_id
        ORDER BY total DESC
    `, (err, results) => res.json(results));
});

app.get("/report/fines", (req, res) => {
    db.query(`
        SELECT loan_id,
        calculate_fine(DATEDIFF(return_date, loan_date)) AS fine
        FROM Loans
        WHERE return_date IS NOT NULL
    `, (err, results) => res.json(results));
});

// ---------------- LOGS ----------------
app.get("/logs", (req, res) => {
    db.query("SELECT * FROM Logs ORDER BY timestamp DESC", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ---------------- EVENTS ----------------
app.post("/run-event", (req, res) => {
    db.query(
        "INSERT INTO Logs(action) VALUES('Manual event run')",
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Event executed");
        }
    );
});

// ---------------- START ----------------
app.listen(3000, () => {
    console.log("Server running on port 3000");
});