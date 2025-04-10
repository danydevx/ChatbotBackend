<template>
  <div class="question-creator card h-100 border-0 shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 class="mb-0 d-flex align-items-center">
        <i class="bi bi-plus-circle-fill text-primary me-2"></i>
        <span>Nueva Pregunta</span>
      </h5>
      <span class="badge bg-primary rounded-pill">
        Paso 1 de 3
      </span>
    </div>
    
    <div class="card-body">
      <form @submit.prevent="createQuestion" class="needs-validation" novalidate>
        <!-- Tipo de Campo -->
        <div class="mb-4">
          <label class="form-label fw-semibold d-flex align-items-center">
            <i class="bi bi-tag text-muted me-2"></i>
            Tipo de Campo
          </label>
          <select 
            v-model="newQuestion.type" 
            class="form-select form-select-lg"
            required
            @change="handleTypeChange"
          >
            <option value="" disabled selected>Seleccione un tipo...</option>
            <option 
              v-for="type in fieldTypes" 
              :value="type.value" 
              :key="type.value"
              :data-icon="type.icon"
            >
              {{ type.label }}
            </option>
          </select>
          <div class="form-text mt-1">
            <i class="bi bi-info-circle me-1"></i>
            Seleccione el tipo de respuesta esperada
          </div>
        </div>
        
        <!-- Texto de la Pregunta -->
        <div class="mb-4">
          <label class="form-label fw-semibold d-flex align-items-center">
            <i class="bi bi-chat-square-text text-muted me-2"></i>
            Texto de la pregunta
          </label>
          <input 
            v-model="newQuestion.text" 
            type="text" 
            class="form-control form-control-lg" 
            placeholder="Ej: ¿Cuál es tu nombre completo?"
            required
          >
          <div class="invalid-feedback">
            Por favor ingrese el texto de la pregunta
          </div>
        </div>
        
        <!-- Identificador (Key) -->
        <div class="mb-4">
          <label class="form-label fw-semibold d-flex align-items-center">
            <i class="bi bi-key text-muted me-2"></i>
            Identificador (Key)
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-hash"></i>
            </span>
            <input 
              v-model="newQuestion.key" 
              type="text" 
              class="form-control form-control-lg" 
              placeholder="Ej: nombre_completo"
              pattern="[a-zA-Z0-9_]+"
              title="Solo letras, números y guiones bajos"
              required
            >
          </div>
          <div class="form-text mt-1">
            <i class="bi bi-exclamation-triangle me-1"></i>
            Solo letras, números y guiones bajos (sin espacios)
          </div>
        </div>
        
        <!-- Campo Requerido -->
        <div class="mb-4 form-switch">
          <input 
            v-model="newQuestion.required" 
            type="checkbox" 
            class="form-check-input"
            id="requiredSwitch"
            role="switch"
          >
          <label class="form-check-label fw-semibold" for="requiredSwitch">
            <i class="bi bi-asterisk text-danger me-1"></i>
            ¿Es requerido?
          </label>
          <div class="form-text mt-1">
            <i class="bi bi-question-circle me-1"></i>
            Marque si la pregunta es obligatoria
          </div>
        </div>
        
        <!-- Botón de Acción -->
        <div class="d-grid gap-2 mt-4">
          <button 
            type="submit" 
            class="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
             
          >
            <i class="bi bi-check-circle-fill me-2"></i>
            <span>Crear Pregunta</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';

export default {
  setup() {
    const store = useFormBuilderStore();
    const fieldTypes = store.fieldTypes;
    
    const newQuestion = ref({
      type: '',
      text: '',
      key: '',
      required: false,
      defaultValue: '',
      placeholder: '',
      helpText: ''
    });

    // Validación del formulario
    const isFormValid = computed(() => {
      return (
        newQuestion.value.type && 
        newQuestion.value.text.trim() && 
        newQuestion.value.key.match(/^[a-zA-Z0-9_]+$/)
      );
    });

    const handleTypeChange = () => {
      // Resetear valores específicos cuando cambia el tipo
      newQuestion.value.defaultValue = '';
      newQuestion.value.placeholder = '';
    };

    const createQuestion = (event) => {
      const form = event.target;
      
      // Validación nativa del formulario
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Validación adicional
      if (!isFormValid.value) {
        return;
      }

      // Crear la pregunta en el store
      store.addQuestion({...newQuestion.value});
      
      // Resetear el formulario
      newQuestion.value = {
        type: '',
        text: '',
        key: '',
        required: false,
        defaultValue: '',
        placeholder: '',
        helpText: ''
      };
      
      // Resetear validación visual
      form.classList.remove('was-validated');
    };
    
    return {
      fieldTypes,
      newQuestion,
      isFormValid,
      createQuestion,
      handleTypeChange
    };
  }
};
</script>

<style lang="less">
.question-creator {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  
  .card-header {
    h5 {
      font-weight: 600;
    }
  }
  
  .form-label {
    font-weight: 500;
    color: #495057;
  }
  
  .form-control, .form-select {
    &:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
  }
  
  .btn-primary {
    padding: 0.375rem 1.5rem;
  }
}
</style>