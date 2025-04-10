import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Componentes
import ChatbotBuilder from '@/modules/ChatbotBuilder/ChatbotBuilder.vue';

// Crear la app del chatbot
const app = createApp(ChatbotBuilder);

// Usar Pinia para el manejo de estado
app.use(createPinia());

// Usar Toast para notificaciones
app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
});

// Montar la app en el DOM
app.mount('#chatbotBuilder');
