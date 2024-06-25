import { Component } from '@angular/core';
import { faThumbsUp, faThumbsDown, faSmile,faFaceFrown  } from '@fortawesome/free-solid-svg-icons';
import {  faExclamationTriangle, faTemperatureHigh, faSun } from '@fortawesome/free-solid-svg-icons';
import {  faMeh, faFrown, faSadTear } from '@fortawesome/free-solid-svg-icons';
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
  faExclamationTriangle = faExclamationTriangle;
  faTemperatureHigh = faTemperatureHigh;
  faSun = faSun;
  faMeh = faMeh;
  faFrown = faFrown;
  faSadTear = faSadTear;

  getIconForHumidity(): any {
    if (this.weatherService.todaysHighlight.humidity < 30) {
      return this.faThumbsUp; // Or whatever icon you want for 'Low'
    } else if (this.weatherService.todaysHighlight.humidity >= 30 && this.weatherService.todaysHighlight.humidity <= 50) {
      return this.faSmile; // Or whatever icon you want for 'Normal'
    } else if (this.weatherService.todaysHighlight.humidity > 50 && this.weatherService.todaysHighlight.humidity <= 60) {
      return this.faMeh; // Or whatever icon you want for 'High'
    } else {
      return this.faFrown; // Or whatever icon you want for 'Very High'
    }
  }

  getIconForVisibility(): any {
    if (this.weatherService.todaysHighlight.visibility >= 30) {
      return this.faSmile; // Or whatever icon you want for 'Clear'
    } else if (this.weatherService.todaysHighlight.visibility >= 10) {
      return this.faMeh; // Or whatever icon you want for 'Moderate'
    } else if (this.weatherService.todaysHighlight.visibility >= 2) {
      return this.faFrown; // Or whatever icon you want for 'Low'
    } else {
      return this.faSadTear; // Or whatever icon you want for 'Poor'
    }
  }

  getIconForTemperature(): any {
    if (this.weatherService.todaysHighlight.feelsLike >= 44) {
      return this.faThumbsDown; // Or whatever icon you want for 'Hot'
    } else if (this.weatherService.todaysHighlight.feelsLike >= 41 && this.weatherService.todaysHighlight.feelsLike < 44) {
      return this.faExclamationTriangle; // Or whatever icon you want for 'Very Hot'
    } else if (this.weatherService.todaysHighlight.feelsLike >= 38 && this.weatherService.todaysHighlight.feelsLike < 41) {
      return this.faThumbsUp; // Or whatever icon you want for 'High Temperature'
    } else {
      return this.faSun; // Or whatever icon you want for 'Normal'
    }
  }
  

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
