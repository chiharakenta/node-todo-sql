const express = require('express');
const router = express.Router();
const todos = require('../controllers/todosController');

// 一覧表示
router.get('/', (req, res) => {
  todos.index(req, res);
});

// 新規作成
router.post('/', (req, res) => {
  todos.create(req, res);
});

// 編集
router.get('/:id/edit', (req, res) => {
  todos.edit(req, res);
});

// 更新
router.put('/:id', (req, res) => {
  todos.update(req, res);
});

// 削除
router.delete('/:id', (req, res) => {
  todos.delete(req, res);
});

module.exports = router;