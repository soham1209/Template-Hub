const API_URL = 'http://localhost:5000/api';

// Helper to get token from storage
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Get all templates (My + Community)
  getTemplates: async () => {
    const res = await fetch(`${API_URL}/templates`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  // Get a single template
  getTemplate: async (id) => {
    const res = await fetch(`${API_URL}/templates/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
  },

  // Create a new template
  createTemplate: async (templateData) => {
    const res = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(templateData),
    });
    if (!res.ok) throw new Error('Failed to create template');
    return res.json();
  },

  // Save/Update a template (Handles Forking too)
  saveTemplate: async (id, data) => {
    const res = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save template');
    return res.json();
  },

  // Delete Template
  deleteTemplate: async (id) => {
    const res = await fetch(`${API_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete template');
    return res.json();
  },

  // Send Test Email
  sendEmail: async (id, recipient) => {
    const res = await fetch(`${API_URL}/email/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ templateId: id, recipient }),
    });
    if (!res.ok) throw new Error('Failed to send email');
    return res.json();
  },
  
  // Get all categories
  getCategories: async () => {
    const res = await fetch(`${API_URL}/templates/categories`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }
};