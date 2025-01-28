export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenant: Tenant | null;
};

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  passwor: string;
  role: string;
  tenantId: number;
};

export type Tenant = {
  id: number;
  name: string;
  address: string;
};

export type CreateTenantData = {
  name: string;
  address: string;
};

export type FieldData = {
  name: string[];
  value?: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: Category;
  status: boolean;
  createdAt: string;
  image: string;
  isPublish: boolean;
};
