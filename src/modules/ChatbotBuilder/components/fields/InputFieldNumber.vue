<template>
  <template v-if="modelValue.type === 'number'">
    <div class="col-md-6">
      <label class="form-label">Valor mínimo</label>
      <input 
        v-model.number="modelValue.min" 
        type="number" 
        class="form-control"
        :placeholder="placeholderText('min')"
      >
    </div>
    
    <div class="col-md-6">
      <label class="form-label">Valor máximo</label>
      <input 
        v-model.number="modelValue.max" 
        type="number" 
        class="form-control"
        :placeholder="placeholderText('max')"
      >
    </div>
    
    <div class="col-md-6">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model.number="modelValue.defaultValue" 
        type="number" 
        class="form-control"
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