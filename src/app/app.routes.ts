import { Routes } from '@angular/router';
import { ChapterComponent } from './views/chapter/chapter.component';
import { ChaptersComponent } from './views/chapters/chapters.component';
import { GlossaryComponent } from './views/glossary/glossary.component';
import { GlossaryWordComponent } from './views/glossary-word/glossary-word.component';
import { OptionsComponent } from './views/options/options.component';

export const routes: Routes = [
  { path: 'chapters', component: ChaptersComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'glossary', component: GlossaryComponent },
  { path: 'glossary/:word', component: GlossaryWordComponent },
  { path: 'chapter/:chapter', component: ChapterComponent },
  { path: '', redirectTo: '/chapter/0', pathMatch: 'full' },
];
