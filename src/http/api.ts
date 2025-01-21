import { CreateTenantData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (queryString: string) =>
  api.get(`/users?${queryString}`);

export const getTenants = () => api.get("/tenants");

export const createUsers = (user: CreateUserData) => api.post("/users", user);

export const updateUser = (user: CreateUserData, id: string) =>
  api.patch(`/users/${id}`, user);

export const createTenants = (tenant: CreateTenantData) =>
  api.post("/tenants", tenant);
