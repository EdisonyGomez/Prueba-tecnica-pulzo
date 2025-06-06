import { HttpClient } from '@angular/common/http';
import { Character } from './../../domain/characters/models/character';
import { inject, Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharactersApi {
  private http = inject(HttpClient);


  getCharacters(): Observable<Character[]> {
    return this.http.get<{ results: Character[] }>(`${environment.apiUrl}/character/`).pipe(
      map(response => response.results.map((character: Character) => ({
        name: character.name,
        image: character.image,
        status: character.status,
        genre: character.genre
      }))),
    )
  }

}