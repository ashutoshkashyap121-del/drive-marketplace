// app/lib/bookings.ts

export type Booking = {
  trainer: string;
  packageName: string;
  amount: number;
  createdAt: string;
};

// 🔒 Global in-memory store (persists across routes in dev)
const globalForBookings = globalThis as unknown as {
  bookings?: Booking[];
};

if (!globalForBookings.bookings) {
  globalForBookings.bookings = [];
}

export const bookings = globalForBookings.bookings;

export function addBooking(booking: Booking) {
  bookings.push(booking);
}

export function getBookings() {
  return bookings;
}
