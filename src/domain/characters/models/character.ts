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
    };
    location:    {
        name: string;
    };
    episode: string[];
}