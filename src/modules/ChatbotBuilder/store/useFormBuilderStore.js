import { defineStore } from 'pinia';
import apiService from '@/modules/ChatbotBuilder/services/apiService';
import { useToast } from 'vue-toastification';

export const useFormBuilderStore = defineStore('formBuilder', {
  state: () => ({
    questions: JSON.parse(localStorage.getItem('formBuilderQuestions')) || [],
    fieldTypes: [
      { value: 'text', label: 'Texto' },
      { value: 'date', label: 'Fecha' },
      { value: 'email', label: 'Email' },
      { value: 'map', label: 'Mapa' },
      { value: 'steps', label: 'Número (pasos)' },
      { value: 'options', label: 'Opción única' },
      { value: 'multi-options', label: 'Opción múltiple' },
      { value: 'phone', label: 'Teléfono' },
      { value: 'range', label: 'Rango' },
      { value: 'select', label: 'Select' },
      { value: 'textarea', label: 'Área de texto' },
      { value: 'time', label: 'Hora' },
      { value: 'timeHour', label: 'Hora exacta' },
      { value: 'url', label: 'URL' }
    ],
    currentFileName: localStorage.getItem('formBuilderFileName') || 'form-config.json',
    isLoading: false,       // Para operaciones locales
    apiLoading: false,      // Para operaciones de API
    currentOperation: null, // Para mensajes contextuales
    lastError: null         // Para manejo de errores
  }),
  
  actions: {
    // ========== Operaciones Locales ==========
    addQuestion(question) {
      const newQuestion = {
        id: Date.now(),
        order: this.questions.length + 1,
        ...question,
        value: question.defaultValue || ''
      };
      this.questions.push(newQuestion);
      this.persistToLocalStorage();
      return newQuestion;
    },
    
    updateQuestion(id, updates) {
      const index = this.questions.findIndex(q => q.id === id);
      if (index !== -1) {
        this.questions[index] = { ...this.questions[index], ...updates };
        this.persistToLocalStorage();
      }
    },
    
    removeQuestion(id) {
      this.questions = this.questions.filter(q => q.id !== id);
      this.questions.forEach((q, i) => {
        q.order = i + 1;
      });
      this.persistToLocalStorage();
    },
    
    reorderQuestions(newOrder) {
      this.questions = newOrder.map((id, index) => {
        const question = this.questions.find(q => q.id === id);
        return { ...question, order: index + 1 };
      });
      this.persistToLocalStorage();
    },
    
    persistToLocalStorage() {
      localStorage.setItem('formBuilderQuestions', JSON.stringify(this.questions));
      localStorage.setItem('formBuilderFileName', this.currentFileName);
    },
    
    resetForm() {
      this.questions = [];
      this.persistToLocalStorage();
    },
    
    setFileName(name) {
      this.currentFileName = name.endsWith('.json') ? name : `${name}.json`;
      this.persistToLocalStorage();
    },

    // ========== Operaciones de API ==========
    async saveFormToDatabase(formData) {
      this.startApiOperation('save');
      try {
        const response = await apiService.saveForm(formData);
        useToast().success('Formulario guardado exitosamente');
        return response;
      } catch (error) {
        this.handleApiError(error, 'No se pudo guardar el formulario');
        throw error;
      } finally {
        this.endApiOperation();
      }
    },
    
    async loadFormFromDatabase(formId) {
      this.startApiOperation('load');
      try {
        const formData = await apiService.getForm(formId);
        this.importFromJson(formData.config);
        useToast().success('Formulario cargado exitosamente');
        return true;
      } catch (error) {
        this.handleApiError(error, 'No se pudo cargar el formulario');
        return false;
      } finally {
        this.endApiOperation();
      }
    },

    async updateFormInDatabase(formId, formData) {
      this.startApiOperation('update');
      try {
        const response = await apiService.updateForm(formId, formData);
        useToast().success('Formulario actualizado exitosamente');
        return response;
      } catch (error) {
        this.handleApiError(error, 'No se pudo actualizar el formulario');
        throw error;
      } finally {
        this.endApiOperation();
      }
    },

    async fetchAllForms() {
      this.startApiOperation('fetch');
      try {
        const forms = await apiService.getAllForms();
        return forms;
      } catch (error) {
        this.handleApiError(error, 'No se pudo obtener la lista de formularios');
        throw error;
      } finally {
        this.endApiOperation();
      }
    },
    
    async deleteFormFromDatabase(formId) {
      this.startApiOperation('delete');
      try {
        await apiService.deleteForm(formId);
        useToast().success('Formulario eliminado exitosamente');
        return true;
      } catch (error) {
        this.handleApiError(error, 'No se pudo eliminar el formulario');
        throw error;
      } finally {
        this.endApiOperation();
      }
    },

    // ========== Helpers ==========
    importFromJson(jsonData) {
      try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        if (data.questions && Array.isArray(data.questions)) {
          this.questions = data.questions;
          this.persistToLocalStorage();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error importing JSON:', error);
        return false;
      }
    },

    startApiOperation(operation) {
      this.apiLoading = true;
      this.currentOperation = operation;
      this.lastError = null;
    },

    endApiOperation() {
      this.apiLoading = false;
      this.currentOperation = null;
    },

    handleApiError(error, defaultMessage) {
      const toast = useToast();
      this.lastError = error;
      
      const errorMessage = error.details?.message || error.message || defaultMessage;
      toast.error(errorMessage);
      
      console.error(`[Store Error] ${defaultMessage}:`, error);
      return error;
    },

    // ========== Exportadores ==========   // 
    exportToJs() { 
      const data = {
        version: '1.0',
        createdAt: new Date().toISOString(),
        questions: this.questions
      };
      
      const jsString = `const FORM_QUESTIONS = ${JSON.stringify(data, null, 2)};\n\nexport default FORM_QUESTIONS;`;
      
      return {
        data,
        jsString,
        fileName: this.currentFileName.replace('.json', '.js')
      };
    },
    
    exportToJson() {
      const result = this.exportToJs();
      return {
        ...result,
        jsonString: JSON.stringify(result.data, null, 2),
        fileName: this.currentFileName
      };
    }
  },
  
  getters: {
    sortedQuestions: (state) => {
      return [...state.questions].sort((a, b) => a.order - b.order);
    },
    hasQuestions: (state) => {
      return state.questions.length > 0;
    },
    loadingMessage: (state) => {
      const messages = {
        save: 'Guardando ...',
        load: 'Cargando ...',
        update: 'Actualizando ...',
        fetch: 'Obteniendo ...',
        delete: 'Eliminando ...'
      };
      return messages[state.currentOperation] || 'Procesando solicitud...';
    },
    currentFormData: (state) => {
      return {
        name: state.currentFileName.replace('.json', ''),
        config: {
          version: '1.0',
          questions: state.questions
        }
      };
    },
    hasUnsavedChanges: (state) => {
      const savedQuestions = JSON.parse(localStorage.getItem('formBuilderQuestions')) || [];
      return JSON.stringify(state.questions) !== JSON.stringify(savedQuestions);
    }

  }
});