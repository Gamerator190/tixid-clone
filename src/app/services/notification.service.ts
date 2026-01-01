interface Ticket {
  eventId: string;
  eventTitle: string;
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
  _id?: string; // MongoDB ID for the ticket document itself
}

import { Inject, Injectable, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; 
import { BehaviorSubject, Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _unreadCount = new BehaviorSubject<number>(0);
  public readonly unreadCount$: Observable<number> = this._unreadCount.asObservable();

  private _tickets = new BehaviorSubject<Ticket[]>([]); // New BehaviorSubject for tickets
  public readonly tickets$: Observable<Ticket[]> = this._tickets.asObservable(); // New observable for tickets

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) { 
      this.updateUnreadCount(); 
    }
  }

  updateUnreadCount(): void {
    if (isPlatformBrowser(this.platformId)) { 
      const rawTickets = localStorage.getItem('pf-tickets');
      if (rawTickets) {
        try {
          const tickets: Ticket[] = JSON.parse(rawTickets);
          this._tickets.next(tickets); // Update the tickets stream
          const count = tickets.filter(t => !t.isRead).length;
          this._unreadCount.next(count);
        } catch (e) {
          console.error('Error parsing tickets for notifications:', e); // Updated error message
          this._tickets.next([]);
          this._unreadCount.next(0);
        }
      } else {
        this._tickets.next([]);
        this._unreadCount.next(0);
      }
    } else {
      this._tickets.next([]);
      this._unreadCount.next(0);
    }
  }
}