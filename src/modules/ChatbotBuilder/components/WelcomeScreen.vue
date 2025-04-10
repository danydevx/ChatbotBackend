<template>
  <div class="d-flex align-items-center justify-content-center min-vh-75 py-5">
    <div class="card border-0 shadow-sm p-4 mx-auto welcome-card" style="max-width: 600px; border-radius: 1rem;">
      <div class="card-body text-center px-4 py-5">
        <!-- Icono animado -->
        <div class="icon-wrapper mb-4">
          <i class="bi bi-file-earmark-plus display-4 text-primary"></i>
        </div>
        
        <!-- Título con gradiente -->
        <h3 class="mb-3 fw-bold text-gradient">
          Formulario: <span class="text-primary">{{ formName }}</span>
        </h3>
        
        <!-- Texto descriptivo -->
        <p class="text-muted mb-4 fs-5">
          Comienza construyendo tu formulario agregando la primera pregunta
        </p>
        
        <!-- Línea divisoria decorativa -->
        <div class="divider my-4">
          <span class="divider-line"></span>
          <span class="divider-text px-3">Comienza aquí</span>
          <span class="divider-line"></span>
        </div>
        
        <!-- Botón de acción principal -->
        <button 
          class="btn btn-primary btn-lg px-4 py-3 fw-semibold shadow-sm"
          @click="$emit('create-new')"
        >
          <i class="bi bi-plus-lg me-2"></i>
          <span>Agregar primera pregunta</span>
        </button>
        
        <!-- Texto de ayuda adicional -->
        <p class="small text-muted mt-4 mb-0">
          <i class="bi bi-lightbulb me-1"></i>
          Puedes agregar preguntas de diferentes tipos como texto, selección, fechas y más
        </p>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  formName: {
    type: String,
    default: 'Nuevo formulario'
  }
});

defineEmits(['create-new']);
</script>

<style scoped lang="less">
// Variables
@primary-color: #4e54c8;
@secondary-color: #8f94fb;
@divider-color: #dee2e6;
@text-muted: #6c757d;

// Card styles
.welcome-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }
}

// Icon animation
.icon-wrapper {
  animation: bounce 2s infinite;
}

// Text gradient
.text-gradient {
  background: linear-gradient(45deg, @primary-color, @secondary-color);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  span {
    color: @primary-color;
    background: none;
    -webkit-background-clip: initial;
    background-clip: initial;
  }
}

// Divider styles
.divider {
  display: flex;
  align-items: center;
  
  &-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, @divider-color, transparent);
  }
  
  &-text {
    color: @text-muted;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

// Keyframes animation
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// Additional styles
.card-body {
  .text-muted {
    color: @text-muted;
  }
  
  .btn-primary {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
}
</style>