import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { Time } from "@angular/common";

import { TemperatureData } from '../Models/TemperatureData';
import { todayData } from '../Models/todayData';
import { weekData } from '../Models/weekData';
import { todaysHighlight } from '../Models/todaysHighlight';
import { Observable } from 'rxjs';
import { environmentVariables } from '../Environment/environmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  currentTime: Date;
  cityName: string = 'USA';

  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  // Variables that have the extracted Data from the API Endpoints
  temperatureData: TemperatureData = new TemperatureData();
  todayData: todayData[] = [];
  weekData: weekData[] = [];
  todaysHighlight: todaysHighlight = new todaysHighlight();

  constructor(private httpClient: HttpClient) {
    this.getData();
    
  }

  formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  fillTemperatureDataModel() {
    // setting left Container Data model Properties
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

  //Method to fill week model
  fillWeekDataModel() {
    var weekCount = 0;

    while (weekCount < 8) { // Use less than 8 to correctly iterate for 7 days
      this.weekData.push(new weekData());
      const date = new Date(this.weatherDetails!.forecast.forecastday[weekCount].date);
      this.weekData[weekCount].day = this.formatDate(date, { weekday: 'long' });
      this.weekData[weekCount].tempMax = this.weatherDetails.forecast.forecastday[weekCount].day.maxtemp_c.toString();
      this.weekData[weekCount].tempMin = this.weatherDetails.forecast.forecastday[weekCount].day.mintemp_c.toString();
      this.weekData[weekCount].summaryImage = this.weatherDetails!.forecast.forecastday[weekCount].day.condition.icon;
      weekCount++;
    }
  }

  fillTodayData() {
    var todayCount = 0;
    while (todayCount < 24) { // Use less than 24 to correctly iterate for the day's hours
      let todayDataInstance = new todayData();
      todayDataInstance.time = this.weatherDetails.forecast.forecastday[0].hour[todayCount].time.split(" ")[1];
      todayDataInstance.summaryImage = this.weatherDetails.forecast.forecastday[0].hour[todayCount].condition.icon;
      todayDataInstance.temperature = this.weatherDetails.forecast.forecastday[0].hour[todayCount].temp_c;
      this.todayData.push(todayDataInstance);
      todayCount += 3;
    }
  }

  //Method to get TOday's Highlight Data from the  Base variable

  fillTodaysHighlight() {
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
    return celsius * 9 / 5 + 32;
  }

  fahrenheitToCelsius(fahrenheit: number) {
    return (fahrenheit - 32) * 5 / 9;
  }

  getLocationDetails(q: string): Observable<LocationDetails> {
    return this.httpClient.get<LocationDetails>(environmentVariables.weatherApiLocationBaseURL, {
      headers: new HttpHeaders()
        .set(environmentVariables.key_name, environmentVariables.key),
      params: new HttpParams()
        .set('q', q)
    });
  }

  getWeatherDetails(q: string, days: number): Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(environmentVariables.weatherApiForecastBaseURL, {
      headers: new HttpHeaders()
        .set(environmentVariables.key_name, environmentVariables.key),
      params: new HttpParams()
        .set('q', q)
        .set('days', days.toString())
    });
  }

  getData() {
    // Implement the logic to get the data
    var days = 9;
    this.getLocationDetails(this.cityName).subscribe({
      next: (response) => {
        this.locationDetails = response;
        console.log(this.locationDetails);
    
      }
    });

    this.getWeatherDetails(this.cityName, days).subscribe({
      next: (response) => {
        this.weatherDetails = response;
        this.prepareData();
        console.log(this.weatherDetails);
      }
    });
  }
}
