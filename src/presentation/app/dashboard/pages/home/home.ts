import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Character } from '@domain/characters/models/character';
import { GetCharacterUseCase } from '@domain/characters/useCases/get-character.useCase';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default  class Home {

  characters: Character[] = [];


  private destroy$ = new Subject<void>();

  private getCharactersUseCase = inject(GetCharacterUseCase);

  constructor() {  

  }
  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters() {
    this.getCharactersUseCase.excecute().subscribe({
      next: (characters: Character[]) => {
        this.characters = characters;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
      }
    });
  }
}
