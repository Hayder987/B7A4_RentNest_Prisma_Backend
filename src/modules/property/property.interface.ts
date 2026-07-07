import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface ICreateProperty {
  title: string;
  description: string;
  location: string;
  price: number;
  image?: string;
  available?: boolean;
  categoryId: string;
}

export interface IPropertyFilterRequest extends PropertyWhereInput {
  location?: string;
  searchTerm?: string,
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
