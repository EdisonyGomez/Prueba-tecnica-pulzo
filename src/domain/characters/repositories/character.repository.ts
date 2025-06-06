import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Character } from "../models/character";

@Injectable({
    providedIn: "root",
})

export abstract class CharacterRepository{

    abstract getCharacters(): Observable<Character[]>;
}