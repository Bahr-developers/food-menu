export declare interface UpdateFoodRequest {
  id: string;
  name?: object;
  description?: object;
  price?: string;
  images?: any;
  food_status?: 'available' | 'none' | 'preparing';
}
