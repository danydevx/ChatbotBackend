<template>
  <div class="container-fluid vh-100 p-0">
    <!-- Loader overlay mejorado -->
     <ApiLoader 
      v-if="store.apiLoading" 
      :message="apiLoaderMessage"
    />

    <div class="row g-0 h-100" :class="{ 'opacity-25': store.isLoading }">
      <!-- Panel lateral izquierdo mejorado -->
      <div class="col-md-3 col-lg-2 bg-light border-end p-3 d-flex flex-column">
        <div class="d-flex align-items-center mb-4">
          <i class="bi bi-robot fs-4 text-primary me-2"></i>
          <h5 class="mb-0 fw-bold text-primary">Chatbot Builder</h5>
        </div>
        
        <div class="d-flex flex-column gap-3 h-100">
          <FormPersistence 
            class="flex-grow-0" 
            @create="showCreateFormModal = true"
          />
        </div>
      </div>

      <!-- Área central mejorada -->
      <div class="col-md-9 col-lg-10 p-4 overflow-auto bg-white">
        <template v-if="!currentForm">
          <FormList 
            @edit="loadForm"
            @create="showCreateFormModal = true"
          />
        </template>
        
        <template v-else>
           <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
    <div class="d-flex align-items-center">
      <button 
  class="btn btn-outline-secondary me-3"
  @click="returnToList"
  title="Volver a la lista de formularios"
  :disabled="store.apiLoading"
>
  <i class="bi bi-arrow-left me-2"></i>
  Volver
</button>
      
      <i class="bi bi-file-earmark-text fs-3 text-primary me-3"></i>
      <div>
        <h4 class="mb-0 fw-semibold">{{ currentForm.name }}</h4>
        <small class="text-muted">Editando formulario</small>
      </div>
    </div>
    
    <button 
      class="btn btn-primary d-flex align-items-center"
      @click="saveFormChanges"
      :disabled="!store.hasQuestions"
    >
      <i class="bi bi-save me-2"></i> 
      <span>Guardar cambios</span>
    </button>
  </div>
          
          <FormToolbar class="mb-4" />
          
          <template v-if="!store.hasQuestions">
            <WelcomeScreen 
              @create-new="handleEditQuestion(null)"
              :form-name="currentForm.name"
            />
          </template>
          <template v-else>
            <QuestionList @edit="handleEditQuestion" />
          </template>
        </template>

        <!-- Modal para crear nuevo formulario mejorado -->
   <div v-if="showCreateFormModal" class="modal fade show d-block" @click.self="closeCreateModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="bi bi-file-earmark-plus me-2"></i>
            Nuevo Formulario
          </h5>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="closeCreateModal"
            :disabled="creatingForm"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label fw-semibold">Nombre del formulario</label>
            <input 
              v-model="newFormName" 
              type="text" 
              class="form-control form-control-lg"
              placeholder="Ej: contacto_2023"
              pattern="[a-zA-Z0-9_]+"
              title="Solo letras, números y guiones bajos"
              required
              :disabled="creatingForm"
            >
            <div class="form-text">
              <i class="bi bi-info-circle me-1"></i>
              Usa solo letras, números y guiones bajos (sin espacios)
            </div>
          </div>
        </div>
        <div class="modal-footer border-top-0">
          <button 
            type="button" 
            class="btn btn-outline-secondary"
            @click="closeCreateModal"
            :disabled="creatingForm"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary px-4"
            @click="createNewForm"
            :disabled="!newFormName || !/^[a-zA-Z0-9_]+$/.test(newFormName) || creatingForm"
          >
            <span v-if="!creatingForm">
              <i class="bi bi-check-lg me-1"></i>
              Crear
            </span>
            <span v-else class="d-flex align-items-center">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creando...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showCreateFormModal" class="modal-backdrop fade show"></div>

       <QuestionModal 
          :show="showQuestionModal" 
          :question="currentQuestion"
          :isEditing="!!currentQuestion"
          @close="closeQuestionModal"
          @save="handleSaveQuestion"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'; // Añade computed aquí
import { useFormBuilderStore } from '@/modules/ChatbotBuilder/store/useFormBuilderStore';
import { useToast } from 'vue-toastification';
import QuestionList from '@/modules/ChatbotBuilder/components/QuestionList.vue';
import FormToolbar from '@/modules/ChatbotBuilder/components/FormToolbar.vue';
import FormPersistence from '@/modules/ChatbotBuilder/components/FormPersistence.vue';
import FormList from '@/modules/ChatbotBuilder/components/FormList.vue';
import QuestionModal from '@/modules/ChatbotBuilder/components/QuestionModal.vue';
import WelcomeScreen from '@/modules/ChatbotBuilder/components/WelcomeScreen.vue';
import ApiLoader from '@/modules/ChatbotBuilder/components/ApiLoader.vue';


const toast = useToast();
const store = useFormBuilderStore();
const showQuestionModal = ref(false);
const currentQuestion = ref(null);
const currentForm = ref(null);
const showCreateFormModal = ref(false);
const newFormName = ref('');

const creatingForm = ref(false); // Nuevo estado para controlar creación


const apiLoaderMessage = computed(() => {
  if (currentForm.value && store.apiLoading) {
    return `Cargando preguntas para ${currentForm.value.name}...`;
  }
  return 'Cargando datos del formulario...';
});

const handleEditQuestion = (question = null) => {
  currentQuestion.value = question;
  showQuestionModal.value = true;
};

const closeQuestionModal = () => {
  showQuestionModal.value = false;
  currentQuestion.value = null;
};

const handleSaveQuestion = async (questionData) => {
  try {
    if (questionData.id) {
      store.updateQuestion(questionData.id, questionData);
      toast.success('Pregunta actualizada correctamente');
    } else {
      store.addQuestion(questionData);
      toast.success('Pregunta agregada correctamente');
    }
    closeQuestionModal();
  } catch (error) {
    toast.error('Error al guardar la pregunta: ' + error.message);
  }
};

const loadForm = async (form) => {
  try {
    currentForm.value = form;
    await store.loadFormFromDatabase(form.id);
    toast.success(`Formulario "${form.name}" cargado correctamente`);
  } catch (error) {
    toast.error('Error al cargar el formulario: ' + error.message);
  }
};




const createNewForm = async () => {
  if (creatingForm.value) return;
  
  if (!newFormName.value || !/^[a-zA-Z0-9_]+$/.test(newFormName.value)) {
    toast.error('Por favor ingresa un nombre válido (solo letras, números y guiones bajos)');
    return;
  }

  try {
    creatingForm.value = true;
    
    const formData = {
      name: newFormName.value,
      config: { questions: [] }
    };

    const response = await store.saveFormToDatabase(formData);
    currentForm.value = { ...formData, id: response.id };
    store.resetForm();
    newFormName.value = '';
    showCreateFormModal.value = false;
    toast.success('Formulario creado exitosamente! Agrega tu primera pregunta.');
    
  } catch (error) {
    toast.error('Error al crear el formulario: ' + error.message);
  } finally {
    creatingForm.value = false;
  }
};


const saveFormChanges = async () => {
  try {
    const formData = {
      name: currentForm.value.name,
      config: store.exportToJson().data
    };

    await store.updateFormInDatabase(currentForm.value.id, formData);
    toast.success('Formulario actualizado exitosamente!');
  } catch (error) {
    toast.error('Error al guardar el formulario: ' + error.message);
  }
};

const closeCreateModal = () => {
  newFormName.value = '';
  showCreateFormModal.value = false;
};

const loadInitialData = async () => {
  try {
    store.setLoading(true);
    await store.loadFormsFromDatabase(); // Asume que tienes este método en tu store
    store.setLoading(false);
  } catch (error) {
    toast.error('Error al cargar los formularios: ' + error.message);
    store.setLoading(false);
  }
};

const returnToList = async () => {
  try {
    // Verificar cambios locales primero
    const hasLocalChanges = JSON.stringify(store.questions) !== 
      JSON.stringify(JSON.parse(localStorage.getItem('formBuilderQuestions') || '[]'));
    
    if (hasLocalChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Estás seguro de que deseas volver?')) {
        return;
      }
    }
    
    // Resetear el estado
    currentForm.value = null;
    store.resetForm();
    
  } catch (error) {
    toast.error('Error al verificar cambios: ' + error.message);
  }
};
// Auto-save cuando cambian las preguntas
watch(() => store.questions, () => {
  if (store.hasQuestions) {
    store.persistToLocalStorage();
  }
}, { deep: true });
</script>
<style scoped>
.btn-outline-secondary {
  transition: all 0.2s;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #6c757d;
}
</style>