import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { ProgressComponent } from '../../shared/ui/progress/progress.component';
import { ReaderLayoutComponent } from '../../shared/ui/reader-layout/reader-layout.component';

interface Glossary {
  characters: string[];
  locations: string[];
}

@Component({
  selector: 'app-glossary',
  imports: [ReaderLayoutComponent, RouterLink, ProgressComponent],
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
})
export class GlossaryComponent implements OnInit {
  characters: string[] = [];
  locations: string[] = [];

  faBook = faBook;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Glossary>('glossary/_main.json').subscribe((data) => {
      this.characters = data.characters;
      this.locations = data.locations;
    });
  }
}
