import { CharactersApi } from './character.api';
import { CharacterRepository } from '@domain/characters/repositories/character.repository';
import { Character } from './../../domain/characters/models/character';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CharacterRepositoryImpl extends CharacterRepository {
 

    constructor( private charactersApi: CharactersApi) {
        super();
    }

   override getCharacters(page:number,filters: {name?: string, status?: string, gender?: string}): Observable<{info: any, results: Character[]}> {
        return this.charactersApi.getCharacters(page, filters);
    } 
  

}