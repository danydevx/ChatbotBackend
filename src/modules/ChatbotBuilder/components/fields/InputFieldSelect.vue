<template>
  <template v-if="['select', 'radio', 'checkbox', 'multi-options'].includes(modelValue.type)">
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="form-label fw-semibold">Opciones</label>
        <button 
          class="btn btn-sm btn-outline-primary d-flex align-items-center"
          type="button" 
          @click="addOption"
        >
          <i class="bi bi-plus-lg me-1"></i>
          Añadir opción
        </button>
      </div>
      
      <div v-for="(option, index) in modelValue.options" :key="index" class="card mb-2 shadow-none border">
        <div class="card-body p-2">
          <div class="row g-2">
            <div class="col-md-5">
              <input 
                v-model="option.value" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Valor"
                required
              >
            </div>
            <div class="col-md-5">
              <input 
                v-model="option.label" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Etiqueta"
                required
              >
            </div>
            <div class="col-md-2 d-flex align-items-center">
              <button 
                class="btn btn-sm btn-outline-danger w-100"
                type="button" 
                @click="removeOption(index)"
                title="Eliminar opción"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const addOption = () => {
  if (!props.modelValue.options) {
    emit('update:modelValue', {
      ...props.modelValue,
      options: []
    });
  }
  const newOptions = [...props.modelValue.options, { value: '', label: '' }];
  emit('update:modelValue', {
    ...props.modelValue,
    options: newOptions
  });
};

const removeOption = (index) => {
  const newOptions = [...props.modelValue.options];
  newOptions.splice(index, 1);
  emit('update:modelValue', {
    ...props.modelValue,
    options: newOptions
  });
};
</script>