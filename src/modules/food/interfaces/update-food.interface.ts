export declare interface UpdateFoodRequest {
  id: string;
  name?: object;
  description?: object;
  price?: string;
  preparing_time?: object;
  food_status?: 'available' | 'none' | 'preparing';
  status?: 'active' | 'inactive';
}
