import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.scss']
})
export class LeftContainerComponent {
  faMagnifyingGlass: any = faMagnifyingGlass;
  faLocation: any = faLocation;

  // Variables for Temp Summary
  faCloud: any = faCloud;
  faCloudRain: any = faCloudRain;

  loading: boolean = false;

  constructor(public weatherService: WeatherService) {}

  onSearch(location: string) {
    this.loading = true;
    this.weatherService.cityName = location;
    this.weatherService.getData().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch data:', err);
        this.loading = false;
      }
    });
  }
}
