import { CharactersApi } from './character.api';
import { CharacterRepository } from '@domain/characters/repositories/character.repository';
import { Character } from './../../domain/characters/models/character';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

/**
 * Implementación concreta del repositorio de personajes que usa la API.
 * Conecta la capa de dominio con la fuente de datos externa.
 */
export class CharacterRepositoryImpl extends CharacterRepository {

    /**
     * @param charactersApi Servicio que maneja la comunicación con la API externa
    */
    constructor(private charactersApi: CharactersApi) {
        super();
    }

    /**
     * Obtiene personajes paginados desde la API con filtros opcionales
     * @param page Número de página solicitada
     * @param filters Objeto con posibles filtros:
     *   - name: Filtro por nombre (cadena parcial)
     *   - status: Filtro por estado (vivo/muerto/desconocido)
     *   - gender: Filtro por género
     * @returns Observable con la respuesta paginada:
     *   - info: Metadatos de paginación
     *   - results: Lista de personajes
     */
    override getCharacters(page: number, filters: { name?: string, status?: string, gender?: string }): Observable<{ info: any, results: Character[] }> {
        return this.charactersApi.getCharacters(page, filters);
    }


}