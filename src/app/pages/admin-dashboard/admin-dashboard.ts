import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  name: string;
  email: string;
  password: string;
  role?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  activeChoice: 'analytics-reports' | 'register' | '' = 'analytics-reports';

  // User properties
  userName = 'Admin';
  showMenu = false;

  // Register form properties
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'attendee';
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('tix-current-user');

    if (!userJson) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userJson);
      this.userName = user.name || 'Admin';
    } catch {
      this.userName = 'Admin';
    }
  }

  showChoice(choice: 'analytics-reports' | 'register' | '') {
    this.activeChoice = choice;
  }

  toggleUserMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    localStorage.removeItem('tix-current-user');
    this.router.navigate(['/login']);
  }

  private getUsersFromStorage(): User[] {
    const usersJson = localStorage.getItem('tix-users');
    if (!usersJson) return [];
    try {
      return JSON.parse(usersJson) as User[];
    } catch {
      return [];
    }
  }

  private saveUsersToStorage(users: User[]) {
    localStorage.setItem('tix-users', JSON.stringify(users));
  }

  register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      alert('All fields are required!');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Password confirmation does not match.');
      return;
    }

    const users = this.getUsersFromStorage();
    const already = users.find((u) => u.email === this.email);

    if (already) {
      alert('This email is already registered, please use a different email.');
      return;
    }

    const newUser: User = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };

    this.isLoading = true;

    setTimeout(() => {
      users.push(newUser);
      this.saveUsersToStorage(users);

      this.isLoading = false;
      alert('Registration successful!');

      // Reset form
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.role = 'attendee';
      this.showChoice('');
    }, 600);
  }
}
