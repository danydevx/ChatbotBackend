<template>
  <template v-if="['text', 'email', 'textarea'].includes(modelValue.type)">
    <div class="col-md-6">
      <label class="form-label">Placeholder</label>
      <input 
        v-model="modelValue.placeholder" 
        type="text" 
        class="form-control"
        :placeholder="placeholderText('placeholder')"
      >
    </div>
    
    <div class="col-md-6">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model="modelValue.defaultValue" 
        type="text" 
        class="form-control"
        :placeholder="placeholderText('defaultValue')"
      >
    </div>

    <div v-if="modelValue.type === 'text'" class="col-md-6">
      <label class="form-label">Longitud mínima</label>
      <input 
        v-model.number="modelValue.min" 
        type="number" 
        class="form-control"
        min="0"
        :placeholder="placeholderText('min')"
      >
    </div>
    
    <div v-if="modelValue.type === 'text'" class="col-md-6">
      <label class="form-label">Longitud máxima</label>
      <input 
        v-model.number="modelValue.max" 
        type="number" 
        class="form-control"
        min="1"
        :placeholder="placeholderText('max')"
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