import { test as base } from '@playwright/test';
import { BookingAPI } from '../pages/api-pages/booking.api';
import { users } from '../test-data/users';

type APIFixtures = {
  bookingAPI: BookingAPI;
  authenticatedBookingAPI: BookingAPI;
};

export const test = base.extend<APIFixtures>({
  bookingAPI: async ({ request }, use) => {
    await use(new BookingAPI(request));
  },

  authenticatedBookingAPI: async ({ request }, use) => {
    const api = new BookingAPI(request);
    await api.authenticate(users.apiAdmin.username, users.apiAdmin.password);
    await use(api);
  },
});

export { expect } from '@playwright/test';
