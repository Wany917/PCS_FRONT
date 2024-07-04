import axios from 'axios';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:3333' });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

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
      put : (userId: number) => `/users/${userId}/avatar/`,
    },
  },
  societies: {
    get: (societyId: number) => `/societies/${societyId}`,
    list: '/societies',
    post: '/societies',
    put: (societyId: number) => `/societies/${societyId}`,
    avatar: {
      get: (avatarId: string) => `http://localhost:3333/uploads/avatar/${avatarId}`,
      put : (societyId: number) => `/societies/${societyId}/avatar/`,
    },
  },
  properties: {
    get: (propertyId: string) => `/properties/${propertyId}`,
    list: '/properties',
    post: '/properties',
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
};
