import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Chapter } from '../../shared/models/chapter';
import { Progress } from '../../shared/models/reader';
import { ChaptersService } from '../../shared/services/chapters.service';
import { SaveService } from '../../shared/services/save.service';
import { OptionComponent } from '../../shared/ui/option/option.component';
import { ReaderLayoutComponent } from '../../shared/ui/reader-layout/reader-layout.component';

@Component({
  selector: 'app-chapters',
  imports: [ReaderLayoutComponent, OptionComponent, RouterLink],
  templateUrl: './chapters.component.html',
})
export class ChaptersComponent implements OnInit {
  chapters: Chapter[] = [];
  progress?: Progress;

  faBars = faBars;

  constructor(
    private chaptersService: ChaptersService,
    private saveService: SaveService,
  ) {}

  ngOnInit() {
    this.chaptersService.chapters$.subscribe((chapters) => {
      this.chapters = chapters.filter((e) => e.reader);
    });
    this.progress = this.saveService.getMaxProgress();
  }
}
