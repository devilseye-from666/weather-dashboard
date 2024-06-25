import { Component } from '@angular/core';
import { faThumbsUp, faThumbsDown, faSmile,faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';



@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.scss']
})
export class RightContainerComponent {

  constructor(public weatherService: WeatherService){};
  //icons
  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
  faSmile:any = faSmile;
  faFaceFrown:any=faFaceFrown;


  

  onTodayClick() {
    this.weatherService.today = true;
    this.weatherService.week = false;
  }

  onWeekClick() {
    this.weatherService.week = true;
    this.weatherService.today = false;
  }

  onCelsiusClick() {
    this.weatherService.celsius = true;
    this.weatherService.fahrenheit = false;
  }

  onFahrenheitClick() {
    this.weatherService.fahrenheit = true;
    this.weatherService.celsius = false;
  }
}
