<template>
  <template v-if="modelValue.type === 'phone'">
    <div class="col-md-6">
      <label class="form-label">Placeholder</label>
      <input 
        v-model="modelValue.placeholder" 
        type="text" 
        class="form-control"
        placeholder="Ej: +1 (123) 456-7890"
      >
    </div>
    
    <div class="col-md-6">
      <label class="form-label">Valor por defecto</label>
      <input 
        v-model="modelValue.defaultValue" 
        type="tel" 
        class="form-control"
        placeholder="Ej: +1 (123) 456-7890"
      >
    </div>
    
    <div class="col-12">
      <label class="form-label">Patrón de validación</label>
      <input 
        v-model="modelValue.pattern" 
        type="text" 
        class="form-control"
        placeholder="Ej: ^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$"
      >
      <div class="form-text">Expresión regular para validar el número de teléfono</div>
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