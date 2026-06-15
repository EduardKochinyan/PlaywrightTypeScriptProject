export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

export interface BookingId {
  bookingid: number;
}

export interface TokenResponse {
  token: string;
}

export const bookings = {
  standard: {
    firstname: 'Eduard',
    lastname: 'Kochinyan',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-07-01',
      checkout: '2026-07-05',
    },
    additionalneeds: 'Breakfast',
  } satisfies Booking,

  noExtras: {
    firstname: 'Eduard',
    lastname: 'Kochinyan',
    totalprice: 200,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-08-10',
      checkout: '2026-08-15',
    },
  } satisfies Booking,

  longStay: {
    firstname: 'Eduard',
    lastname: 'Kochinyan',
    totalprice: 1000,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-09-01',
      checkout: '2026-09-30',
    },
    additionalneeds: 'Late checkout',
  } satisfies Booking,

  updated: {
    firstname: 'Edo',
    lastname: 'Kochinyan',
    totalprice: 175,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-07-10',
      checkout: '2026-07-15',
    },
    additionalneeds: 'Breakfast',
  } satisfies Booking,

  partialUpdate: {
    additionalneeds: 'Dinner',
    totalprice: 250,
  },

  afterPartialUpdate: {
    firstname: 'Edo',
    lastname: 'Kochinyan',
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-07-10',
      checkout: '2026-07-15',
    },
    additionalneeds: 'Dinner',
  } satisfies Booking,

  filterTest: {
    firstname: 'EduardFilterXYZ',
    lastname: 'KochinyanFilterXYZ',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-07-01',
      checkout: '2026-07-05',
    },
  } satisfies Booking,
};

export const invalidBookings = {
  nonNumericPrice: {
    firstname: 'Eduard',
    lastname: 'Kochinyan',
    totalprice: 'ewefwf',
    depositpaid: true,
    bookingdates: { checkin: '2026-07-01', checkout: '2026-07-05' },
  },
  missingLastname: {
    firstname: 'Eduard',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-07-01', checkout: '2026-07-05' },
  },
  checkInAfterCheckout: {
    firstname: 'Eduard',
    lastname: 'Kochinyan',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-08-15', checkout: '2026-08-10' },
  },
  missingTotalPrice: {
    firstname: 'Eduard',
    lastname: 'Kochinyan',
    depositpaid: true,
    bookingdates: { checkin: '2026-07-01', checkout: '2026-07-05' },
  },
};
