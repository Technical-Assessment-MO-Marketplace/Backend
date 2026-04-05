export class OrderItemResponseDto {
  id?: number;
  quantity?: number;
  price?: number;
  product?: {
    id: number;
    name: string;
    description: string;
  };
  variant?: {
    id: number;
    combination_key: string;
    price: number;
    stock: number;
  };
}

export class OrderResponseDto {
  id?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  total_amount?: number;
  status?: string;
  created_at?: Date;
  items?: OrderItemResponseDto[];
}
