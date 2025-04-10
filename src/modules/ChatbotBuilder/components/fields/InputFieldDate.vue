<template>
  <template v-if="modelValue.type === 'date'">
    <div class="col-md-4">
      <label class="form-label">Fecha mínima</label>
      <input 
        v-model="modelValue.minDate" 
        type="date" 
        class="form-control"
      >
    </div>
    
    <div class="col-md-4">
      <label class="form-label">Fecha máxima</label>
      <input 
        v-model="modelValue.maxDate" 
        type="date" 
        class="form-control"
      >
    </div>
    
    <div class="col-md-4">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model="modelValue.defaultValue" 
        type="date" 
        class="form-control"
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