import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // withComponentInputBinding lets route params and ?query values arrive as input() signals.
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ],
};
