import { test } from '../../fixtures/ui.fixtures';
import { users } from '../../test-data/users';

test.describe('Login', () => {
  test('Login with correct credentials', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await loginPage.assertSuccessfulLogin();
  });

  test('locked out user error message', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await loginPage.assertLockedOutError();
  });

  test('Login with incorrect credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.assertInvalidCredentialsError();
  });

  test('Login with missing username', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);
    await loginPage.assertUsernameRequired();
  });

  test('Login with missing password', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');
    await loginPage.assertPasswordRequired();
  });

  test('login page is visible on load', async ({ loginPage }) => {
    await loginPage.assertLoginPageVisible();
  });

  test('session is cleared after logout — direct URL redirects to login', async ({ authenticatedPage }) => {
    await authenticatedPage.clickLogout();
    await authenticatedPage.goto();
    await authenticatedPage.assertAtLoginPage();
  });

  test('error banner can be dismissed with X button', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.assertErrorVisible();
    await loginPage.dismissError();
    await loginPage.assertErrorDismissed();
  });
});
