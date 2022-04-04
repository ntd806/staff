const express = require('express');
const router = express.Router();
const DepartmentService = require('./DepartmentService');

router.get('/depart/getDetail', DepartmentService.getDetail);
router.post('/depart/detele', DepartmentService.detele);
router.post('/depart/edit', DepartmentService.edit);
router.post('/depart/search', DepartmentService.search);
router.get('/depart/getList', DepartmentService.getList);

module.exports = router;