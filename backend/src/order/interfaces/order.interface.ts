export interface Order {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export interface OrderResult extends Order {
  id: string;
  status: 'confirmed' | 'rejected';
  message?: string;
}
