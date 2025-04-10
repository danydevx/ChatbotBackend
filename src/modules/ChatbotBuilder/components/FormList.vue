<template>
  <div class="form-list-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0 d-flex align-items-center">
        <i class="bi bi-folder2-open text-primary me-2"></i>
        Formularios Disponibles
        <span class="badge bg-primary ms-2">{{ forms.length }}</span>
      </h4>
      <button 
        class="btn btn-primary"
        @click="showCreateForm"
        v-if="forms.length"
      >
        <i class="bi bi-plus-lg me-1"></i> Nuevo Formulario
      </button>
    </div>
    
    <div class="table-responsive" v-if="forms.length">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th class="w-40">Nombre</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="form in forms" :key="form.id">
            <td>
              <div class="d-flex align-items-center">
                <i class="bi bi-file-earmark-text text-muted me-2"></i>
                <span>{{ form.name }}</span>
              </div>
            </td>
            <td><span class="text-muted">{{ formatDate(form.created_at) }}</span></td>
            <td><span class="text-muted">{{ formatDate(form.updated_at) }}</span></td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button 
                  class="btn btn-outline-primary"
                  @click="editForm(form)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                  <span class="d-none d-sm-inline ms-1">Editar</span>
                </button>
                <button 
                  class="btn btn-outline-danger"
                  @click="deleteForm(form.id)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                  <span class="d-none d-sm-inline ms-1">Eliminar</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="!forms.length" class="text-center py-5 border rounded bg-light">
      <i class="bi bi-inbox text-muted fs-1 opacity-75"></i>
      <p class="text-muted mt-3 mb-4">No hay formularios creados</p>
      <button class="btn btn-primary btn-lg" @click="showCreateForm">
        <i class="bi bi-plus-lg me-2"></i>Crear primer formulario
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useFormBuilderStore();
const forms = ref([]);

const emit = defineEmits(['edit', 'create']);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const fetchForms = async () => {
  try {
    forms.value = await store.fetchAllForms();
  } catch (error) {
    toast.error('Error al cargar los formularios: ' + error.message);
  }
};

const editForm = (form) => {
  emit('edit', form);
};

const deleteForm = async (id) => {
  if (confirm('¿Estás seguro de eliminar este formulario?')) {
    try {
      await store.deleteFormFromDatabase(id);
      forms.value = forms.value.filter(f => f.id !== id);
      toast.success('Formulario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el formulario: ' + error.message);
    }
  }
};

const showCreateForm = () => {
  emit('create');
};

onMounted(() => {
  fetchForms();
});
</script>

<style scoped>
.form-list-container {
  .table {
    th {
      font-weight: 600;
      background-color: #f8f9fa;
    }
    
    tr:hover {
      background-color: #f8f9fa;
    }
  }
  
  .btn {
    display: flex;
    align-items: center;
  }
}
</style>