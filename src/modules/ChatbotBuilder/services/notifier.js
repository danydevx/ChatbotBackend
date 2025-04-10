import { useToast } from 'vue-toastification';

const toast = useToast();

export default {
  success(message) {
    toast.success(message, { timeout: 3000 });
  },
  error(message) {
    toast.error(message, { timeout: 4000 });
  },
  info(message) {
    toast.info(message, { timeout: 2500 });
  },
  warning(message) {
    toast.warning(message, { timeout: 3500 });
  }
};