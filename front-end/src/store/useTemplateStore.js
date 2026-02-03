// Zustand store for managing email templates
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/api';
import { DEFAULT_SECTIONS } from '../constants/templates';

const useTemplateStore = create(
  devtools(
    (set, get) => ({
      // State
      templates: [],
      activeId: null,
      activeTemplate: null, // We now store the full active template separately
      view: 'dashboard', 
      isSaved: true,
      editorTab: 'structure',
      selectedSectionId: null,
      showMockData: false,
      isLoading: false, // UI loading state
      error: null,

      // --- ASYNC ACTIONS (API Calls) ---

      // 1. Fetch all templates for Dashboard
      fetchTemplates: async () => {
        set({ isLoading: true });
        try {
          const data = await api.getAllTemplates();
          set({ templates: data, isLoading: false });
        } catch (err) {
          console.error(err);
          set({ error: 'Failed to load templates', isLoading: false });
        }
      },

      // 2. Load a specific template for Editor
      loadTemplate: async (id) => {
        set({ isLoading: true, activeId: id, view: 'editor' });
        try {
          const data = await api.getTemplateById(id);
          // MySQL might return 'sections' as a string if not configured perfectly, 
          // so we double check parsing here just in case.
          if (typeof data.sections === 'string') {
             data.sections = JSON.parse(data.sections);
          }
          set({ activeTemplate: data, isLoading: false, isSaved: true });
        } catch (err) {
          console.error(err);
          set({ error: 'Failed to load template', isLoading: false });
        }
      },

      // 3. Create new template
      createNewTemplate: async () => {
        set({ isLoading: true });
        try {
          const newTemplate = {
            user_id: 1, // Hardcoded for now
            name: 'Untitled Template',
            category: 'Other',
            subject: 'New Subject',
            sections: DEFAULT_SECTIONS,
          };
          
          const result = await api.createTemplate(newTemplate);
          
          // Refresh list and open editor
          await get().fetchTemplates();
          await get().loadTemplate(result.id);
        } catch (err) {
          set({ error: 'Failed to create template', isLoading: false });
        }
      },

      // 4. Save the current template to DB
      saveTemplate: async () => {
        const { activeTemplate } = get();
        if (!activeTemplate) return;

        set({ isSaved: false }); // Show saving spinner if you have one
        try {
          await api.updateTemplate(activeTemplate.id, {
            name: activeTemplate.name,
            category: activeTemplate.category,
            subject: activeTemplate.subject,
            sections: activeTemplate.sections,
          });
          set({ isSaved: true });
        } catch (err) {
          console.error(err);
          set({ error: 'Failed to save', isSaved: false });
        }
      },

      // --- LOCAL STATE ACTIONS (Editor manipulations) ---
      
      setView: (view) => set({ view }),
      
      setEditorTab: (tab) => set({ editorTab: tab }),
      
      setSelectedSectionId: (id) => set({ selectedSectionId: id }),
      
      toggleMockData: () => set((state) => ({ showMockData: !state.showMockData })),

      // Helper to get active template (now returns the state variable)
      getActiveTemplate: () => get().activeTemplate,

      // Helper to get active section
      getActiveSection: () => {
        const state = get();
        return state.selectedSectionId && state.activeTemplate
          ? state.activeTemplate.sections.find((s) => s.id === state.selectedSectionId)
          : null;
      },

      // Local Update: Name/Subject (Wait for save button to persist)
      updateTemplateInfo: (key, value) =>
        set((state) => ({
          activeTemplate: { ...state.activeTemplate, [key]: value },
          isSaved: false,
        })),

      // Local Update: Add Section
      addSection: (newSection) =>
        set((state) => {
          if (!state.activeTemplate) return {};
          return {
            activeTemplate: {
              ...state.activeTemplate,
              sections: [...state.activeTemplate.sections, newSection],
            },
            selectedSectionId: newSection.id,
            editorTab: 'settings',
            isSaved: false,
          };
        }),

      // Local Update: Modify Section
      updateSection: (id, field, key, value) =>
        set((state) => {
            const sections = state.activeTemplate.sections.map((s) => {
            if (s.id !== id) return s;
            return { ...s, [field]: { ...s[field], [key]: value } };
            });
            return {
                activeTemplate: { ...state.activeTemplate, sections },
                isSaved: false,
            };
        }),

      // Local Update: Delete Section
      deleteSection: (id) =>
        set((state) => ({
          activeTemplate: {
            ...state.activeTemplate,
            sections: state.activeTemplate.sections.filter((s) => s.id !== id),
          },
          selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
          isSaved: false,
        })),

      // Local Update: Move Section
      moveSection: (index, direction) =>
        set((state) => {
          const sections = [...state.activeTemplate.sections];
          if (direction === -1 && index === 0) return {};
          if (direction === 1 && index === sections.length - 1) return {};

          const temp = sections[index];
          sections[index] = sections[index + direction];
          sections[index + direction] = temp;

          return {
            activeTemplate: { ...state.activeTemplate, sections },
            isSaved: false,
          };
        }),
    }),
    { name: 'TemplateStore' }
  )
);

export default useTemplateStore;