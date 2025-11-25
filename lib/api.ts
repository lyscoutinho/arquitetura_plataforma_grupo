import axios from 'axios';
import { parseCookies } from 'nookies';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { 'engnet.token': token } = parseCookies();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Erro na requisição:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
    if (error.response && error.response.data) {
      const mensagem = error.response.data.message || error.response.data.error || error.response.data?.errors?.[0] || 'Erro na requisição';
      return Promise.reject(new Error(mensagem));
    }
    
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Não conseguiu conectar ao servidor (localhost:3001). Verifique se a API está rodando.'));
    }
    
    return Promise.reject(new Error(error.message || 'Erro desconhecido'));
  }
);

export const apiLogin = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

// Usuários/Membros
export const apiGetUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const apiCreateUser = async (userData: any) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const apiUpdateUser = async (id: string, userData: any) => {
  const { data } = await api.patch(`/users/${id}`, userData);
  return data;
};

export const apiDeleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

// Clientes
export const apiGetClientes = async () => {
  const { data } = await api.get('/clientes');
  return data;
};

export const apiCreateCliente = async (clienteData: any) => {
  const { data } = await api.post('/clientes', clienteData);
  return data;
};

export const apiUpdateCliente = async (id: string, clienteData: any) => {
  const { data } = await api.patch(`/clientes/${id}`, clienteData);
  return data;
};

export const apiDeleteCliente = async (id: string) => {
  const { data } = await api.delete(`/clientes/${id}`);
  return data;
};

// Contratos
export const apiGetContratos = async () => {
  const { data } = await api.get('/contratos');
  return data;
};

export const apiGetContratoById = async (id: string) => {
  const { data } = await api.get(`/contratos/${id}`);
  return data;
};

export const apiCreateContrato = async (contratoData: any) => {
  const { data } = await api.post('/contratos', contratoData);
  return data;
};

export const apiUpdateContrato = async (id: string, contratoData: any) => {
  const { data } = await api.patch(`/contratos/${id}`, contratoData);
  return data;
};

export const apiDeleteContrato = async (id: string) => {
  const { data } = await api.delete(`/contratos/${id}`);
  return data;
};

// Reembolsos
export const apiGetReembolsos = async () => {
  const { data } = await api.get('/reembolsos');
  return data;
};

export const apiGetReembolsoById = async (id: string) => {
  const { data } = await api.get(`/reembolsos/${id}`);
  return data;
};

export const apiCreateReembolso = async (reembolsoData: any) => {
  const { data } = await api.post('/reembolsos', reembolsoData);
  return data;
};

export const apiUpdateReembolso = async (id: string, reembolsoData: any) => {
  const { data } = await api.patch(`/reembolsos/${id}`, reembolsoData);
  return data;
};

export const apiUpdateReembolsoStatus = async (id: string, status: string) => {
  const { data } = await api.patch(`/reembolsos/${id}/status`, { status });
  return data;
};

export const apiDeleteReembolso = async (id: string) => {
  const { data } = await api.delete(`/reembolsos/${id}`);
  return data;
};

// Relatórios
export const apiGetRelatorios = async () => {
  const { data } = await api.get('/relatorios');
  return data;
};

export const apiGetRelatorioById = async (id: string) => {
  const { data } = await api.get(`/relatorios/${id}`);
  return data;
};

export const apiCreateRelatorio = async (relatorioData: any) => {
  const { data } = await api.post('/relatorios', relatorioData);
  return data;
};

export const apiDownloadRelatorio = async (id: string) => {
  const { data } = await api.get(`/relatorios/${id}/download`, {
    responseType: 'blob',
  });
  return data;
};

// Dashboard
export const apiGetDashboardData = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};

export { api };