import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Character } from "../models/character";

@Injectable({
    providedIn: "root",
})

export abstract class CharacterRepository{

    abstract getCharacters(page: number , filters: {name?: string, status?: string, gender?: string} ): Observable<{info: any, results: Character[]}>;
}