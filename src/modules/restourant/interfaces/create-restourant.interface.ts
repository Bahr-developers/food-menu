export declare interface CreateSocilsInterface{
    link: string;
    social_id: string
}


export declare interface CreateRestourantInterface {
    name: string;
    description?: string;
    location?: string;
    tel?: string;
    service_percent?: string;
    socials?: CreateSocilsInterface[];
    image:any;
}