import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

type Seat = { id: string; booked: boolean; type: string };

@Component({
  selector: 'app-seat-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-picker.html',
  styleUrl: './seat-picker.css',
})
export class SeatPickerComponent implements OnInit {
  eventId!: number;
  time!: string;

  // LOWER FOYER: A–J (10 baris)
  lowerRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // BALCONY: AA–EE (5 baris)
  balconyRows = ['AA', 'BB', 'CC', 'DD', 'EE'];

  // semua kursi (lower + balcony)
  seats: Seat[][] = [];
  selectedSeats: string[] = [];

  priceTable: Record<string, number> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.time = String(this.route.snapshot.paramMap.get('time'));

    const eventsJson = localStorage.getItem('pf-events');
    let categories: Record<string, string> = {};

    if (eventsJson) {
      const events = JSON.parse(eventsJson);
      const currentEvent = events.find((event: any) => event.id === this.eventId);

      if (currentEvent && currentEvent.ticketCategories && currentEvent.seatConfiguration) {
        // Create price table from ticketCategories
        this.priceTable = currentEvent.ticketCategories.reduce(
          (acc: Record<string, number>, cat: any) => {
            acc[cat.shortName] = cat.price;
            return acc;
          },
          {},
        );

        // Create categories map from seatConfiguration
        categories = currentEvent.seatConfiguration.reduce(
          (acc: Record<string, string>, config: any) => {
            acc[config.row] = config.category;
            return acc;
          },
          {},
        );
      }
    }

    // Fallback to default if not configured
    if (Object.keys(this.priceTable).length === 0) {
      this.priceTable = { GEN: 25000 };
    }
    if (Object.keys(categories).length === 0) {
      this.lowerRows.forEach((row) => (categories[row] = 'GEN'));
      this.balconyRows.forEach((row) => (categories[row] = 'GEN'));
    }

    this.generateSeats(categories);
  }

  generateSeats(categories: Record<string, string>) {
    this.seats = [];

    // LOWER FOYER → 30 kursi per baris (10 kiri, 10 tengah, 10 kanan)
    for (const row of this.lowerRows) {
      const rowSeats: Seat[] = [];
      for (let i = 1; i <= 30; i++) {
        rowSeats.push({
          id: row + i,
          booked: Math.random() < 0.15,
          type: categories[row] || 'GEN',
        });
      }
      this.seats.push(rowSeats);
    }

    // BALCONY → 30 kursi per baris juga (10 kiri, 10 tengah, 10 kanan)
    for (const row of this.balconyRows) {
      const rowSeats: Seat[] = [];
      for (let i = 1; i <= 30; i++) {
        rowSeats.push({
          id: row + i,
          booked: Math.random() < 0.15,
          type: categories[row] || 'GEN',
        });
      }
      this.seats.push(rowSeats);
    }
  }

  // getter buat template
  get lowerFoyerSeats(): Seat[][] {
    return this.seats.slice(0, this.lowerRows.length);
  }

  get balconySeats(): Seat[][] {
    return this.seats.slice(this.lowerRows.length);
  }

  toggleSeat(seat: Seat) {
    if (seat.booked) return;

    const idx = this.selectedSeats.indexOf(seat.id);
    if (idx >= 0) {
      this.selectedSeats.splice(idx, 1);
    } else {
      this.selectedSeats.push(seat.id);
    }
  }

  goBack() {
    this.router.navigate(['/event', this.eventId]);
  }

  get selectedSeatDetails() {
    const flat = this.seats.flat();
    return this.selectedSeats.map((id) => {
      const seat = flat.find((s) => s.id === id);
      const type = seat?.type ?? 'REG';
      const price = this.priceTable[type] ?? 0;
      return { id, type, price };
    });
  }

  get totalPrice(): number {
    return this.selectedSeatDetails.reduce((sum, s) => sum + s.price, 0);
  }

  formatRupiah(value: number): string {
    return value.toLocaleString('id-ID');
  }

  lanjut() {
    if (!this.selectedSeats.length) {
      alert('Please choose at least 1 seat first, okay? 😊');
      return;
    }

    const flat = this.seats.flat();
    const seatData = this.selectedSeats
      .map((id) => {
        const seat = flat.find((s) => s.id === id);
        const type = seat?.type ?? 'REG';
        return `${id}:${type}`;
      })
      .join(',');

    this.router.navigate(['/checkout', this.eventId, this.time, seatData]);
  }
}
