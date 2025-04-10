<template>
  <div class="question-list-container">
    <!-- Header mejorado -->
    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
      <div class="d-flex align-items-center">
        <i class="bi bi-list-check fs-3 text-primary me-3"></i>
        <div>
          <h4 class="mb-0 fw-semibold">Preguntas del Formulario</h4>
          <small class="text-muted">Ordena y gestiona las preguntas</small>
        </div>
        <span class="badge bg-primary rounded-pill ms-3 align-self-start">
          {{ sortedQuestions.length }}
        </span>
      </div>
      <button 
        class="btn btn-primary d-flex align-items-center"
        @click="openQuestionModal"
        title="Agregar nueva pregunta"
      >
        <i class="bi bi-plus-lg me-2"></i>
        <span>Nueva Pregunta</span>
      </button>
    </div>
    
    <!-- Lista de preguntas - versión con elementos -->
    <div v-if="sortedQuestions.length" class="mb-4">
      <div class="alert alert-info d-flex align-items-center mb-3">
        <i class="bi bi-info-circle-fill me-2"></i>
        <small>Arrastra las preguntas para cambiar su orden</small>
      </div>

      <draggable 
        v-model="sortedQuestions"
        item-key="id"
        @start="dragStart"
        @end="dragEnd"
        handle=".drag-handle"
        ghost-class="dragging-ghost"
        chosen-class="dragging-chosen"
         class="list-group list-group-flush"
      >
        <template #item="{element, index}">
          <div 
            class="list-group-item list-group-item-action p-3 hover-shadow"
            @click="editQuestion(element)"
          >
            <div class="d-flex align-items-center">
              <span class="drag-handle me-3 text-muted cursor-grab">
                <i class="bi bi-grip-vertical fs-5"></i>
              </span>
              
              <div class="flex-grow-1">
                <div class="d-flex align-items-center mb-1">
                  <span class="badge bg-light text-dark me-2 fw-normal">
                    #{{ index + 1 }}
                  </span>
                  <h6 class="mb-0 fw-semibold">{{ element.text || 'Pregunta sin texto' }}</h6>
                </div>
                
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                    <i class="bi bi-tag me-1"></i>
                    {{ getTypeLabel(element.type) }}
                  </span>
                  
                  <span class="badge" :class="element.required ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'">
                    <i class="bi me-1" :class="element.required ? 'bi-exclamation-circle' : 'bi-arrow-left-right'"></i>
                    {{ element.required ? 'Requerido' : 'Opcional' }}
                  </span>
                  
                  <span v-if="element.key" class="badge bg-light text-dark border">
                    <i class="bi bi-key me-1"></i>
                    {{ element.key }}
                  </span>
                </div>
              </div>
              
              <div class="btn-group btn-group-sm" role="group">
                <button 
                  class="btn btn-outline-primary"
                  @click.stop="editQuestion(element)"
                  title="Editar pregunta"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn btn-outline-danger"
                  @click.stop="removeQuestion(element.id)"
                  title="Eliminar pregunta"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    
    <!-- Estado vacío mejorado -->
    <div v-if="!sortedQuestions.length" class="text-center py-5 border-2 rounded bg-light bg-opacity-50">
      <i class="bi bi-inbox text-muted fs-1 opacity-75"></i>
      <h5 class="text-muted mt-3 fw-normal">No hay preguntas creadas</h5>
      <p class="text-muted mb-4">Comienza agregando tu primera pregunta</p>
      <button class="btn btn-primary btn-lg" @click="openQuestionModal">
        <i class="bi bi-plus-lg me-2"></i>Crear primera pregunta
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';
import draggable from 'vuedraggable';

const emit = defineEmits(['edit']);
const store = useFormBuilderStore();

const sortedQuestions = computed({
  get: () => store.sortedQuestions,
  set: (value) => store.reorderQuestions(value.map(q => q.id))
});

const getTypeLabel = (typeValue) => {
  const type = store.fieldTypes.find(t => t.value === typeValue);
  return type ? type.label : typeValue;
};

const editQuestion = (question) => emit('edit', question);
const openQuestionModal = () => emit('edit', null);
const removeQuestion = (id) => {
  if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
    store.removeQuestion(id);
  }
};
const handleDragEnd = () => {};
</script>

<style scoped>
.drag-handle {
  cursor: move;
  opacity: 0.3;
  transition: all 0.2s;
  
  &:hover {
    opacity: 1;
    color: var(--bs-primary);
  }
}

.list-group-item {
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--bs-light);
    transform: translateX(2px);
  }
  
  .btn-outline-danger {
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:hover {
    .btn-outline-danger {
      opacity: 1;
    }
  }
}
 
.dragging-ghost {
  opacity: 0.5;
  background: #e9f7fe;
  border: 1px dashed #4e9dd4 !important;
}

.dragging-chosen {
  transform: rotate(2deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Mejora el handle de arrastre */
.drag-handle {
  cursor: grab;
  opacity: 0.5;
  transition: all 0.2s;
}

.drag-handle:hover {
  opacity: 1;
  color: var(--bs-primary);
}

.drag-handle:active {
  cursor: grabbing;
}
</style>