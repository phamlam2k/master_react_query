export interface IProductItem {
  collectionId: string;
  collectionName: string;
  created: string;
  description: string;
  id: string;
  name: string;
  price: string;
  updated: string;
}

export interface IProductItemDataRepsonse {
  items: IProductItem[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
