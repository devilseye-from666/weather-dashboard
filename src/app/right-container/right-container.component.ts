import { Component } from '@angular/core';
import { faThumbsUp, faThumbsDown, faSmile,faFaceFrown } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.scss']
})
export class RightContainerComponent {
  //icons
  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
  faSmile:any = faSmile;
  faFaceFrown:any=faFaceFrown;


  today: boolean = true;
  week: boolean = false;

  celsius: boolean = true;
  fahrenheit: boolean = false;

  onTodayClick() {
    this.today = true;
    this.week = false;
  }

  onWeekClick() {
    this.week = true;
    this.today = false;
  }

  onCelsiusClick() {
    this.celsius = true;
    this.fahrenheit = false;
  }

  onFahrenheitClick() {
    this.fahrenheit = true;
    this.celsius = false;
  }
}
