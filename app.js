var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// ここから書き始める

// メソッドオーバーライドの設定
var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// データベース設定
const mysql = require('mysql');
// MySQLとのコネクションの作成
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  database: 'node_todo'
});

// 一覧表示
app.get('/', (req, res) => {
  connection.query(
    'SELECT categories.*, GROUP_CONCAT(todos.content) AS todos FROM categories LEFT JOIN todos ON categories.id = todos.category_id GROUP BY categories.id',
    (error, results) => {
      res.render('index.ejs', { categories: results } )
    }
  );
});

// 新規作成
app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO todos (content, category_id) VALUE (?, ?)',
    [req.body.todoContent, req.body.categoryId],
    (error, results) => {
      console.log(results);
      res.redirect('/');
    }
  );
});

// 編集
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM todos WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {todo: results[0]} );
    }
  );
});

// 更新
app.put('/update/:id', (req, res) => {
  connection.query(
    'UPDATE todos SET content = ? WHERE id = ?',
    [req.body.todoContent, req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
});

// 完了
app.put('/complete/:id', (req, res) => {
  connection.query(
    'UPDATE todos SET done = 1 WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  )
});

// 削除
app.delete('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM todos WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
});

// カテゴリーの新規作成画面
app.get('/categories', (req, res) => {
  connection.query(
    'SELECT * FROM categories',
    (error, results) => {
      res.render('categories/index.ejs', { categories: results } );
    }
  );
});

// カテゴリーの追加
app.post('/categories', (req, res) => {
  connection.query(
    'INSERT INTO categories (name) VALUE (?)',
    [req.body.categoryName],
    (error, results) => {
      res.redirect('/categories');
    }
  );
});

app.get('/categories/:id/edit', (req, res) => {
  connection.query(
    'SELECT * FROM categories WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('categories/edit.ejs', {category: results[0]} );
    }
  );
});

app.put('/categories/:id', (req, res) => {
  connection.query(
    'UPDATE categories SET name = ? WHERE id = ?',
    [req.body.categoryName, req.params.id],
    (error, results) => {
      res.redirect('/categories');
    }
  );
});

// カテゴリーの削除
app.delete('/categories/:id', (req, res) => {
  connection.query(
    'DELETE FROM categories WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/categories');
    }
  );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
