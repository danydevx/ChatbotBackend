<template>
  <div v-if="show" class="confirm-modal-overlay">
    <div class="confirm-modal">
      <div class="confirm-modal-header">
        <i :class="`bi bi-${icon} me-2`"></i>
        <h5>{{ title }}</h5>
      </div>
      <div class="confirm-modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-modal-footer">
        <button @click="onCancel" class="btn btn-outline-secondary">
          Cancelar
        </button>
        <button @click="onConfirm" class="btn" :class="`btn-${variant}`">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    title: { type: String, default: '¿Estás seguro?' },
    message: { type: String, required: true },
    icon: { type: String, default: 'exclamation-triangle' },
    variant: { type: String, default: 'danger' }
  },
  methods: {
    onConfirm() {
      this.$emit('confirm');
    },
    onCancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.confirm-modal {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.confirm-modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.confirm-modal-body {
  padding: 1.5rem;
}

.confirm-modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>