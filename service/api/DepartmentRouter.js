const express = require('express');
const router = express.Router();
const DepartmentService = require('./DepartmentService');

router.post('/add', DepartmentService.add);
router.post('/detele', DepartmentService.detele);
router.post('/edit', DepartmentService.edit);
router.post('/search', DepartmentService.search);
router.get('/getList', DepartmentService.getList);

module.exports = router;