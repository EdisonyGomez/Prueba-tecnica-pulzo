import { Injectable } from "@angular/core";
import { CharacterRepository } from "../repositories/character.repository";
import { Character } from "../models/character";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GetCharacterUseCase {

    constructor(private characterRepository: CharacterRepository) { }

    /**
     * Ejecuta el caso de uso para obtener personajes
     * @param page Número de página a recuperar
     * @param filters Filtros de búsqueda opcionales:
     *   - name: Nombre del personaje
     *   - status: Estado (vivo/muerto/desconocido)
     *   - gender: Género
     * @returns Observable con la respuesta paginada de personajes
     */
    execute(page: number , filters: {name?: string, status?: string, gender?: string} ): Observable<{info: any, results: Character[]}> {
        return this.characterRepository.getCharacters(page, filters);
    }

}