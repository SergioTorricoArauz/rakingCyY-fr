// src/app/shared/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuarioNombre: string | null = null;

  constructor(
    public authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.usuarioNombre = this.authService.getCurrentUserNombre();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.usuarioNombre = this.authService.getCurrentUserNombre();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
