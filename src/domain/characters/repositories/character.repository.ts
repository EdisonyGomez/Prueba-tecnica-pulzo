import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Character } from "../models/character";

@Injectable({
    providedIn: "root",
})

export abstract class CharacterRepository{

    /**
     * Obtiene personajes paginados con filtros opcionales
     * @param page Número de página a cargar
     * @param filters Objeto con filtros aplicables:
     *   - name: Filtro por nombre del personaje
     *   - status: Filtro por estado (vivo/muerto/desconocido)
     *   - gender: Filtro por género
     * @returns Observable con objeto que contiene:
     *   - info: Metadatos de paginación
     *   - results: Array de personajes
     */
    abstract getCharacters(page: number , filters: {name?: string, status?: string, gender?: string} ): Observable<{info: any, results: Character[]}>;
}