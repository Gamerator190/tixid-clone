import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeatPickerComponent } from './seat-picker';

@Component({
  selector: 'app-seat-picker-page',
  standalone: true,
  imports: [CommonModule, SeatPickerComponent],
  templateUrl: './seat-picker-page.component.html',
  styleUrls: ['./seat-picker-page.component.css'],
})
export class SeatPickerPageComponent implements OnInit {
  eventId: string | null = null;
  time!: string;
  ticketCategories: any[] = [];
  seatConfiguration: any[] = [];
  bookedSeats: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.time = String(this.route.snapshot.paramMap.get('time'));

    if (!this.eventId) {
      alert('Error: Event ID is missing.');
      this.router.navigate(['/home']);
      return;
    }

    const eventsJson = localStorage.getItem('pf-events');
    if (eventsJson) {
      const events = JSON.parse(eventsJson);
      const currentEvent = events.find((event: any) => event.id === this.eventId || event._id === this.eventId);

      if (currentEvent) {
        this.ticketCategories = currentEvent.ticketCategories || [];
        this.seatConfiguration = currentEvent.seatConfiguration || [];
        this.bookedSeats = currentEvent.bookedSeats || [];
      } else {
        alert('Error fetching event data from local storage.');
        this.router.navigate(['/home']);
      }
    } else {
        alert('Error fetching event data. No local event cache found.');
        this.router.navigate(['/home']);
    }
  }

  handleGoBack() {
    this.router.navigate(['/event', this.eventId]);
  }

  handleContinue({ seatData, categoryTable }: { seatData: string; categoryTable: any }) {
    this.router.navigate(
      [
        '/checkout',
        this.eventId,
        this.time,
        seatData,
      ],
      {
        state: { categoryTable: categoryTable }
      }
    );
  }
}
