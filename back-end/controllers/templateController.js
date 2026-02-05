import db from '../config/db.js';

// @desc    Get Templates (Returns "My Projects" + "Community Projects")
// @route   GET /api/templates
export const getTemplates = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 0; // Current User ID

    // LOGIC:
    // 1. Get templates I OWN (user_id = me) -> "My Projects"
    // 2. Get templates that are PUBLIC (is_public = 1) -> "Community"
    const [rows] = await db.query(
      `SELECT * FROM templates 
       WHERE user_id = ? OR is_public = 1 
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Single Template
// @route   GET /api/templates/:id
export const getTemplate = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Security Check: If private and not mine, block access
    const template = rows[0];
    const userId = req.user ? req.user.id : 0;

    if (!template.is_public && template.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this private template' });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create Template
// @route   POST /api/templates
export const createTemplate = async (req, res) => {
  try {
    // We now accept 'is_public' and 'description' from the frontend
    const { name, category, subject, sections, is_public, description } = req.body;
    const userId = req.user.id;
    
    // Ensure sections is a string
    const sectionsJson = typeof sections === 'string' ? sections : JSON.stringify(sections || []);

    const [result] = await db.query(
      `INSERT INTO templates 
      (user_id, name, category, subject, sections, is_public, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        name, 
        category, 
        subject, 
        sectionsJson, 
        is_public ? 1 : 0,  // Default to 0 (Private) if undefined
        description || ''
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Template created successfully' });
  } catch (error) {
    console.error("❌ Create Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update Template (The "Forking" Logic)
// @route   PUT /api/templates/:id
export const updateTemplate = async (req, res) => {
  try {
    const { name, category, subject, sections, is_public, description } = req.body;
    const templateId = req.params.id;
    const userId = req.user.id;

    // 1. Fetch the EXISTING template to check ownership
    const [existing] = await db.query('SELECT * FROM templates WHERE id = ?', [templateId]);
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const original = existing[0];
    const sectionsJson = typeof sections === 'string' ? sections : JSON.stringify(sections || []);

    // --- SCENARIO A: I OWN IT (Normal Update) ---
    if (original.user_id === userId) {
      await db.query(
        `UPDATE templates 
         SET name=?, category=?, subject=?, sections=?, is_public=?, description=?, updated_at=NOW()
         WHERE id=?`,
        [name, category, subject, sectionsJson, is_public, description, templateId]
      );
      return res.status(200).json({ id: templateId, message: 'Template updated' });
    }

    // --- SCENARIO B: SOMEONE ELSE OWNS IT (Fork/Copy) ---
    // Instead of updating, we INSERT a new "Private Copy" for ME.
    else {
      console.log(`🔀 Forking template ${templateId} for User ${userId}`);
      
      const [result] = await db.query(
        `INSERT INTO templates 
        (user_id, name, category, subject, sections, is_public, description, forked_from) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId, 
            name, // Keep name or add "Copy of..." if you prefer
            category, 
            subject, 
            sectionsJson, 
            0, // FORCE PRIVATE (Safety)
            description,
            templateId // Track origin
        ]
      );

      // Return the NEW ID so frontend can redirect
      return res.status(201).json({ 
        id: result.insertId, 
        message: 'Template forked! Saved as a private copy.',
        newId: result.insertId 
      });
    }

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete Template
// @route   DELETE /api/templates/:id
export const deleteTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Only allow deleting if I OWN it
    const [result] = await db.query(
      'DELETE FROM templates WHERE id = ? AND user_id = ?', 
      [req.params.id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this template' });
    }

    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Categories (Global + My Custom)
// @route   GET /api/templates/categories
export const getAllCategories = async (req, res) => {
  try {
    // Just get ALL categories used in the system
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM templates WHERE category IS NOT NULL AND category != ""'
    );
    
    const categories = rows.map(row => row.category);
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Category Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};