export declare interface UpdateFoodRequest {
  id: string;
  name?: object;
  description?: object;
  price?: string;
  preparing_time?: string;
  food_status?: 'available' | 'none' | 'preparing';
  status?: 'active' | 'inactive';
}
