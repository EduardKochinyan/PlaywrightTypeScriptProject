import { test, expect } from '../../fixtures/api.fixtures';
import { bookings } from '../../test-data/bookings';

test.describe.serial('Booking filters', () => {
  let bookingId: number;
  let uniqueName: string;

  test('creates a booking for filter tests', async ({ authenticatedBookingAPI }, testInfo) => {
    uniqueName = `FilterTest${Date.now()}`;
    const result = await test.step('POST /booking', async () => {
      return authenticatedBookingAPI.createBooking({
        ...bookings.filterTest,
        firstname: uniqueName,
        lastname: uniqueName,
      });
    });

    bookingId = result.bookingid;

    await testInfo.attach('Expected result', {
      body: 'POST /booking should return a new booking ID and the full booking object',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });

    expect(bookingId, 'Setup should create a valid booking ID').toBeGreaterThan(0);
  });

  test('filter by firstname returns matching bookings', async ({ bookingAPI }, testInfo) => {
    const ids = await test.step(`GET /booking?firstname=${uniqueName}`, async () => {
      return bookingAPI.getAllBookingIds({ firstname: uniqueName });
    });

    await testInfo.attach('Expected result', {
      body: `GET /booking?firstname=${uniqueName} should return an array containing our created booking`,
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(ids, null, 2),
      contentType: 'application/json',
    });

    expect(ids, 'Filtered results should include the created booking').toContainEqual({ bookingid: bookingId });
  });

  test('filter by lastname returns matching bookings', async ({ bookingAPI }, testInfo) => {
    const ids = await test.step(`GET /booking?lastname=${uniqueName}`, async () => {
      return bookingAPI.getAllBookingIds({ lastname: uniqueName });
    });

    await testInfo.attach('Expected result', {
      body: `GET /booking?lastname=${uniqueName} should return an array containing our created booking`,
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(ids, null, 2),
      contentType: 'application/json',
    });

    expect(ids, 'Filtered results should include the created booking').toContainEqual({ bookingid: bookingId });
  });

  test('filter by non-existent name returns list without our booking', async ({ bookingAPI }, testInfo) => {
    const ids = await test.step('GET /booking?firstname=NonExistentXYZ123', async () => {
      return bookingAPI.getAllBookingIds({ firstname: 'NonExistentXYZ123' });
    });

    await testInfo.attach('Expected result', {
      body: 'GET /booking?firstname=NonExistentXYZ123 should return an empty array or a list that does not include our booking',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(ids, null, 2),
      contentType: 'application/json',
    });

    expect(ids, 'Non-existent name filter should not include our booking').not.toContainEqual({ bookingid: bookingId });
  });
});
