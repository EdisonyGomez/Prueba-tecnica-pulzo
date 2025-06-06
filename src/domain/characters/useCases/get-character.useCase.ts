import { Injectable } from "@angular/core";
import { CharacterRepository } from "../repositories/character.repository";
import { Character } from "../models/character";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GetCharacterUseCase {

    constructor(private characterRepository: CharacterRepository) { }

    excecute(page: number , filters: {name?: string, status?: string, gender?: string} ): Observable<{info: any, results: Character[]}> {
        return this.characterRepository.getCharacters(page, filters);
    }

}