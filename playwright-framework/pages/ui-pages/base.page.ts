import * as fs from 'fs';
import * as path from 'path';
import { Page, Locator, expect, test } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly burgerMenu: Locator;
  readonly burgerMenuCloseBtn: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.burgerMenuCloseBtn = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
  }

  async navigate(pagePath: string): Promise<void> {
    await test.step(`Navigate to ${pagePath}`, async () => {
      await this.page.goto(pagePath);
    });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async waitForElement(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async openMenu(): Promise<void> {
    await test.step('Open navigation menu', async () => {
      await this.burgerMenu.click();
    });
  }

  async clickAllItems(): Promise<void> {
    await test.step('Click All Items in navigation menu', async () => {
      await this.openMenu();
      await this.allItemsLink.click();
    });
  }

  async clickAbout(): Promise<void> {
    await test.step('Click About in navigation menu', async () => {
      await this.openMenu();
      await this.aboutLink.click();
    });
  }

  async clickLogout(): Promise<void> {
    await test.step('Click Logout in navigation menu', async () => {
      await this.openMenu();
      await this.logoutLink.click();
    });
  }

  async closeMenu(): Promise<void> {
    await test.step('Close navigation menu', async () => {
      await this.burgerMenuCloseBtn.click();
    });
  }

  async resetAppState(): Promise<void> {
    await test.step('Reset app state', async () => {
      await this.openMenu();
      await this.resetLink.click();
      await this.closeMenu();
    });
  }

  async assertMenuOpen(): Promise<void> {
    await test.step('Assert navigation menu is open', async () => {
      await expect(this.allItemsLink, 'All Items link should be visible after opening menu').toBeVisible();
    });
  }

  async assertRedirectedToSauceLabs(): Promise<void> {
    await test.step('Assert redirected to saucelabs.com', async () => {
      await expect(this.page, 'Should redirect to saucelabs.com').toHaveURL(/saucelabs\.com/);
    });
  }

  async assertAtLoginPage(): Promise<void> {
    await test.step('Assert at login page', async () => {
      await expect(this.page, 'Should be at login page').toHaveURL('/');
    });
  }

  async takeScreenshot(name: string): Promise<void> {
    const dir = path.join(process.cwd(), 'screenshots');
    fs.mkdirSync(dir, { recursive: true });
    await this.page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
  }
}
