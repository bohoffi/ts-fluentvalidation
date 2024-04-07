import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgDocNavbarComponent, NgDocRootComponent, NgDocSidebarComponent } from '@ng-doc/app';
import { VERSION } from '@ts-fluentvalidation/core';

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet, NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly libName = '@ts-fluentvalidation';
  protected readonly libVersion = VERSION;
}
