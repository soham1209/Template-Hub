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
      activeTemplate: null,
      view: 'dashboard', 
      isSaved: true,
      editorTab: 'structure',
      selectedSectionId: null,
      showMockData: false,
      isLoading: false,
      error: null,

      // --- ASYNC ACTIONS (API Calls) ---

      // 1. Fetch all templates
      fetchTemplates: async () => {
        set({ isLoading: true });
        try {
          const data = await api.getTemplates();
          set({ templates: data, isLoading: false });
        } catch (err) {
          console.error(err);
          set({ error: 'Failed to load templates', isLoading: false });
        }
      },

      // 2. Load a specific template
      loadTemplate: async (id) => {
        set({ isLoading: true, activeId: id, view: 'editor' });
        try {
          const data = await api.getTemplate(id);
          // Parse sections if they come as a string
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
            name: 'Untitled Template',
            category: 'Other',
            subject: 'New Subject',
            sections: DEFAULT_SECTIONS,
            is_public: 0, // Default to private
          };
          
          const result = await api.createTemplate(newTemplate);
          
          // Refresh list and open editor
          await get().fetchTemplates();
          set({ activeId: result.id }); // Set the ID so Dashboard can navigate
        } catch (err) {
          set({ error: 'Failed to create template', isLoading: false });
        }
      },

      // 4. Save Template (Updated for Forking Logic)
      saveTemplate: async () => {
        const { activeTemplate } = get();
        if (!activeTemplate) return;

        set({ isSaved: false });
        try {
          // Send all fields including is_public and description
          const result = await api.saveTemplate(activeTemplate.id, {
            name: activeTemplate.name,
            category: activeTemplate.category,
            subject: activeTemplate.subject,
            sections: activeTemplate.sections,
            is_public: activeTemplate.is_public, 
            description: activeTemplate.description
          });

          set({ isSaved: true });

          // IMPORTANT: Return the result! 
          // If the backend created a copy (Fork), EditorHeader needs this 'result' to redirect.
          return result; 

        } catch (err) {
          console.error(err);
          set({ error: 'Failed to save', isSaved: false });
        }
      },

      // 5. Delete Template (THIS WAS MISSING!)
      deleteTemplate: async (id) => {
        set({ isLoading: true });
        try {
            await api.deleteTemplate(id);
            // Optimistically remove from UI
            set((state) => ({
                templates: state.templates.filter((t) => t.id !== id),
                isLoading: false
            }));
        } catch (err) {
            console.error(err);
            set({ error: 'Failed to delete template', isLoading: false });
        }
      },

      // --- LOCAL STATE ACTIONS ---
      reorderSection: (fromIndex, toIndex) =>
        set((state) => {
          const sections = [...state.activeTemplate.sections];
          const [movedItem] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, movedItem);
          return { activeTemplate: { ...state.activeTemplate, sections }, isSaved: false };
        }),

      setView: (view) => set({ view }),
      setEditorTab: (tab) => set({ editorTab: tab }),
      setSelectedSectionId: (id) => set({ selectedSectionId: id }),
      toggleMockData: () => set((state) => ({ showMockData: !state.showMockData })),
      getActiveTemplate: () => get().activeTemplate,

      getActiveSection: () => {
        const state = get();
        return state.selectedSectionId && state.activeTemplate
          ? state.activeTemplate.sections.find((s) => s.id === state.selectedSectionId)
          : null;
      },

      updateTemplateInfo: (key, value) =>
        set((state) => ({
          activeTemplate: { ...state.activeTemplate, [key]: value },
          isSaved: false,
        })),

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

      updateSection: (id, field, key, value) =>
        set((state) => {
            const sections = state.activeTemplate.sections.map((s) => {
            if (s.id !== id) return s;
            return { ...s, [field]: { ...s[field], [key]: value } };
            });
            return { activeTemplate: { ...state.activeTemplate, sections }, isSaved: false };
        }),

      deleteSection: (id) =>
        set((state) => ({
          activeTemplate: {
            ...state.activeTemplate,
            sections: state.activeTemplate.sections.filter((s) => s.id !== id),
          },
          selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
          isSaved: false,
        })),

      moveSection: (index, direction) =>
        set((state) => {
          const sections = [...state.activeTemplate.sections];
          if (direction === -1 && index === 0) return {};
          if (direction === 1 && index === sections.length - 1) return {};

          const temp = sections[index];
          sections[index] = sections[index + direction];
          sections[index + direction] = temp;
          return { activeTemplate: { ...state.activeTemplate, sections }, isSaved: false };
        }),
    }),
    { name: 'TemplateStore' }
  )
);

export default useTemplateStore;