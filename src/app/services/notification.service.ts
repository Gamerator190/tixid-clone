// Copied Event and Ticket interfaces from home.ts
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
  promoCode?: string;
  discount?: number;
  bookedSeats?: string[];
  seatConfiguration?: { row: string; category: string }[];
  availableSeats: number;
}

interface Ticket {
  event: Event;
  poster: string;
  time: string;
  seats: string[];
  total: number;
  purchaseDate: string;
  seatDetails?: any[];
  categoryTable?: Record<string, { name: string; price: number }>;
  appliedPromo?: any;
  discountAmount?: number;
  isRead: boolean;
}

import { Inject, Injectable, PLATFORM_ID } from '@angular/core'; // Add Inject, PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Add isPlatformBrowser
import { BehaviorSubject, Observable } from 'rxjs'; // Import BehaviorSubject and Observable

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _unreadCount = new BehaviorSubject<number>(0);
  public readonly unreadCount$: Observable<number> = this._unreadCount.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { // Inject PLATFORM_ID
    if (isPlatformBrowser(this.platformId)) { // Only update if in browser
      this.updateUnreadCount(); // Initial update when service is created
    }
  }

  updateUnreadCount(): void {
    if (isPlatformBrowser(this.platformId)) { // Only access localStorage if in browser
      const rawTickets = localStorage.getItem('pf-tickets');
      if (rawTickets) {
        try {
          const tickets: Ticket[] = JSON.parse(rawTickets);
          const count = tickets.filter(t => !t.isRead).length;
          this._unreadCount.next(count);
        } catch (e) {
          console.error('Error parsing tickets for unread count:', e);
          this._unreadCount.next(0);
        }
      } else {
        this._unreadCount.next(0);
      }
    } else {
      // If not in browser, set count to 0 or handle server-side specific logic
      this._unreadCount.next(0);
    }
  }
}
