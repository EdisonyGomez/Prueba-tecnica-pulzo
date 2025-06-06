import { HttpClient } from '@angular/common/http';
import { Character } from './../../domain/characters/models/character';
import { inject, Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharactersApi {
  private http = inject(HttpClient);


getCharacters(page: number , filters: {name?: string, status?: string, gender?: string} = {}): Observable<{info: any, results: Character[]}> {
  let url = `${environment.apiUrl}/character/?page=${page}`;
  
  // Añadir filtros a la URL si están presentes
  if (filters.name) url += `&name=${encodeURIComponent(filters.name)}`;
  if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`;
  if (filters.gender) url += `&gender=${encodeURIComponent(filters.gender)}`;

  return this.http.get<{info: any, results: Character[]}>(url).pipe(
    map(response => ({
      info: response.info,
      results: response.results.map((character: Character) => ({
        id: character.id,
        name: character.name,
        image: character.image,
        status: character.status,
        gender: character.gender,
        species: character.species,
        origin: {
          name: character.origin.name,
          url: character.origin.url
        },
        location: {
          name: character.location.name,
          url: character.location.url
        },
        episode: character.episode
      }))
    })),
    catchError(error => {
      console.error('Error fetching characters:', error);
      return of({info: {}, results: []});
    })
  );
}

}