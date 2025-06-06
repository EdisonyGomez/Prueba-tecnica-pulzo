import { Episode } from "./episode";

export interface Character {
    id: any;
    name: string;
    image: string;
    status: string;
    gender: string;
    species: string;
    origin:    {
        name: string;
        url: string;
    };
    location:    {
        name: string;
        url: string;
    };
    episode: Episode[];
}