import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service'; // Import NotificationService

interface Event {
  id: number | string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  email?: string;
  poster?: string;
  isNew?: boolean;
  isSpecial?: boolean;
  promo?: any[];
  ticketCategories?: any[];
  seatConfiguration?: { row: string; category: string }[];
  bookedSeats?: string[];
}

interface SeatSelection {
  seat: string;
  typeCode: string; // VIP | REG | SNR | CHD
}

interface Ticket {
  event: Event; // Now stores the full Event object
  poster: string;
  time: string; // This is event time, not ticket purchase time
  seats: string[];
  total: number;
  purchaseDate: string; // New property for purchase date
  seatDetails?: SeatSelection[];
  categoryTable?: Record<string, { name: string; price: number }>;
  appliedPromo?: any;
  discountAmount?: number;
  isRead: boolean; // Added isRead flag
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class NotificationsComponent implements OnInit {
  tickets: Ticket[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService // Inject service
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('pf-tickets');
    if (raw) {
      try {
        let list: Ticket[] = JSON.parse(raw); // Use let to allow modification

        // fallback for older tickets and mark new tickets as read
        this.tickets = list.map((t) => {
          if (!t.seatDetails) {
            t.seatDetails = t.seats.map((s) => ({
              seat: s,
              typeCode: 'REG',
            }));
          }
          // Mark as read when displayed in notifications page
          if (typeof t.isRead === 'undefined' || t.isRead === false) {
              t.isRead = true;
          }
          return t;
        });
        localStorage.setItem('pf-tickets', JSON.stringify(this.tickets)); // Save updated list
        this.notificationService.updateUnreadCount(); // Update count via service
      } catch {
        this.tickets = [];
      }
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  formatRupiah(value: number): string {
    return value.toLocaleString('id-ID');
  }

  // Ringkasan: "VIP x 2, Anak-anak x 1"
  getSeatTypeSummary(ticket: Ticket): string {
    if (!ticket.seatDetails || !ticket.categoryTable) return '';

    const counter: Record<string, number> = {};

    for (const s of ticket.seatDetails) {
      counter[s.typeCode] = (counter[s.typeCode] || 0) + 1;
    }

    return Object.keys(counter)
      .map((code) => `${ticket.categoryTable?.[code]?.name || code} x ${counter[code]}`)
      .join(', ');
  }

  openTicket(i: number) {
    this.router.navigate(['/notifications', i]);
  }
}
