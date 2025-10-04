import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ThemeService from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.setupTheme();
  }
}
