import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { ProgressComponent } from '../../shared/ui/progress/progress.component';
import { ReaderLayoutComponent } from '../../shared/ui/reader-layout/reader-layout.component';

interface Word {
  notes: Note[];
}

interface Note {
  condition: string;
  content: string;
}

@Component({
  selector: 'app-glossary-word',
  imports: [ReaderLayoutComponent, ProgressComponent],
  templateUrl: './glossary-word.component.html',
  styleUrls: ['./glossary-word.component.scss'],
})
export class GlossaryWordComponent implements OnInit {
  word?: string;
  notes: Note[] = [];

  faBook = faBook;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.word = this.route.snapshot.paramMap.get('word') ?? '';
    this.http.get<Word>(`glossary/${this.word}.json`).subscribe((data) => {
      this.notes = data.notes;
    });
  }
}
