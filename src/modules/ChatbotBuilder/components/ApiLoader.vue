<template>
  <div class="api-loader-overlay">
    <div class="api-loader-content">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiLoader',
  props: {
    message: {
      type: String,
      default: 'Cargando datos...'
    }
  }
}
</script>

<style scoped>
.api-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.api-loader-content {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>