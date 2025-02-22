import { CreateTenantData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
export const CATALOG_SERVICE = "/api/catalog";
export const ORDER_SERVICE = "/api/order";

// Auth service
export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);

export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);

export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);

export const getUsers = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/users?${queryString}`);

export const getTenants = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);

export const createUsers = (user: CreateUserData) =>
  api.post(`${AUTH_SERVICE}/users`, user);

export const updateUser = (user: CreateUserData, id: string) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);

export const createTenants = (tenant: CreateTenantData) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);

// Catalog service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);

export const getProducts = (queryString: string) =>
  api.get(`${CATALOG_SERVICE}/products?${queryString}`);

export const createProduct = (productData: FormData) =>
  api.post(`${CATALOG_SERVICE}/products`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (productData: FormData, productId: string) =>
  api.put(`${CATALOG_SERVICE}/products/${productId}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCategory = (id: string) =>
  api.get(`${CATALOG_SERVICE}/categories/${id}`);

export const getOrders = (tenantId: string) =>
  api.get(`${ORDER_SERVICE}/orders?${tenantId}`);

export const getSingleOrder = (orderId: string, queryString: string) =>
  api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`);
