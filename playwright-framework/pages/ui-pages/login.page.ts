import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error-button"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async login(username: string, password: string): Promise<void> {
    await test.step(`Login as ${username}`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }

  async assertErrorMessage(message: string): Promise<void> {
    await test.step(`Assert error message: "${message}"`, async () => {
      await expect(this.errorMessage, 'Error message should be visible').toBeVisible();
      await expect(this.errorMessage, `Error message should contain: "${message}"`).toContainText(message);
    });
  }

  async dismissError(): Promise<void> {
    await test.step('Dismiss error message', async () => {
      await this.errorDismissButton.click();
    });
  }

  async assertLoginPageVisible(): Promise<void> {
    await test.step('Assert login page is visible', async () => {
      await expect(this.loginButton, 'Login button should be visible').toBeVisible();
    });
  }

  async assertSuccessfulLogin(): Promise<void> {
    await test.step('Assert successful login redirects to inventory', async () => {
      await expect(this.page, 'Should redirect to /inventory after login').toHaveURL(/inventory/);
    });
  }

  async assertLockedOutError(): Promise<void> {
    await this.assertErrorMessage('Sorry, this user has been locked out.');
  }

  async assertInvalidCredentialsError(): Promise<void> {
    await this.assertErrorMessage('Username and password do not match any user in this service');
  }

  async assertUsernameRequired(): Promise<void> {
    await this.assertErrorMessage('Username is required');
  }

  async assertPasswordRequired(): Promise<void> {
    await this.assertErrorMessage('Password is required');
  }

  async assertErrorVisible(): Promise<void> {
    await test.step('Assert error banner is visible', async () => {
      await expect(this.errorMessage, 'Error banner should be visible').toBeVisible();
    });
  }

  async assertErrorDismissed(): Promise<void> {
    await test.step('Assert error banner is dismissed', async () => {
      await expect(this.errorMessage, 'Error banner should not be visible').not.toBeVisible();
    });
  }
}
