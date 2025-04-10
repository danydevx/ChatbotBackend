<template>
  <div class="toolbar-section mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="section-title text-uppercase text-muted mb-0 fw-bold">
        <i class="bi bi-tools me-2"></i>Herramientas
      </h6>
      <small class="text-muted" v-if="hasQuestions">
        <i class="bi bi-info-circle me-1"></i>
        {{ questionsCount }} preguntas cargadas
      </small>
    </div>
    
    <div class="d-flex flex-wrap gap-2">
      <div class="btn-group" role="group">
        <button 
          class="btn btn-outline-primary btn-sm d-flex align-items-center"
          @click="exportJson"
          :disabled="!hasQuestions"
          title="Exportar como JSON"
        >
          <i class="bi bi-filetype-json fs-5 me-2"></i>
          <span class="d-none d-md-inline">JSON</span>
        </button>
        
        <button 
          class="btn btn-outline-primary btn-sm d-flex align-items-center"
          @click="exportJs"
          :disabled="!hasQuestions"
          title="Exportar como JavaScript"
        >
          <i class="bi bi-filetype-js fs-5 me-2"></i>
          <span class="d-none d-md-inline">JS</span>
        </button>
      </div>
      
      <button 
        class="btn btn-outline-secondary btn-sm d-flex align-items-center"
        @click="importJson"
        title="Importar desde archivo"
      >
        <i class="bi bi-upload fs-5 me-2"></i>
        <span class="d-none d-md-inline">Importar</span>
      </button>
      
      <button 
        class="btn btn-outline-danger btn-sm d-flex align-items-center"
        @click="resetForm"
        :disabled="!hasQuestions"
        title="Reiniciar formulario"
      >
        <i class="bi bi-trash fs-5 me-2"></i>
        <span class="d-none d-md-inline">Reiniciar</span>
      </button>
    </div>
    
    <!-- Modal de exportación mejorado -->
    <div v-if="showExportModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi me-2" :class="exportType === 'json' ? 'bi-filetype-json' : 'bi-filetype-js'"></i>
              Exportar como {{ exportType === 'json' ? 'JSON' : 'JavaScript' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showExportModal = false"></button>
          </div>
          
          <div class="modal-body">
            <ul class="nav nav-pills mb-4">
              <li class="nav-item">
                <button 
                  class="nav-link d-flex align-items-center"
                  :class="{ 'active': exportType === 'json' }"
                  @click="exportType = 'json'"
                >
                  <i class="bi bi-filetype-json me-2"></i>
                  JSON
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link d-flex align-items-center"
                  :class="{ 'active': exportType === 'js' }"
                  @click="exportType = 'js'"
                >
                  <i class="bi bi-filetype-js me-2"></i>
                  JavaScript
                </button>
              </li>
            </ul>
            
            <div class="position-relative">
              <pre class="p-3 bg-light rounded-2 overflow-auto" style="max-height: 300px;">{{ exportContent }}</pre>
              <div class="position-absolute top-0 end-0 mt-2 me-2">
                <button 
                  class="btn btn-sm btn-outline-secondary"
                  @click="copyToClipboard"
                  title="Copiar al portapapeles"
                >
                  <i class="bi bi-clipboard"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="modal-footer border-top-0">
            <button 
              class="btn btn-outline-secondary"
              @click="showExportModal = false"
            >
              <i class="bi bi-x-lg me-1"></i> Cerrar
            </button>
            <button 
              class="btn btn-success"
              @click="downloadExport"
            >
              <i class="bi bi-download me-1"></i> Descargar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showExportModal" class="modal-backdrop fade show"></div>
    
    <!-- Input oculto para importar -->
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none;" 
      accept=".json,.js" 
      @change="handleFileImport"
    >
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFormBuilderStore } from '../store/useFormBuilderStore';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useFormBuilderStore();
const fileInput = ref(null);
const showExportModal = ref(false);
const exportContent = ref('');
const exportType = ref('json');

const hasQuestions = computed(() => store.hasQuestions);

const exportJson = () => {
  const { jsonString } = store.exportToJson();
  exportContent.value = jsonString;
  exportType.value = 'json';
  showExportModal.value = true;
};

const exportJs = () => {
  const { jsString } = store.exportToJs();
  exportContent.value = jsString;
  exportType.value = 'js';
  showExportModal.value = true;
};

const importJson = () => {
  fileInput.value.click();
};

const handleFileImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    const success = store.importFromJson(content);
    
    if (success) {
      toast.success('Configuración importada con éxito!');
    } else {
      toast.error('Error al importar el archivo. Formato no válido.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
};

const resetForm = () => {
  if (confirm('¿Estás seguro de reiniciar el formulario? Se perderán todas las preguntas.')) {
    store.resetForm();
    toast.info('Formulario reiniciado');
  }
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(exportContent.value)
    .then(() => {
      toast.success('Contenido copiado al portapapeles!');
    })
    .catch(err => {
      console.error('Error al copiar:', err);
      toast.error('Error al copiar al portapeles');
    });
};

const downloadExport = () => {
  let content, fileName, mimeType;
  
  if (exportType.value === 'js') {
    const result = store.exportToJs();
    content = result.jsString;
    fileName = result.fileName;
    mimeType = 'application/javascript';
  } else {
    const result = store.exportToJson();
    content = result.jsonString;
    fileName = result.fileName;
    mimeType = 'application/json';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(`Archivo ${fileName} descargado`);
};
</script>