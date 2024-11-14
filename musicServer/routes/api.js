const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// 查询数据库中的所有内容
router.get('/getcontext', (req, res) => {
    db.query('SELECT * FROM context', (err, results) => {
        if (err) {
            return res.status(500).json({ error: '查询失败', message: err.message, code: 500 });
        }
        res.json({ data: results, code: 200 });
    });
});

// 添加内容到数据库，通过请求体获取数据
router.post('/addcontext', (req, res) => {
    const { user, context } = req.body; // 从请求体中获取数据

    // 验证请求数据
    if (!user || !context) {
        return res.status(400).json({ error: '缺少信息', code: 400 });
    }

    // 插入新内容到 context 表
    const sql = 'INSERT INTO context (user, text, time) VALUES (?, ?, NOW())';
    db.query(sql, [user, context], (err, result) => {
        if (err) {
            return res.status(500).json({ error: '数据库错误', message: err.message, code: 500 });
        }
        res.json({ message: '发送成功', id: result.insertId, code: 200 });
    });
});

module.exports = router;