// app.config.ts
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { routes } from './app.routes';

// Registra el locale español
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    // Configura el locale español y la zona horaria de Bolivia
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: 'DATE_PIPE_DEFAULT_OPTIONS',
      useValue: { timezone: 'America/La_Paz' },
    },
  ],
};
