// データベース設定
const mysql = require('mysql');
// MySQLとのコネクションの作成
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  database: 'node_todo'
});

// 一覧表示
exports.index = (req, res) => {
  connection.query(
    'SELECT * FROM todos',
    (error, results) => {
      res.render('index.ejs', { todos: results } );
    }
  );
};

// 新規作成
exports.create = (req, res) => {
  connection.query(
    'INSERT INTO todos (content) VALUE (?)',
    [req.body.todoContent],
    (error, results) => {
      res.redirect('/');
    }
  );
};

// 編集
exports.edit =  (req, res) => {
  connection.query(
    'SELECT * FROM todos WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {todo: results[0]} );
    }
  );
};

// 更新
exports.update = (req, res) => {
  connection.query(
    'UPDATE todos SET content = ? WHERE id = ?',
    [req.body.todoContent, req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
};

// 削除
exports.delete = (req, res) => {
  connection.query(
    'DELETE FROM todos WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
};
