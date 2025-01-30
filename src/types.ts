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

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptins: string[];
}

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

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

export type ImageField = { file: File };

export type CreateProductData = Product & { image: ImageField };
