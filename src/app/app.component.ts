import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  ocultarNavbar = false;

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.ocultarNavbar =
          event.urlAfterRedirects.startsWith('/login') ||
          event.urlAfterRedirects.startsWith('/register');
      });
  }
}
