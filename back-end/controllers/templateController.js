const db = require('../config/db');

// @desc    Get all templates for a specific user
// @route   GET /api/templates?userId=1
exports.getTemplates = async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Default to ID 1 for testing
    
    const [rows] = await db.query(
      'SELECT id, name, category, subject, updated_at FROM templates WHERE user_id = ? ORDER BY updated_at DESC', 
      [userId]
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single template by ID
// @route   GET /api/templates/:id
exports.getTemplate = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const template = rows[0];
    res.status(200).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new template
// @route   POST /api/templates
exports.createTemplate = async (req, res) => {
  try {
    const { user_id, name, category, subject, sections } = req.body;
    
    const sectionsJson = JSON.stringify(sections || []); 

    const [result] = await db.query(
      'INSERT INTO templates (user_id, name, category, subject, sections) VALUES (?, ?, ?, ?, ?)',
      [user_id || 1, name, category, subject, sectionsJson]
    );

    res.status(201).json({ id: result.insertId, message: 'Template created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a template
// @route   PUT /api/templates/:id
exports.updateTemplate = async (req, res) => {
  try {
    const { name, category, subject, sections } = req.body;
    const templateId = req.params.id;

    const sectionsJson = JSON.stringify(sections);

    await db.query(
      'UPDATE templates SET name=?, category=?, subject=?, sections=? WHERE id=?',
      [name, category, subject, sectionsJson, templateId]
    );

    res.status(200).json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a template
// @route   DELETE /api/templates/:id
exports.deleteTemplate = async (req, res) => {
  try {
    await db.query('DELETE FROM templates WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};