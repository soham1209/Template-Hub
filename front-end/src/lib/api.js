// front-end/src/lib/api.js
import axios from 'axios';

// Ensure this matches your backend port
const API_URL = 'http://localhost:5000/api';

export const api = {
  // Get all templates for the dashboard
  getAllTemplates: async (userId = 1) => {
    const response = await axios.get(`${API_URL}/templates?userId=${userId}`);
    return response.data;
  },

  // Get a single full template
  getTemplateById: async (id) => {
    const response = await axios.get(`${API_URL}/templates/${id}`);
    return response.data;
  },

  // Create a new template
  createTemplate: async (templateData) => {
    const response = await axios.post(`${API_URL}/templates`, templateData);
    return response.data;
  },

  // Save/Update a template
  updateTemplate: async (id, templateData) => {
    const response = await axios.put(`${API_URL}/templates/${id}`, templateData);
    return response.data;
  },

  // Send an email using a template
  sendEmail: async (templateId, recipientEmail) => {
  const response = await axios.post(`${API_URL}/email/send`, {
    templateId,
    recipientEmail
  });
  return response.data;
},

  // Delete a template
  deleteTemplate: async (id) => {
    const response = await axios.delete(`${API_URL}/templates/${id}`);
    return response.data;
  }
};