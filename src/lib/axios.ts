import axios from 'axios';

// Créer une instance axios pour les requêtes API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
});

// Ajouter un intercepteur pour inclure le token d'authentification dans les en-têtes des requêtes
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('accessToken');
    }
    return Promise.reject((error.response?.data) || 'Something went wrong');
  }
);

export default axiosInstance;

// Fonction fetcher pour SWR
export const fetcher = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

// Définir les endpoints API
export const endpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
  },
  users: {
    get: (userId: number) => `/users/${userId}`,
    list: '/users',
    post: '/users',
    put: (userId: number) => `/users/${userId}`,
    avatar: {
      get: (avatarId: string) => `http://localhost:3333/uploads/avatar/${avatarId}`,
      put: (userId: number) => `/users/${userId}/avatar/`,
    },
    delete: (userId: number) => `/users/${userId}`,
  },
  societies: {
    get: (societyId: number) => `/societies/${societyId}`,
    list: '/societies',
    post: '/societies',
    put: (societyId: number) => `/societies/${societyId}`,
    avatar: {
      get: (avatarId: string) => `http://localhost:3333/uploads/avatar/${avatarId}`,
      put: (societyId: number) => `/societies/${societyId}/avatar/`,
    },
  },
  properties: {
    list: '/properties',
    get: (id: number) => `/properties/${id}`,
    create: '/properties',
    update: (id: number) => `/properties/${id}`,
    delete: (id: number) => `/properties/${id}`,
    bookings: {
      list: (propertyId: number) => `/properties/${propertyId}/bookings`,
      get: (propertyId: number, bookingId: number) => `/properties/${propertyId}/bookings/${bookingId}`,
      create: (propertyId: number) => `/properties/${propertyId}/bookings`,
      update: (propertyId: number, bookingId: number) => `/properties/${propertyId}/bookings/${bookingId}`,
      delete: (propertyId: number, bookingId: number) => `/properties/${propertyId}/bookings/${bookingId}`,
      availability: (propertyId: number) => `/properties/${propertyId}/bookings/availability`,
    },
  },
  orders: {
    get: (orderId: number) => `/orders/${orderId}`,
    list: '/orders',
    post: '/orders',
  },
  facilities: {
    get: (facilityId: number) => `/facilities/${facilityId}`,
    list: '/facilities',
    post: '/facilities',
  },
  invoices: {
    get: (invoiceId: number) => `/invoices/${invoiceId}`,
    list: '/invoices',
    post: '/invoices',
  },
};
