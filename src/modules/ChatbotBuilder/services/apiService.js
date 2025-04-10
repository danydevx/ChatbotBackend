import axios from 'axios';

const API_BASE_URL = 'http://dev.com/chatbot/api';

// Configuración global de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de solicitudes
apiClient.interceptors.request.use(config => {
  console.log(`[API] Request to ${config.url}`, config.params || config.data);
  config.metadata = { startTime: new Date() };
  return config;
}, error => {
  console.error('[API] Request error:', error);
  return Promise.reject(error);
});

// Interceptor de respuestas
apiClient.interceptors.response.use(response => {
  const endTime = new Date();
  const duration = endTime - response.config.metadata.startTime;
  console.log(`[API] Response from ${response.config.url} in ${duration}ms`);
  response.duration = duration;
  return response;
}, error => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    const endTime = new Date();
    const duration = endTime - error.config.metadata.startTime;
    console.error(
      `[API] Error response from ${error.config.url} in ${duration}ms`,
      `Status: ${error.response.status}`,
      error.response.data
    );
    error.duration = duration;
  } else if (error.request) {
    // La solicitud fue hecha pero no se recibió respuesta
    console.error('[API] No response received:', error.request);
  } else {
    // Algo pasó al configurar la solicitud
    console.error('[API] Request setup error:', error.message);
  }
  return Promise.reject(error);
});

export default {
  /**
   * Guarda un nuevo formulario en la base de datos
   * @param {Object} formData - Datos del formulario a guardar
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  async saveForm(formData) {
    try {
      const response = await apiClient.post('/create_form.php', formData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Error al guardar el formulario');
    }
  },
  
  /**
   * Obtiene un formulario por su ID
   * @param {string|number} formId - ID del formulario
   * @returns {Promise<Object>} - Datos del formulario
   */
  async getForm(formId) {
    try {
      const response = await apiClient.get('/get_form.php', { 
        params: { id: formId } 
      });
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Error al obtener el formulario');
    }
  },

  /**
   * Actualiza un formulario existente
   * @param {string|number} formId - ID del formulario
   * @param {Object} formData - Datos actualizados del formulario
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  async updateForm(formId, formData) {
    try {
      const response = await apiClient.put('/update_form.php', { 
        id: formId, 
        ...formData 
      });
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Error al actualizar el formulario');
    }
  },

  /**
   * Obtiene todos los formularios disponibles
   * @returns {Promise<Array>} - Lista de formularios
   */
  async getAllForms() {
    try {
      const response = await apiClient.get('/get_forms.php');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Error al obtener los formularios');
    }
  },

  /**
   * Elimina un formulario
   * @param {string|number} formId - ID del formulario a eliminar
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  async deleteForm(formId) {
    try {
      const response = await apiClient.delete('/delete_form.php', { 
        data: { id: formId } 
      });
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Error al eliminar el formulario');
    }
  },

  /**
   * Maneja errores de API de forma consistente
   * @param {Error} error - Error original
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Error} - Error formateado
   */
  handleApiError(error, defaultMessage) {
    let errorMessage = defaultMessage;
    let errorDetails = null;
    
    if (error.response) {
      // El servidor respondió con un código de error
      errorDetails = error.response.data;
      if (error.response.data && error.response.data.message) {
        errorMessage += `: ${error.response.data.message}`;
      } else {
        errorMessage += ` (Código ${error.response.status})`;
      }
    } else {
      errorDetails = error.message;
      errorMessage += `: ${error.message}`;
    }
    
    console.error(errorMessage, errorDetails);
    const formattedError = new Error(errorMessage);
    formattedError.details = errorDetails;
    formattedError.isApiError = true;
    formattedError.duration = error.duration;
    
    return formattedError;
  }
};