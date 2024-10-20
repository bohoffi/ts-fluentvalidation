import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgDocNavbarComponent, NgDocRootComponent, NgDocSidebarComponent, NgDocThemeToggleComponent } from '@ng-doc/app';
import { NgDocIconComponent, NgDocButtonIconComponent } from '@ng-doc/ui-kit';
import { VERSION } from '@ts-fluentvalidation/core';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgDocButtonIconComponent,
    NgDocIconComponent,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocThemeToggleComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly libName = '@ts-fluentvalidation';
  protected readonly libVersion = VERSION;
}
