import { test, expect } from '../../fixtures/api.fixtures';
import { users } from '../../test-data/users';

test.describe('Auth API', () => {
  test('returns token for valid credentials', async ({ bookingAPI }, testInfo) => {
    const token = await test.step('POST /auth with valid credentials', async () => {
      return bookingAPI.authenticate(users.apiAdmin.username, users.apiAdmin.password);
    });

    await testInfo.attach('Expected result', {
      body: 'POST /auth with valid credentials should return a non-empty session token string',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Received token: ${token}`,
      contentType: 'text/plain',
    });

    expect(token, 'Auth token should be truthy for valid credentials').toBeTruthy();
    expect(typeof token, 'Token type should be string').toBe('string');
  });

  test('auth endpoint returns 200', async ({ request }, testInfo) => {
    const response = await test.step('POST /auth with valid credentials', async () => {
      return request.post(
        `${process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com'}/auth`,
        { data: { username: users.apiAdmin.username, password: users.apiAdmin.password } }
      );
    });

    const body = await response.text();

    await testInfo.attach('Expected result', {
      body: 'POST /auth with valid credentials should return HTTP status 200',
      contentType: 'text/plain',
    });
    await testInfo.attach('Actual result', {
      body: `Status: ${response.status()}\nBody: ${body}`,
      contentType: 'text/plain',
    });

    expect(response.status(), 'Auth endpoint should return HTTP 200').toBe(200);
  });

});
