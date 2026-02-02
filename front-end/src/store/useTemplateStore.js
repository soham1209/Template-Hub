import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { INITIAL_TEMPLATES } from '../constants/templates';

/**
 * Zustand store for managing email templates
 */
const useTemplateStore = create(
  devtools(
    (set, get) => ({
      // State
      templates: INITIAL_TEMPLATES,
      activeId: INITIAL_TEMPLATES[0].id,
      view: 'dashboard', // 'dashboard' | 'editor'
      isSaved: true,
      editorTab: 'structure', // 'structure' | 'settings'
      selectedSectionId: null,
      showMockData: false,

      // Getters
      getActiveTemplate: () => {
        const state = get();
        return state.templates.find((t) => t.id === state.activeId) || state.templates[0];
      },

      getActiveSection: () => {
        const state = get();
        const template = state.getActiveTemplate();
        return state.selectedSectionId
          ? template?.sections.find((s) => s.id === state.selectedSectionId)
          : null;
      },

      // Actions
      setActiveId: (id) => set({ activeId: id }),

      setView: (view) => set({ view }),

      setEditorTab: (tab) => set({ editorTab: tab }),

      setSelectedSectionId: (id) => set({ selectedSectionId: id }),

      toggleMockData: () => set((state) => ({ showMockData: !state.showMockData })),

      updateTemplateInfo: (key, value) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === state.activeId ? { ...t, [key]: value, lastModified: 'Just now' } : t
          ),
          isSaved: false,
        })),

      addSection: (newSection) =>
        set((state) => {
          const template = state.getActiveTemplate();
          const updatedSections = [...template.sections, newSection];
          return {
            templates: state.templates.map((t) =>
              t.id === state.activeId
                ? { ...t, sections: updatedSections, lastModified: 'Just now' }
                : t
            ),
            selectedSectionId: newSection.id,
            editorTab: 'settings',
            isSaved: false,
          };
        }),

      updateSection: (id, field, key, value) =>
        set((state) => {
          const template = state.getActiveTemplate();
          const updatedSections = template.sections.map((s) => {
            if (s.id !== id) return s;
            return { ...s, [field]: { ...s[field], [key]: value } };
          });
          return {
            templates: state.templates.map((t) =>
              t.id === state.activeId
                ? { ...t, sections: updatedSections, lastModified: 'Just now' }
                : t
            ),
            isSaved: false,
          };
        }),

      deleteSection: (id) =>
        set((state) => {
          const template = state.getActiveTemplate();
          const updatedSections = template.sections.filter((s) => s.id !== id);
          return {
            templates: state.templates.map((t) =>
              t.id === state.activeId
                ? { ...t, sections: updatedSections, lastModified: 'Just now' }
                : t
            ),
            selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
            isSaved: false,
          };
        }),

      moveSection: (index, direction) =>
        set((state) => {
          const template = state.getActiveTemplate();
          if (direction === -1 && index === 0) return state;
          if (direction === 1 && index === template.sections.length - 1) return state;

          const newSections = [...template.sections];
          const temp = newSections[index];
          newSections[index] = newSections[index + direction];
          newSections[index + direction] = temp;

          return {
            templates: state.templates.map((t) =>
              t.id === state.activeId
                ? { ...t, sections: newSections, lastModified: 'Just now' }
                : t
            ),
            isSaved: false,
          };
        }),

      createNewTemplate: () =>
        set((state) => {
          const newId = `t${Date.now()}`;
          const newTemplate = {
            id: newId,
            name: 'Untitled Template',
            category: 'Other',
            subject: '',
            lastModified: 'Just now',
            sections: [],
          };
          return {
            templates: [...state.templates, newTemplate],
            activeId: newId,
            view: 'editor',
            editorTab: 'structure',
            isSaved: false,
          };
        }),

      saveTemplate: () =>
        set(() => ({
          isSaved: true,
        })),
    }),
    { name: 'TemplateStore' }
  )
);

export default useTemplateStore;
