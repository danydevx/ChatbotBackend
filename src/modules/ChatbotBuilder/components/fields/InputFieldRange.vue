<template>
  <template v-if="modelValue.type === 'range'">
    <div class="col-md-4">
      <label class="form-label">Mínimo</label>
      <input 
        v-model.number="modelValue.min" 
        type="number" 
        class="form-control"
        :placeholder="placeholderText('min')"
      >
    </div>
    
    <div class="col-md-4">
      <label class="form-label">Máximo</label>
      <input 
        v-model.number="modelValue.max" 
        type="number" 
        class="form-control"
        :placeholder="placeholderText('max')"
      >
    </div>
    
    <div class="col-md-4">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model.number="modelValue.defaultValue" 
        type="number" 
        class="form-control"
        :min="modelValue.min"
        :max="modelValue.max"
        :placeholder="placeholderText('defaultValue')"
      >
    </div>
  </template>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  placeholderText: {
    type: Function,
    default: () => ''
  }
});
</script>