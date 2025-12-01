import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for @if, @else
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waitlist',
  standalone: true, // Mark as standalone
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule
  templateUrl: './waitlist.html',
  styleUrl: './waitlist.css',
})
export class WaitlistComponent { // Changed class name to WaitlistComponent
  email: string = '';
  phoneNumber: string = '';
  
  waitlistCapacity: number = 5; // Example capacity
  currentWaitlistCount: number = 0; // Mock current count
  isUserOnWaitlist: boolean = false; // Mock user's status

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/home']);
  }

  get isWaitlistClosed(): boolean {
    return this.currentWaitlistCount >= this.waitlistCapacity;
  }

  submitWaitlist() {
    if (!this.email && !this.phoneNumber) {
      alert('Please provide at least one contact method (email or phone number).');
      return;
    }

    if (this.isWaitlistClosed) {
      alert('The waitlist is currently full. Please try again later.');
      return;
    }

    // Simulate adding to waitlist
    this.currentWaitlistCount++;
    this.isUserOnWaitlist = true;
    
    // In a real application, you would send this data to a backend service.
    alert('Thank you for joining the waitlist! We will notify you if tickets become available.');
    // Optionally clear form or redirect, but for demonstration, keep form to show "Leave Waitlist"
    // this.router.navigate(['/home']);
  }

  leaveWaitlist() {
    if (confirm('Are you sure you want to leave the waitlist?')) {
      // Simulate leaving waitlist
      this.currentWaitlistCount--;
      this.isUserOnWaitlist = false;
      this.email = ''; // Clear contact details
      this.phoneNumber = '';
      alert('You have successfully left the waitlist.');
    }
  }
}