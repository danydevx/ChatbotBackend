<template>
  <div class="form-group mb-3">
    <label :for="fieldId" class="form-label d-flex justify-content-between">
      <span>{{ question.text }}</span>
      <span v-if="question.required" class="badge bg-danger bg-opacity-10 text-danger">Requerido</span>
    </label>
    <input
      :id="fieldId"
      v-model="value"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': hasError }"
      :placeholder="question.placeholder"
      :minlength="question.min"
      :maxlength="question.max"
      :required="question.required"
    >
    <small v-if="question.helpText" class="form-text text-muted">
      <i class="bi bi-info-circle"></i> {{ question.helpText }}
    </small>
    <div v-if="hasError" class="invalid-feedback">
      Por favor completa este campo
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const fieldId = computed(() => `field-${props.question.key}`);
</script>

<style lang="less">
.form-group {
  .form-control {
    transition: all 0.2s;
    
    &:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
  }
  
  .form-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>