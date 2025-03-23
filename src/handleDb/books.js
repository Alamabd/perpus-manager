const db = require('better-sqlite3')('books.db');

const init = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        borrow DATE,
        returned DATE,
        status TEXT NOT NULL
    )`)
}

const addBook = (newBook) => {
    const { name, book, borrow, returned } = newBook
    const stmt = db.prepare("INSERT INTO books (name, title, borrow, returned, status) VALUES (?, ?, ?, ?, ?)")
    stmt.run(name, book, borrow, returned, 'pinjam')
}

const getBook = () => {
    const stmt = db.prepare("SELECT * FROM books ORDER BY id DESC")
    const result = stmt.all()
    return result
}

const changeStatusBook = (id, setStatus) => {
    const stmt = db.prepare("UPDATE books SET status = ? WHERE id = ?")
    stmt.run(setStatus, id)
}

module.exports = { init, addBook, getBook, changeStatusBook}