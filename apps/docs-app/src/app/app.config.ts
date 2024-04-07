import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import {
  NG_DOC_DEFAULT_PAGE_PROCESSORS,
  NG_DOC_DEFAULT_PAGE_SKELETON,
  NgDocDefaultSearchEngine,
  provideNgDocApp,
  provideMainPageProcessor,
  providePageSkeleton,
  provideSearchEngine
} from '@ng-doc/app';
import { NG_DOC_ROUTING, provideNgDocContext } from '@ng-doc/generated';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide context of the generated documentation
    provideNgDocContext(),
    // Provide default configuration for the documentation app
    provideNgDocApp({ defaultThemeId: 'auto' }),
    provideSearchEngine(NgDocDefaultSearchEngine),
    providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
    provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
    // Provide animations
    provideAnimations(),
    // Provide HttpClient with interceptors (NgDoc uses interceptors)
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    // Add generated routes to the application
    provideRouter(
      NG_DOC_ROUTING,
      // Enable anchor scrolling
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions()
    )
  ]
};
