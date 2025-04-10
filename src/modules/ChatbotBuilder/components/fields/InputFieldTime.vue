<template>
  <template v-if="modelValue.type === 'time'">
    <div class="col-md-4">
      <label class="form-label">Hora mínima</label>
      <input 
        v-model="modelValue.minTime" 
        type="time" 
        class="form-control"
      >
    </div>
    
    <div class="col-md-4">
      <label class="form-label">Hora máxima</label>
      <input 
        v-model="modelValue.maxTime" 
        type="time" 
        class="form-control"
      >
    </div>
    
    <div class="col-md-4">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model="modelValue.defaultValue" 
        type="time" 
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