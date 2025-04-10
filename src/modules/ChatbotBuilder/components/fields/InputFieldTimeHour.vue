<template>
  <template v-if="modelValue.type === 'timeHour'">
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="form-label fw-semibold">Opciones de hora</label>
        <button 
          class="btn btn-sm btn-outline-primary d-flex align-items-center"
          type="button" 
          @click="$emit('generate-options')"
        >
          <i class="bi bi-magic me-1"></i>
          Generar horas
        </button>
      </div>
      
      <div class="row">
        <div class="col-md-4">
          <label class="form-label">Hora inicial</label>
          <select v-model="timeConfig.start" class="form-select">
            <option v-for="h in 24" :value="h-1">{{ String(h-1).padStart(2, '0') }}:00</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Hora final</label>
          <select v-model="timeConfig.end" class="form-select">
            <option v-for="h in 24" :value="h">{{ String(h).padStart(2, '0') }}:00</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Intervalo (minutos)</label>
          <select v-model.number="timeConfig.interval" class="form-select">
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">60 minutos</option>
          </select>
        </div>
      </div>
      
      <div class="mt-3">
        <label class="form-label">Valor por defecto</label>
        <select 
          v-model="modelValue.defaultValue" 
          class="form-select"
        >
          <option value="" disabled selected>Seleccione una hora</option>
          <option 
            v-for="option in modelValue.options" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </template>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  timeConfig: {
    type: Object,
    required: true
  }
});

defineEmits(['generate-options']);
</script>