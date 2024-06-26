import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { todayData } from '../Models/todayData';
import { weekData } from '../Models/weekData';
import { todaysHighlight } from '../Models/todaysHighlight';
import { Observable, forkJoin } from 'rxjs';
import { environmentVariables } from '../Environment/environmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  currentTime: Date;
  today: boolean = true;
  week: boolean = false;

  celsius: boolean = true;
  fahrenheit: boolean = false;

  cityName: string = 'Guwahati';
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  temperatureData: TemperatureData = new TemperatureData();
  todayData: todayData[] = [];
  weekData: weekData[] = [];
  todaysHighlight: todaysHighlight = new todaysHighlight();

  constructor(private httpClient: HttpClient) {
    
    this.getData().subscribe();
  }

  formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  fillTemperatureDataModel() {
    if (!this.locationDetails) {
      console.error('Location details not available');
      return;
    }

    this.currentTime = new Date();
    const lastUpdated = this.locationDetails.location.localtime;
    const date = new Date(lastUpdated);
    this.temperatureData.day = this.formatDate(date, { weekday: 'long' });
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2, '0')}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;
    this.temperatureData.temperature = this.locationDetails.current.temp_c;
    this.temperatureData.location = `${this.locationDetails.location.name}, ${this.locationDetails.location.region}, ${this.locationDetails.location.country}`;
    this.temperatureData.rainPercentage = this.locationDetails.current.precip_mm;
    this.temperatureData.SummaryPhrase = this.locationDetails.current.condition.text;
    this.temperatureData.summaryImge = this.locationDetails.current.condition.icon;
  }

  fillWeekDataModel() {
    if (!this.weatherDetails) {
      console.error('Weather details not available');
      return;
    }

    this.weekData = [];
    for (let weekCount = 1; weekCount < 8; weekCount++) {
      this.weekData.push(new weekData());
      const date = new Date(this.weatherDetails.forecast.forecastday[weekCount].date);
      this.weekData[weekCount - 1].day = this.formatDate(date, { weekday: 'long' });
      this.weekData[weekCount - 1].tempMax = this.weatherDetails.forecast.forecastday[weekCount].day.maxtemp_c;
      this.weekData[weekCount - 1].tempMin = this.weatherDetails.forecast.forecastday[weekCount].day.mintemp_c;
      this.weekData[weekCount - 1].summaryImage = this.weatherDetails.forecast.forecastday[weekCount].day.condition.icon;
    }
  }

  fillTodayData() {
    if (!this.weatherDetails) {
      console.error('Weather details not available');
      return;
    }

    this.todayData = [];
    for (let todayCount = 3; todayCount < 24; todayCount += 3) {
      let todayDataInstance = new todayData();
      todayDataInstance.time = this.weatherDetails.forecast.forecastday[0].hour[todayCount].time.split(" ")[1];
      todayDataInstance.summaryImage = this.weatherDetails.forecast.forecastday[0].hour[todayCount].condition.icon;
      todayDataInstance.temperature = this.weatherDetails.forecast.forecastday[0].hour[todayCount].temp_c;
      this.todayData.push(todayDataInstance);
    }
  }

  fillTodaysHighlight() {
    if (!this.locationDetails || !this.weatherDetails) {
      console.error('Location or weather details not available');
      return;
    }

    this.todaysHighlight.uvIndex = this.locationDetails.current.uv;
    this.todaysHighlight.humidity = this.locationDetails.current.humidity;
    this.todaysHighlight.visibility = this.locationDetails.current.vis_km;
    this.todaysHighlight.feelsLike = this.locationDetails.current.feelslike_c;
    this.todaysHighlight.windStatus = this.locationDetails.current.wind_kph;
    this.todaysHighlight.sunrise = this.weatherDetails.forecast.forecastday[0].astro.sunrise;
    this.todaysHighlight.sunset = this.weatherDetails.forecast.forecastday[0].astro.sunset;
  }

  prepareData(): void {
    this.fillTemperatureDataModel();
    this.fillWeekDataModel();
    this.fillTodayData();
    this.fillTodaysHighlight();
    console.log(this.temperatureData);
    console.log(this.weekData);
    console.log(this.todayData);
    console.log(this.todaysHighlight);
  }

  celsiusToFahrenheit(celsius: number) {
    return (celsius * 9 / 5 + 32).toFixed(1);
  }
  
  fahrenheitToCelsius(fahrenheit: number) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(1);
  }

  getLocationDetails(q: string): Observable<LocationDetails> {
    return this.httpClient.get<LocationDetails>(environmentVariables.weatherApiLocationBaseURL, {
      headers: new HttpHeaders().set(environmentVariables.key_name, environmentVariables.key),
      params: new HttpParams().set('q', q)
    });
  }

  getWeatherDetails(q: string, days: number): Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(environmentVariables.weatherApiForecastBaseURL, {
      headers: new HttpHeaders().set(environmentVariables.key_name, environmentVariables.key),
      params: new HttpParams().set('q', q).set('days', days.toString())
    });
  }

  getData(): Observable<void> {
    
    const days = 9;
    return new Observable(observer => {
      this.getLocationDetails(this.cityName).subscribe({
        next: (locationResponse) => {
          this.locationDetails = locationResponse;
          console.log(this.locationDetails);

          this.getWeatherDetails(this.cityName, days).subscribe({
            next: (weatherResponse) => {
              this.weatherDetails = weatherResponse;
              this.prepareData();
              console.log(this.weatherDetails);
              observer.next();
              observer.complete();
            },
            error: (err) => {
              console.error('Failed to fetch weather details:', err);
              observer.error(err);
            }
          });
        },
        error: (err) => {
          console.error('Failed to fetch location details:', err);
          observer.error(err);
        }
      });
    });
  }
}
