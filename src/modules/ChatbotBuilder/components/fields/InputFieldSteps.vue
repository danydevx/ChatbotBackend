<template>
  <template v-if="modelValue.type === 'steps'">
    <div class="col-md-3">
      <label class="form-label">Mínimo</label>
      <input 
        v-model.number="modelValue.min" 
        type="number" 
        class="form-control"
        placeholder="0"
      >
    </div>
    
    <div class="col-md-3">
      <label class="form-label">Máximo</label>
      <input 
        v-model.number="modelValue.max" 
        type="number" 
        class="form-control"
        placeholder="100"
      >
    </div>
    
    <div class="col-md-3">
      <label class="form-label">Paso (step)</label>
      <input 
        v-model.number="modelValue.step" 
        type="number" 
        min="1" 
        class="form-control"
        placeholder="Ej: 5"
      >
    </div>
    
    <div class="col-md-3">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model.number="modelValue.defaultValue" 
        type="number" 
        class="form-control"
        :min="modelValue.min"
        :max="modelValue.max"
        :step="modelValue.step"
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