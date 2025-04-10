<template>
  <template v-if="modelValue.type === 'url'">
    <div class="col-md-6">
      <label class="form-label">Placeholder</label>
      <input 
        v-model="modelValue.placeholder" 
        type="text" 
        class="form-control"
        placeholder="Ej: https://ejemplo.com"
      >
    </div>
    
    <div class="col-md-6">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model="modelValue.defaultValue" 
        type="url" 
        class="form-control"
        placeholder="Ej: https://ejemplo.com"
      >
    </div>
  </template>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
</script>