import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faBars,
  faBook,
  faBullseye,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Subscription } from 'rxjs';
import { Chapter, Highlight, Part } from '../../shared/models/reader';
import { ChaptersService } from '../../shared/services/chapters.service';
import { MusicService } from '../../shared/services/music.service';
import { SaveService } from '../../shared/services/save.service';
import { Theme } from '../../shared/services/theme.service';
import { TextPanelComponent } from '../../shared/ui/text-panel/text-panel.component';
import { ThemeButtonComponent } from '../../shared/ui/theme-button/theme-button.component';

@Component({
  selector: 'app-reader',
  imports: [
    FontAwesomeModule,
    RouterLink,
    ScrollPanelModule,
    TextPanelComponent,
    ThemeButtonComponent,
  ],
  templateUrl: './chapter.component.html',
})
export class ChapterComponent implements OnInit {
  @ViewChild('textPanel') textPanel?: TextPanelComponent;

  url?: number;
  data?: Chapter;
  currentPart?: Part;
  content = '';
  images: string[] = [];
  music?: string;
  glossary: Highlight[] = [];
  autoPlay = false;
  position = 0;
  theme?: Theme;
  scrollTop = 0;
  title = '';

  // icons
  faCog = faCog;
  faBook = faBook;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faBars = faBars;
  faBullseye = faBullseye;
  faArrowDown = faArrowDown;

  private subs = new Subscription();

  constructor(
    private http: HttpClient,
    private musicService: MusicService,
    private saveService: SaveService,
    private chaptersService: ChaptersService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  @HostListener('document:visibilitychange')
  appVisibility() {
    if (document.hidden && this.musicService.active) {
      this.autoPlay = true;
      this.musicService.pause();
    } else if (!document.hidden && this.autoPlay) {
      this.autoPlay = false;
      this.musicService.setActive(true);
    }
  }

  ngOnInit() {
    this.subs.add(
      this.route.paramMap.subscribe((paramMap) => {
        const chapterString = paramMap.get('chapter');
        if (chapterString) {
          this.loadChapter(+chapterString);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadChapter(chapter: number) {
    this.url = chapter;

    // display chapter content
    this.http
      .get(`chapters/chapter-${chapter}.txt`, {
        responseType: 'text',
      })
      .subscribe((data) => {
        this.content = this.parse(data);

        const progress = this.saveService.getCurrentProgress();
        if (progress.chapter === chapter) {
          this.scrollTop = progress.position;
        } else {
          this.scrollTop = 0;
          this.saveService.setCurrentProgress({
            chapter,
            position: 0,
          });
        }
      });

    // chapter title
    this.chaptersService.chapters$.subscribe((chapters) => {
      const found = chapters.find((e) => e.number === chapter);
      if (found) {
        this.title = found.title;
      }
    });
  }

  parse(data: string) {
    let content = data
      .split(/\r?\n/)
      .map((e) => `<p>${e}</p>`)
      .join('');

    const highlights: Highlight[] = [{ word: 'nibelheim', type: 'location' }];
    for (const highlight of highlights) {
      content = content.replace(
        new RegExp(`\\b(${highlight.word})\\b`, 'i'),
        (_match, p1: string) =>
          `<a href="glossary/${p1.toLowerCase()}" class="font-bold text-blue-600">${p1}</a>`,
      );
    }

    return content;
  }

  updateProgress(event: number) {
    this.position = event;
  }

  saveProgress(event: number) {
    if (this.url === undefined) throw new Error('No chapter specified');
    this.saveService.setCurrentProgress({ chapter: this.url, position: event });
  }

  late() {
    return this.saveService.late();
  }

  goToMaxProgress() {
    const progress = this.saveService.getCurrentProgress();
    const maxProgress = this.saveService.getMaxProgress();
    this.saveService.setCurrentProgress(maxProgress);
    if (progress.chapter !== maxProgress.chapter) {
      this.router.navigateByUrl(`/chapter/${maxProgress.chapter}`);
    } else {
      this.scrollTop = maxProgress.position;
    }
  }

  getForwardIcon() {
    return this.textPanel?.isBottom() ? faArrowRight : faArrowDown;
  }

  forward() {
    if (this.url === undefined) throw new Error('No url found');
    const nextChapter = this.url + 1;
    if (this.textPanel?.isBottom()) {
      this.router.navigateByUrl(`/chapter/${nextChapter}`);
    } else {
      this.textPanel?.forward();
    }
  }
}
