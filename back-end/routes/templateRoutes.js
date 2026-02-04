// back-end/routes/templateRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getTemplates, 
  getTemplate, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getAllCategories 
} = require('../controllers/templateController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTemplates);
router.post('/', protect, createTemplate);

router.get('/categories', protect, getAllCategories); 

router.get('/:id', protect, getTemplate);
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);

module.exports = router;