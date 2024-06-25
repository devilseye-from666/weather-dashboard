
WeatherDashboard Architecture

Overview
The WeatherDashboard is an Angular application structured for clarity and separation of concerns, displaying weather information efficiently.

Project Structure
The project is organized into:

1. Components
2. Models
3. Services
4. Environment Variables
5. Assets
6. Root Files

Components

Left Container Component
Path: src/app/left-container
Purpose: Displays weather details like today's highlights and weekly forecast.

Right Container Component
Path: src/app/right-container
Purpose: Handles user interactions such as location selection and settings.

Models
Located in src/app/Models, these define data structures:

LocationDetails.ts
TemperatureData.ts
TodayData.ts
TodaysHighlight.ts
WeatherDetails.ts
WeekData.ts

Services

Weather Service
Path: src/app/Services/weather.service.ts
Purpose: Fetches and processes weather data from external APIs.

Environment Variables
File: environmentVariables.ts
Purpose: Stores configuration settings like API keys and base URLs.

Assets
Path: src/assets
Purpose: Contains static assets like images and stylesheets.

Root Files

app-routing.module.ts: Configures routes.

app.component.*: Root component files.

app.module.ts: Root module.

index.html and main.ts: Entry points.

styles.scss: Global styles.

favicon.ico: Browser tab icon.

Development Workflow

Development Server: ng serve -o



Conclusion
The WeatherDashboard is structured for maintainability and scalability, with clear separation of components, services, and models. Environment variables and services promote a clean, organized codebase.
