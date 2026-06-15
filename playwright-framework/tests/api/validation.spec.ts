import { test, expect } from '../../fixtures/api.fixtures';
import { invalidBookings } from '../../test-data/bookings';
import { users } from '../../test-data/users';

test.describe('Booking validation', () => {
  test('rejects non-numeric totalprice', async ({ bookingAPI }, testInfo) => {
    test.fail();
    const response = await test.step('POST /booking with string totalprice', async () => {
      return bookingAPI.createBookingRaw(invalidBookings.nonNumericPrice);
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'Status 400 — server should reject a non-numeric totalprice with a validation error',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status ${response.status()} — server accepted the request and silently stored null for totalprice\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Server should reject invalid totalprice with 400').toBe(400);
  });

  test('rejects missing required lastname', async ({ bookingAPI }, testInfo) => {
    test.fail();
    const response = await test.step('POST /booking without lastname', async () => {
      return bookingAPI.createBookingRaw(invalidBookings.missingLastname);
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'Status 400 — server should reject a booking with a missing required field with a validation error',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status ${response.status()} — server crashed instead of returning a validation error\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Server should reject missing required field with 400').toBe(400);
  });

  test('rejects checkin date after checkout date', async ({ bookingAPI }, testInfo) => {
    test.fail();
    const response = await test.step('POST /booking with checkin after checkout', async () => {
      return bookingAPI.createBookingRaw(invalidBookings.checkInAfterCheckout);
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'Status 400 — server should reject a booking where checkin date is after checkout date',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status ${response.status()} — server accepted the invalid date range and created the booking\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Server should reject invalid date range with 400').toBe(400);
  });

  test('rejects invalid auth credentials', async ({ bookingAPI }, testInfo) => {
    test.fail();
    const response = await test.step('POST /auth with wrong credentials', async () => {
      return bookingAPI.authenticateRaw(users.invalid.username, users.invalid.password);
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'Status 401 — server should reject invalid credentials with Unauthorized',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status ${response.status()} — server returned 200 instead of 401\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Server should return 401 for bad credentials').toBe(401);
  });
});
