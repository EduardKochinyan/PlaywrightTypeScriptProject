import { test, expect } from '../../fixtures/api.fixtures';
import { bookings } from '../../test-data/bookings';

test.describe.serial('Booking CRUD', () => {
  let bookingId: number;

  test('creates a booking', async ({ authenticatedBookingAPI }, testInfo) => {
    const result = await test.step('POST /booking', async () => {
      return authenticatedBookingAPI.createBooking(bookings.standard);
    });

    bookingId = result.bookingid;

    await testInfo.attach('Expected result', {
      body: 'POST /booking should return a new booking ID and the full booking object matching the request body',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });

    expect(result.bookingid, 'Response should include a numeric booking ID').toBeGreaterThan(0);
    expect(result.booking).toMatchObject(bookings.standard);
  });

  test('reads the created booking', async ({ authenticatedBookingAPI }, testInfo) => {
    const booking = await test.step('GET /booking/:id', async () => {
      return authenticatedBookingAPI.getBooking(bookingId);
    });

    await testInfo.attach('Expected result', {
      body: 'GET /booking/:id should return the booking object matching what was created',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(booking, null, 2),
      contentType: 'application/json',
    });

    expect(booking).toMatchObject(bookings.standard);
  });

  test('Fully updates the booking', async ({ authenticatedBookingAPI }, testInfo) => {
    const updated = await test.step('PUT /booking/:id', async () => {
      return authenticatedBookingAPI.updateBooking(bookingId, bookings.updated);
    });

    await testInfo.attach('Expected result', {
      body: 'PUT /booking/:id should return the completely replaced booking matching the new request body',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(updated, null, 2),
      contentType: 'application/json',
    });

    expect(updated).toMatchObject(bookings.updated);
  });

  test('partially updates the booking', async ({ authenticatedBookingAPI }, testInfo) => {
    const patched = await test.step('PATCH /booking/:id', async () => {
      return authenticatedBookingAPI.partialUpdateBooking(bookingId, bookings.partialUpdate);
    });

    await testInfo.attach('Expected result', {
      body: 'PATCH /booking/:id should return the booking with only the specified fields changed, all others preserved',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: JSON.stringify(patched, null, 2),
      contentType: 'application/json',
    });

    expect(patched).toMatchObject(bookings.afterPartialUpdate);
  });

  test('Deletes the booking', async ({ authenticatedBookingAPI }, testInfo) => {
    const response = await test.step('DELETE /booking/:id', async () => {
      return authenticatedBookingAPI.deleteBooking(bookingId);
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'DELETE /booking/:id should return 200 or 204 — server returns 201 (known bug)',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status: ${response.status()}\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Delete should return 201').toBe(201);
  });

  test('returns 404 after deletion', async ({ authenticatedBookingAPI }, testInfo) => {
    const response = await test.step('GET /booking/:id after delete', async () => {
      return authenticatedBookingAPI.getBookingRaw(bookingId);
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'GET /booking/:id after deletion should return 404 Not Found',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status: ${response.status()}\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Deleted booking should return 404').toBe(404);
  });

});
