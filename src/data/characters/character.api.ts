import { HttpClient } from '@angular/common/http';
import { Character } from './../../domain/characters/models/character';
import { inject, Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio que maneja la comunicación directa con la API de Rick and Morty.
 * Encapsula todas las operaciones HTTP relacionadas con personajes.
 */
export class CharactersApi {
  private http = inject(HttpClient);

 /**
   * Obtiene personajes paginados desde la API con filtros opcionales
   * @param page Número de página solicitada
   * @param filters Objeto con criterios de filtrado:
   *   - name: Cadena para buscar en nombres
   *   - status: Estado del personaje (alive/dead/unknown)
   *   - gender: Género del personaje
   * @returns Observable con la respuesta estructurada:
   *   - info: Metadatos de paginación
   *   - results: Array de personajes mapeados
   * En caso de error, retorna objeto vacío
   */
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
        },
        location: {
          name: character.location.name,
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