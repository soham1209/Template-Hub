// back-end/routes/templateRoutes.js
import express from 'express';
import { 
  getTemplates, 
  getTemplate, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getAllCategories 
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTemplates);
router.post('/', protect, createTemplate);

router.get('/categories', protect, getAllCategories); 

router.get('/:id', protect, getTemplate);
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);

export default router;