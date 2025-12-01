import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Define the Event interface, consistent with home.ts and dashboard.ts
interface Event {
  id: number | string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  poster?: string;
  isNew?: boolean;
  isSpecial?: boolean;
  promo?: any[];
  ticketCategories?: any[];
  seatConfiguration?: { row: string; category: string }[];
  bookedSeats?: string[];
  availableSeats: number; // Required
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null; // Cast to Event type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const eventsJson = localStorage.getItem('pf-events');
    let events: any[] = [];

    if (eventsJson) {
      events = JSON.parse(eventsJson);
    }

    const foundEvent = events.find((m: any) => m.id === id); // Find the event

    if (!foundEvent) {
      alert('Event not found');
      this.router.navigate(['/home']);
      return;
    }

    // Calculate availableSeats and assign to this.event
    const totalSeats = foundEvent.seatConfiguration ? foundEvent.seatConfiguration.length * 30 : 0;
    const bookedSeatsCount = foundEvent.bookedSeats ? foundEvent.bookedSeats.length : 0;
    
    this.event = {
      ...foundEvent,
      availableSeats: totalSeats - bookedSeatsCount
    };
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  buyTicket() {
    // Ensure this.event is not null before accessing its properties
    if (this.event) {
      this.router.navigate(['/event', this.event.id, this.event.time, 'seats']);
    }
  }

  joinWaitlist() {
    // For now, navigate to a placeholder 'waitlist' page.
    // This page will need to be implemented separately.
    this.router.navigate(['/waitlist']);
  }
}
