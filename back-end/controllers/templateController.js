const db = require('../config/db');

// @desc    Get ALL templates (Public Mode - Everyone sees everything)
// @route   GET /api/templates
exports.getTemplates = async (req, res) => {
  try {
    // REMOVED 'WHERE user_id = ?'
    // Now selecting all templates from the database
    const [rows] = await db.query(
      'SELECT id, name, category, subject, updated_at, user_id FROM templates ORDER BY updated_at DESC'
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
    const { name, category, subject, sections } = req.body;
    
    // Use the logged-in user's ID if available, otherwise default to 1
    const userId = req.user ? req.user.id : 1;
    
    const sectionsJson = JSON.stringify(sections || []); 

    const [result] = await db.query(
      'INSERT INTO templates (user_id, name, category, subject, sections) VALUES (?, ?, ?, ?, ?)',
      [userId, name, category, subject, sectionsJson]
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

// @desc    Get ALL unique categories (Global Search)
// @route   GET /api/templates/categories
exports.getAllCategories = async (req, res) => {
  try {
    console.log("🔍 Fetching ALL categories (Global Mode)");

    // REMOVED 'WHERE user_id = ?'
    // Now searching the entire table for unique categories
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM templates WHERE category IS NOT NULL AND category != ""'
    );
    
    const categories = rows.map(row => row.category);
    
    console.log("✅ Found global categories:", categories);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};