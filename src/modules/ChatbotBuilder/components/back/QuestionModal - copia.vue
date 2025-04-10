<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <!-- Encabezado del modal -->
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title d-flex align-items-center">
            <i class="bi me-2" :class="isEditing ? 'bi-pencil-square' : 'bi-plus-circle-fill'"></i>
            {{ isEditing ? 'Editar Pregunta' : 'Nueva Pregunta' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="close" aria-label="Cerrar"></button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="submitForm" class="needs-validation" novalidate>
            <div class="row g-3">
              <!-- Sección: Configuración Básica -->
              <div class="col-md-6">
                <label class="form-label fw-semibold d-flex align-items-center">
                  <i class="bi bi-tag text-muted me-2"></i>
                  Tipo de campo
                </label>
                <select 
                  v-model="formData.type" 
                  class="form-select"
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
              </div>
              
              <div class="col-md-6">
                <label class="form-label fw-semibold d-flex align-items-center">
                  <i class="bi bi-asterisk text-muted me-2"></i>
                  Requerido
                </label>
                <div class="form-check form-switch">
                  <input 
                    v-model="formData.required" 
                    class="form-check-input" 
                    type="checkbox"
                    role="switch"
                    id="requiredSwitch"
                  >
                  <label class="form-check-label" for="requiredSwitch">
                    {{ formData.required ? 'Requerido' : 'Opcional' }}
                  </label>
                </div>
              </div>
              
              <div class="col-12">
                <label class="form-label fw-semibold d-flex align-items-center">
                  <i class="bi bi-chat-square-text text-muted me-2"></i>
                  Texto de la pregunta
                </label>
                <input 
                  v-model="formData.text" 
                  type="text" 
                  class="form-control" 
                  required
                  :placeholder="getPlaceholder('text')"
                >
                <div class="invalid-feedback">Por favor ingrese el texto de la pregunta</div>
              </div>
              
              <div class="col-12">
                <label class="form-label fw-semibold d-flex align-items-center">
                  <i class="bi bi-key text-muted me-2"></i>
                  Identificador (Key)
                </label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-hash"></i>
                  </span>
                  <input 
                    v-model="formData.key" 
                    type="text" 
                    class="form-control" 
                    required
                    pattern="[a-zA-Z0-9_]+"
                    title="Solo letras, números y guiones bajos"
                    :placeholder="getPlaceholder('key')"
                  >
                </div>
                <div class="form-text">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  Solo letras, números y guiones bajos (sin espacios)
                </div>
              </div>
              
              <!-- Campos específicos por tipo -->
              <template v-if="formData.type === 'text' || formData.type === 'textarea' || formData.type === 'email' || formData.type === 'phone' || formData.type === 'url'">
                <div class="col-md-6">
                  <label class="form-label">Placeholder</label>
                  <input 
                    v-model="formData.placeholder" 
                    type="text" 
                    class="form-control"
                    :placeholder="getPlaceholder('placeholder')"
                  >
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Valor por defecto</label>
                  <input 
                    v-model="formData.defaultValue" 
                    :type="formData.type === 'phone' ? 'tel' : formData.type === 'url' ? 'url' : 'text'" 
                    class="form-control"
                    :placeholder="getPlaceholder('defaultValue')"
                  >
                </div>
              </template>
              
              <div v-if="formData.type === 'phone'" class="col-12">
                <label class="form-label">Patrón de validación</label>
                <input 
                  v-model="formData.pattern" 
                  type="text" 
                  class="form-control"
                  placeholder="Ej: ^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$"
                >
                <div class="form-text">Expresión regular para validar el número de teléfono</div>
              </div>
              
              <div v-if="formData.type === 'text' || formData.type === 'number'" class="col-md-6">
                <label class="form-label">Longitud mínima</label>
                <input 
                  v-model.number="formData.min" 
                  type="number" 
                  class="form-control"
                  min="0"
                  :placeholder="getPlaceholder('min')"
                >
              </div>
              
              <div v-if="formData.type === 'text' || formData.type === 'number'" class="col-md-6">
                <label class="form-label">Longitud máxima</label>
                <input 
                  v-model.number="formData.max" 
                  type="number" 
                  class="form-control"
                  min="1"
                  :placeholder="getPlaceholder('max')"
                >
              </div>
              
              <!-- Opciones para campos de selección -->
              <div v-if="hasOptionsField" class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label fw-semibold">Opciones</label>
                  <button 
                    class="btn btn-sm btn-outline-primary d-flex align-items-center"
                    type="button" 
                    @click="addOption"
                  >
                    <i class="bi bi-plus-lg me-1"></i>
                    Añadir opción
                  </button>
                </div>
                
                <div v-for="(option, index) in formData.options" :key="index" class="card mb-2 shadow-none border">
                  <div class="card-body p-2">
                    <div class="row g-2">
                      <div class="col-md-5">
                        <input 
                          v-model="option.value" 
                          type="text" 
                          class="form-control form-control-sm" 
                          :placeholder="option._placeholder?.value || 'Valor'"
                          required
                        >
                      </div>
                      <div class="col-md-5">
                        <input 
                          v-model="option.label" 
                          type="text" 
                          class="form-control form-control-sm" 
                          :placeholder="option._placeholder?.label || 'Etiqueta'"
                          required
                        >
                      </div>
                      <div class="col-md-2 d-flex align-items-center">
                        <button 
                          class="btn btn-sm btn-outline-danger w-100"
                          type="button" 
                          @click="removeOption(index)"
                          title="Eliminar opción"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Campos para rangos -->
              <div v-if="formData.type === 'range'" class="col-md-4">
                <label class="form-label">Mínimo</label>
                <input 
                  v-model.number="formData.min" 
                  type="number" 
                  class="form-control"
                  :placeholder="getPlaceholder('min')"
                >
              </div>
              
              <div  v-if="formData.type === 'range'" class="col-md-4">
                <label class="form-label">Máximo</label>
                <input 
                  v-model.number="formData.max" 
                  type="number" 
                  class="form-control"
                  :placeholder="getPlaceholder('max')"
                >
              </div>
              
              <div v-if="formData.type === 'range'" class="col-md-4">
                <label class="form-label">Valor por defecto</label>
                <input 
                  v-model.number="formData.defaultValue" 
                  type="number" 
                  class="form-control"
                  :min="formData.min"
                  :max="formData.max"
                  :placeholder="getPlaceholder('defaultValue')"
                >
              </div>
              
              <!-- Campos para steps -->
              <div v-if="formData.type === 'steps'" class="col-md-3">
                <label class="form-label">Mínimo</label>
                <input 
                  v-model.number="formData.min" 
                  type="number" 
                  class="form-control"
                  placeholder="0"
                >
              </div>
              
              <div v-if="formData.type === 'steps'" class="col-md-3">
                <label class="form-label">Máximo</label>
                <input 
                  v-model.number="formData.max" 
                  type="number" 
                  class="form-control"
                  placeholder="100"
                >
              </div>
              
              <div v-if="formData.type === 'steps'" class="col-md-3">
                <label class="form-label">Paso (step)</label>
                <input 
                  v-model.number="formData.step" 
                  type="number" 
                  min="1" 
                  class="form-control"
                  placeholder="Ej: 5"
                >
              </div>
              
              <div v-if="formData.type === 'steps'" class="col-md-3">
                <label class="form-label">Valor por defecto</label>
                <input 
                  v-model.number="formData.defaultValue" 
                  type="number" 
                  class="form-control"
                  :min="formData.min"
                  :max="formData.max"
                  :step="formData.step"
                >
              </div>
              
              <!-- Campos para fecha -->
              <div v-if="formData.type === 'date'" class="col-md-4">
                <label class="form-label">Fecha mínima</label>
                <input 
                  v-model="formData.minDate" 
                  type="date" 
                  class="form-control"
                >
              </div>
              
              <div v-if="formData.type === 'date'" class="col-md-4">
                <label class="form-label">Fecha máxima</label>
                <input 
                  v-model="formData.maxDate" 
                  type="date" 
                  class="form-control"
                >
              </div>
              
              <div v-if="formData.type === 'date'" class="col-md-4">
                <label class="form-label">Valor por defecto</label>
                <input 
                  v-model="formData.defaultValue" 
                  type="date" 
                  class="form-control"
                >
              </div>
              
              <!-- Campos para time -->
              <div v-if="formData.type === 'time'" class="col-md-4">
                <label class="form-label">Hora mínima</label>
                <input 
                  v-model="formData.minTime" 
                  type="time" 
                  class="form-control"
                >
              </div>
              
              <div v-if="formData.type === 'time'" class="col-md-4">
                <label class="form-label">Hora máxima</label>
                <input 
                  v-model="formData.maxTime" 
                  type="time" 
                  class="form-control"
                >
              </div>
              
              <div v-if="formData.type === 'time'" class="col-md-4">
                <label class="form-label">Valor por defecto</label>
                <input 
                  v-model="formData.defaultValue" 
                  type="time" 
                  class="form-control"
                >
              </div>
              
              <!-- Campos para hora exacta (select) -->
              <div v-if="formData.type === 'timeHour'" class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label fw-semibold">Opciones de hora</label>
                  <button 
                    class="btn btn-sm btn-outline-primary d-flex align-items-center"
                    type="button" 
                    @click="generateTimeOptions"
                  >
                    <i class="bi bi-magic me-1"></i>
                    Generar horas
                  </button>
                </div>
                
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label">Hora inicial</label>
                    <select v-model="timeConfig.start" class="form-select">
                      <option v-for="h in 24" :value="h-1">{{ String(h-1).padStart(2, '0') }}:00</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Hora final</label>
                    <select v-model="timeConfig.end" class="form-select">
                      <option v-for="h in 24" :value="h">{{ String(h).padStart(2, '0') }}:00</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Intervalo (minutos)</label>
                    <select v-model.number="timeConfig.interval" class="form-select">
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">60 minutos</option>
                    </select>
                  </div>
                </div>
                
                <div class="mt-3">
                  <label class="form-label">Valor por defecto</label>
                  <select 
                    v-model="formData.defaultValue" 
                    class="form-select"
                  >
                    <option value="" disabled selected>Seleccione una hora</option>
                    <option 
                      v-for="option in formData.options" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
              
              <!-- Texto de ayuda -->
              <div class="col-12">
                <label class="form-label fw-semibold d-flex align-items-center">
                  <i class="bi bi-info-circle text-muted me-2"></i>
                  Texto de ayuda
                </label>
                <textarea 
                  v-model="formData.helpText" 
                  class="form-control" 
                  rows="2"
                  :placeholder="getPlaceholder('helpText')"
                ></textarea>
              </div>
            </div>
            
            <!-- Pie del modal -->
            <div class="modal-footer border-top-0">
              <button 
                type="button" 
                class="btn btn-outline-secondary d-flex align-items-center"
                @click="close"
              >
                <i class="bi bi-x-lg me-1"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-primary d-flex align-items-center"
                :disabled="!isFormValid"
              >
                <i class="bi me-1" :class="isEditing ? 'bi-save' : 'bi-check-lg'"></i>
                {{ isEditing ? 'Guardar cambios' : 'Crear pregunta' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';

const props = defineProps({
  show: Boolean,
  question: Object,
  isEditing: Boolean
});

const emit = defineEmits(['close', 'save']);

const store = useFormBuilderStore();
const fieldTypes = store.fieldTypes;

// Datos iniciales del formulario
const initialFormData = {
  type: '',
  text: '',
  key: '',
  required: false,
  placeholder: '',
  helpText: '',
  defaultValue: '',
  options: [],
  min: null,
  max: null,
  minDate: null,
  maxDate: null,
  minTime: null,
  maxTime: null,
  step: null,
  pattern: '',
  order: 0,
  value: ""
};

const timeConfig = ref({
  start: 0,
  end: 24,
  interval: 30
});

const formData = ref({...initialFormData});
const formElement = ref(null);


// Método para generar opciones de hora
const generateTimeOptions = () => {
  const options = [];
  const interval = timeConfig.value.interval;
  
  // Generar horas desde 00:00 hasta 23:00
  for (let hour = 0; hour < 12; hour++) {
    const timeValue = `${String(hour).padStart(2, '0')}:00`;
    options.push({
      value: timeValue,
      label: timeValue
    });
  }
  
  // Agregar 24:00 como última opción
  options.push({
    value: '24:00',
    label: '24:00'
  });
  
  if (formData.value.type === 'timeHour') {
    formData.value.options = options;
  }
  
  return options;
};


// Placeholders específicos por tipo de campo
const typePlaceholders = {
  text: {
    text: 'Ej: ¿Cuál es tu nombre completo?',
    key: 'nombre_completo',
    placeholder: 'Ingrese su nombre completo',
    defaultValue: 'Juan Pérez',
    min: '3 (caracteres mínimos)',
    max: '50 (caracteres máximos)',
    helpText: 'Escriba su nombre tal como aparece en su documento de identidad'
  },
  email: {
    text: 'Ej: ¿Cuál es tu correo electrónico?',
    key: 'email',
    placeholder: 'usuario@ejemplo.com',
    defaultValue: 'usuario@ejemplo.com',
    helpText: 'Ingrese un correo válido que use frecuentemente'
  },
  number: {
    text: 'Ej: ¿Cuántos años tienes?',
    key: 'edad',
    placeholder: 'Ingrese su edad',
    defaultValue: '30',
    min: '18 (edad mínima)',
    max: '99 (edad máxima)',
    helpText: 'Ingrese su edad en años cumplidos'
  },
  date: {
    text: 'Ej: ¿Cuál es tu fecha de nacimiento?',
    key: 'fecha_nacimiento',
    defaultValue: '1990-01-15',
    helpText: 'Seleccione su fecha de nacimiento'
  },
  select: {
    text: 'Ej: ¿Cuál es tu género?',
    key: 'genero',
    helpText: 'Seleccione una opción',
    options: {
      value: 'masculino',
      label: 'Masculino'
    }
  },
  checkbox: {
    text: 'Ej: ¿Aceptas los términos y condiciones?',
    key: 'acepta_terminos',
    helpText: 'Marque la casilla si está de acuerdo'
  },
  textarea: {
    text: 'Ej: ¿Cuéntanos sobre ti?',
    key: 'biografia',
    placeholder: 'Escribe algo sobre ti...',
    defaultValue: '',
    helpText: 'Comparte información relevante sobre ti'
  },
  range: {
    text: 'Ej: ¿Qué tan satisfecho estás?',
    key: 'nivel_satisfaccion',
    min: '1 (mínimo)',
    max: '10 (máximo)',
    defaultValue: '5',
    helpText: 'Seleccione un valor entre 1 y 10'
  },
  phone: {
    text: 'Ej: ¿Cuál es tu número de teléfono?',
    key: 'telefono',
    placeholder: '+1 (123) 456-7890',
    defaultValue: '',
    helpText: 'Ingrese su número de teléfono con código de país'
  },
  time: {
    text: 'Ej: ¿A qué hora prefieres la cita?',
    key: 'hora_cita',
    defaultValue: '09:00',
    minTime: '08:00',
    maxTime: '17:00',
    step: '30',
    helpText: 'Seleccione la hora para su cita'
  },
  timeHour: {
    text: 'Ej: ¿Hora exacta del evento?',
    key: 'hora_exacta',
    helpText: 'Seleccione la hora exacta del evento'
  },
  url: {
    text: 'Ej: ¿Cuál es tu sitio web?',
    key: 'sitio_web',
    placeholder: 'https://ejemplo.com',
    defaultValue: '',
    helpText: 'Ingrese una URL válida comenzando con http:// o https://'
  },
  steps: {
    text: 'Ej: ¿En una escala de 1 a 10, qué tan satisfecho estás?',
    key: 'nivel_satisfaccion',
    min: '1',
    max: '10',
    step: '1',
    defaultValue: '5',
    helpText: 'Seleccione un valor en la escala'
  }
};

// Valores por defecto específicos por tipo de campo
const typeDefaults = {
  text: {
    min: 0,
    max: 255,
    placeholder: '',
    defaultValue: ''
  },
  email: {
    placeholder: '',
    defaultValue: ''
  },
  number: {
    min: 0,
    max: 100,
    defaultValue: 0
  },
  date: {
    minDate: new Date().toISOString().split('T')[0],
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    defaultValue: new Date().toISOString().split('T')[0]
  },
  select: {
    options: [{ value: 'opcion1', label: 'Opción 1' }, { value: 'opcion2', label: 'Opción 2' }],
    defaultValue: 'opcion1'
  },
  checkbox: {
    defaultValue: false
  },
  textarea: {
    placeholder: '',
    defaultValue: ''
  },
  range: {
    min: 0,
    max: 10,
    defaultValue: 5
  },
  phone: {
    placeholder: '',
    defaultValue: '',
    pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$'
  },
  time: {
    minTime: '08:00',
    maxTime: '18:00',
    step: 30,
    defaultValue: '09:00'
  },
  'timeHour': {
    options: generateTimeOptions(),
    defaultValue: '09:00'
  },
  url: {
    placeholder: '',
    defaultValue: ''
  },
  steps: {
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5
  }
};

// Computed properties
const hasOptionsField = computed(() => {
  return ['select', 'multi-options', 'radio', 'checkbox', 'timeHour'].includes(formData.value.type);
});

const hasRangeField = computed(() => {
  return ['range', 'number', 'steps'].includes(formData.value.type);
});

const isFormValid = computed(() => {
  return (
    formData.value.type && 
    formData.value.text.trim() && 
    formData.value.key.match(/^[a-zA-Z0-9_]+$/) &&
    (!hasOptionsField.value || 
     (formData.value.options && 
      formData.value.options.length > 0 &&
      formData.value.options.every(opt => opt.value && opt.label)))
  );
});

// Métodos
const resetForm = () => {
  formData.value = {...initialFormData};
  if (formElement.value) {
    formElement.value.classList.remove('was-validated');
  }
};

const close = () => {
  resetForm();
  emit('close');
};

const submitForm = (event) => {
  const form = event.target;
  
  if (!form.checkValidity() || !isFormValid.value) {
    form.classList.add('was-validated');
    return;
  }

  emit('save', {...formData.value});
  resetForm();
};

const addOption = () => {
  if (!formData.value.options) {
    formData.value.options = [];
  }
  const placeholder = typePlaceholders[formData.value.type]?.options || {};
  formData.value.options.push({ 
    value: '', 
    label: '',
    _placeholder: {
      value: placeholder.value || 'Valor',
      label: placeholder.label || 'Etiqueta'
    }
  });
};

const removeOption = (index) => {
  formData.value.options.splice(index, 1);
};

const getPlaceholder = (field) => {
  return typePlaceholders[formData.value.type]?.[field] || '';
};


const handleTypeChange = () => {
  if (formData.value.type && typeDefaults[formData.value.type]) {
    const defaults = {...typeDefaults[formData.value.type]};
    
    // Para campos de fecha
    if (formData.value.type === 'date') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const oneYearLater = new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0];
      
      defaults.minDate = todayStr;
      defaults.maxDate = oneYearLater;
      
      if (!defaults.defaultValue || defaults.defaultValue < todayStr || defaults.defaultValue > oneYearLater) {
        defaults.defaultValue = todayStr;
      }
    }
    
    // Para hora exacta, generar opciones
    if (formData.value.type === 'timeHour') {
      defaults.options = generateTimeOptions();
    }
    
    // Actualizar el formulario
    formData.value = {
      ...formData.value,
      ...defaults,
      text: formData.value.text || '',
      key: formData.value.key || '',
      required: formData.value.required || false,
      helpText: formData.value.helpText || '',
      placeholder: formData.value.placeholder || ''
    };
  } else {
    formData.value.options = [];
    formData.value.min = null;
    formData.value.max = null;
    formData.value.minDate = null;
    formData.value.maxDate = null;
    formData.value.minTime = null;
    formData.value.maxTime = null;
    formData.value.step = null;
    formData.value.pattern = '';
    formData.value.defaultValue = '';
    formData.value.placeholder = '';
  }
};

// Watchers
watch(() => props.show, (show) => {
  if (show) {
    if (props.isEditing && props.question) {
      formData.value = JSON.parse(JSON.stringify(props.question));
    } else {
      resetForm();
      formData.value.type = 'text';
      handleTypeChange();
    }
  }
}, { immediate: true });

watch(() => props.question, (newQuestion) => {
  if (newQuestion && props.isEditing) {
    formData.value = {...newQuestion};
  }
}, { immediate: true });

watch(timeConfig, () => {
  if (formData.value.type === 'timeHour') {
    generateTimeOptions();
  }
}, { deep: true });
</script>