export declare interface GetSingleRestourantTranslateByCodeRequest{
    languageCode: string;
    translateCode: string;
    restourant_id: string;
  }
  
  export declare interface GetSingleRestourantTranslateByCodeResponse{
    value: string
    code: string
    restourant_id: string
  }