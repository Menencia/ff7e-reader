import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MusicService } from '../../shared/services/music.service';
import { ReaderLayoutComponent } from '../../shared/ui/reader-layout/reader-layout.component';

@Component({
  selector: 'app-options',
  imports: [
    ReaderLayoutComponent,
    SliderModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  musicActive?: boolean;
  musicVolume?: number;

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.musicActive = this.musicService.active;
    this.musicVolume = this.musicService.volume * 100;
  }

  changeMusicVolume(event: number) {
    this.musicService.setVolume(event / 100);
  }

  changeMusicActive(event: boolean) {
    this.musicService.setActive(event);
  }
}
