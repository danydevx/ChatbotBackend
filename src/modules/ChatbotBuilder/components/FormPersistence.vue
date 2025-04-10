<template>
  <div class="persistence-section">
    <h6 class="section-title text-uppercase text-muted mb-3">
      <i class="bi bi-cloud me-1"></i> Persistencia
    </h6>
    
    <div class="d-grid gap-2 mb-3">
      <button 
        class="btn btn-sm btn-outline-primary"
        @click="handleNewForm"
        :disabled="isLoading || isCreating"
      >
        <i class="bi bi-file-earmark-plus me-1"></i> 
        <span>Nuevo formulario</span>
      </button>
      
      <button 
        v-if="showReturnButton"
        class="btn btn-sm btn-outline-secondary"
        @click="handleReturnToList"
        :disabled="isLoading"
      >
        <i class="bi bi-arrow-left me-1"></i>
        <span>Volver a lista</span>
      </button>
    </div>
    
    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center mt-2">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useFormBuilderStore();
const emit = defineEmits(['create', 'return']);

const isCreating = ref(false); // Nuevo estado para controlar creación
const isLoading = computed(() => store.apiLoading || store.isLoading);
const showReturnButton = computed(() => store.hasQuestions);

const handleNewForm = async () => {
  if (isCreating.value) return; // Evitar múltiples clicks
  
  try {
    isCreating.value = true;
    
    if (store.hasUnsavedChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Deseas crear un nuevo formulario?')) {
        return;
      }
    }
    
    emit('create');
    
  } catch (error) {
    toast.error('Error al preparar nuevo formulario: ' + error.message);
  } finally {
    // Resetear después de un breve delay para evitar flickering
    setTimeout(() => {
      isCreating.value = false;
    }, 500);
  }
};

const handleReturnToList = async () => {
  try {
    if (store.hasUnsavedChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Deseas volver a la lista?')) {
        return;
      }
    }
    emit('return');
  } catch (error) {
    toast.error('Error al regresar: ' + error.message);
  }
};
</script>

<style lang="less" scoped>
.persistence-section {
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:disabled {
      opacity: 0.6;
      transform: none;
      box-shadow: none;
    }
  }
  
  .section-title {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
  }
  
  .spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
  }
}
</style>