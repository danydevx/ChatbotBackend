<template>
  <div class="question-editor card h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5>Editar pregunta</h5>
      <button class="btn btn-sm btn-outline-secondary" @click="deselectQuestion">
        <i class="bi bi-x"></i> Cerrar
      </button>
    </div>
    <div class="card-body">
      <form @submit.prevent="updateCurrentQuestion">
        <!-- Campos básicos -->
        <div class="mb-3">
          <label class="form-label">Tipo de campo</label>
          <select v-model="editableQuestion.type" class="form-select" required>
            <option v-for="type in fieldTypes" :value="type.value" :key="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Texto de la pregunta</label>
          <input 
            v-model="editableQuestion.text" 
            type="text" 
            class="form-control" 
            required
          >
        </div>
        
        <div class="mb-3">
          <label class="form-label">Key (identificador)</label>
          <input 
            v-model="editableQuestion.key" 
            type="text" 
            class="form-control" 
            required
            pattern="[a-zA-Z0-9_]+"
            title="Solo letras, números y guiones bajos"
          >
        </div>
        
        <!-- Campos específicos por tipo -->
        <template v-if="editableQuestion.type === 'text' || editableQuestion.type === 'textarea'">
          <div class="mb-3">
            <label class="form-label">Placeholder</label>
            <input 
              v-model="editableQuestion.placeholder" 
              type="text" 
              class="form-control"
            >
          </div>
          
          <div class="mb-3">
            <label class="form-label">Valor por defecto</label>
            <input 
              v-model="editableQuestion.defaultValue" 
              type="text" 
              class="form-control"
            >
          </div>
        </template>
        
        <div v-if="editableQuestion.type === 'text'" class="row mb-3">
          <div class="col">
            <label class="form-label">Longitud mínima</label>
            <input 
              v-model.number="editableQuestion.min" 
              type="number" 
              class="form-control"
              min="0"
            >
          </div>
          <div class="col">
            <label class="form-label">Longitud máxima</label>
            <input 
              v-model.number="editableQuestion.max" 
              type="number" 
              class="form-control"
              min="1"
            >
          </div>
        </div>
        
        <!-- Campos para opciones -->
        <div v-if="editableQuestion.type === 'options' || editableQuestion.type === 'multi-options' || editableQuestion.type === 'select'" class="mb-3">
          <label class="form-label">Opciones</label>
          <div v-for="(option, index) in editableQuestion.options" :key="index" class="input-group mb-2">
            <input 
              v-model="option.value" 
              type="text" 
              class="form-control" 
              placeholder="Valor"
              required
            >
            <input 
              v-model="option.label" 
              type="text" 
              class="form-control" 
              placeholder="Etiqueta"
              required
            >
            <button class="btn btn-outline-danger" type="button" @click="removeOption(index)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button class="btn btn-sm btn-outline-primary" type="button" @click="addOption">
            <i class="bi bi-plus"></i> Añadir opción
          </button>
        </div>
        
        <!-- Campos para rangos -->
        <div v-if="editableQuestion.type === 'range' || editableQuestion.type === 'steps'" class="row mb-3">
          <div class="col">
            <label class="form-label">Mínimo</label>
            <input 
              v-model.number="editableQuestion.min" 
              type="number" 
              class="form-control"
            >
          </div>
          <div class="col">
            <label class="form-label">Máximo</label>
            <input 
              v-model.number="editableQuestion.max" 
              type="number" 
              class="form-control"
            >
          </div>
          <div class="col" v-if="editableQuestion.type === 'range'">
            <label class="form-label">Valor por defecto</label>
            <input 
              v-model.number="editableQuestion.defaultValue" 
              type="number" 
              class="form-control"
              :min="editableQuestion.min"
              :max="editableQuestion.max"
            >
          </div>
        </div>
        
        <!-- Campos para fecha -->
        <div v-if="editableQuestion.type === 'date'" class="mb-3">
          <label class="form-label">Fecha mínima</label>
          <input 
            v-model="editableQuestion.minDate" 
            type="date" 
            class="form-control"
          >
          
          <label class="form-label mt-2">Fecha máxima</label>
          <input 
            v-model="editableQuestion.maxDate" 
            type="date" 
            class="form-control"
          >
          
          <label class="form-label mt-2">Valor por defecto</label>
          <input 
            v-model="editableQuestion.defaultValue" 
            type="date" 
            class="form-control"
          >
        </div>
        
        <!-- Campos comunes -->
        <div class="mb-3">
          <label class="form-label">Texto de ayuda</label>
          <textarea 
            v-model="editableQuestion.helpText" 
            class="form-control" 
            rows="2"
          ></textarea>
        </div>
        
        <div class="mb-3 form-check">
          <input 
            v-model="editableQuestion.required" 
            type="checkbox" 
            class="form-check-input"
          >
          <label class="form-check-label">¿Es requerido?</label>
        </div>
        
        <button type="submit" class="btn btn-primary me-2">Guardar cambios</button>
        <button type="button" class="btn btn-outline-danger" @click="deleteQuestion">
          Eliminar pregunta
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';

export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useFormBuilderStore();
    const fieldTypes = store.fieldTypes;
    
    const editableQuestion = ref({ ...props.question });
    
    watch(() => props.question, (newQuestion) => {
      editableQuestion.value = { ...newQuestion };
    });
    
    const updateCurrentQuestion = () => {
      store.updateQuestion(editableQuestion.value.id, editableQuestion.value);
    };
    
    const deselectQuestion = () => {
      store.questions.forEach(q => {
        q.isSelected = false;
      });
    };
    
    const deleteQuestion = () => {
      if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
        store.removeQuestion(editableQuestion.value.id);
        deselectQuestion();
      }
    };
    
    const addOption = () => {
      if (!editableQuestion.value.options) {
        editableQuestion.value.options = [];
      }
      editableQuestion.value.options.push({ value: '', label: '' });
    };
    
    const removeOption = (index) => {
      editableQuestion.value.options.splice(index, 1);
    };
    
    return {
      fieldTypes,
      editableQuestion,
      updateCurrentQuestion,
      deselectQuestion,
      deleteQuestion,
      addOption,
      removeOption
    };
  }
};
</script>

<style lang="less">
.question-editor {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  
  .card-header {
    background-color: #f8f9fa;
    h5 {
      font-weight: 600;
    }
  }
  
  .form-label {
    font-weight: 500;
    color: #495057;
  }
  
  .input-group {
    transition: all 0.2s;
    
    &:hover {
      transform: translateX(2px);
    }
  }
  
  .btn-outline-danger {
    &:hover {
      color: white !important;
    }
  }
}
</style>