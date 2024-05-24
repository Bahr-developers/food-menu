export declare interface UpdateRestourantTranslateRequest {
  id: string;
  status?: 'active' | 'inactive';
  definition?: Record<string, string>;
}
