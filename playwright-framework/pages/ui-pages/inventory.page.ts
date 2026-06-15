import { Page, Locator, BrowserContext, expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly productImages: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('select.product_sort_container');
    this.twitterLink = page.locator('.social_twitter a');
    this.facebookLink = page.locator('.social_facebook a');
    this.linkedinLink = page.locator('.social_linkedin a');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.productImages = page.locator('.inventory_item img');
  }

  private addToCartButton(itemId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${itemId}"]`);
  }

  private removeFromCartButton(itemId: string): Locator {
    return this.page.locator(`[data-test="remove-${itemId}"]`);
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  async assertOnInventoryPage(): Promise<void> {
    await test.step('Assert on inventory page', async () => {
      await expect(this.pageTitle, 'Page title should be "Products"').toHaveText('Products');
      await expect(this.page, 'URL should contain /inventory').toHaveURL(/inventory/);
    });
  }

  async addItemToCart(itemName: string): Promise<void> {
    await test.step(`Add item to cart: ${itemName}`, async () => {
      await this.addToCartButton(itemName).click();
    });
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    await test.step(`Remove item from cart: ${itemName}`, async () => {
      await this.removeFromCartButton(itemName).click();
    });
  }

  async getCartCount(): Promise<number> {
    return test.step('Get cart item count', async () => {
      const isVisible = await this.cartBadge.isVisible();
      if (!isVisible) return 0;
      const badge = await this.cartBadge.textContent();
      return badge ? parseInt(badge, 10) : 0;
    });
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await test.step(`Sort products by: ${option}`, async () => {
      await this.sortDropdown.selectOption(option);
    });
  }

  async goToCart(): Promise<void> {
    await test.step('Go to cart', async () => {
      await this.cartLink.click();
    });
  }

  async getItemNames(): Promise<string[]> {
    return test.step('Get product names', async () => {
      return this.itemNames.allTextContents();
    });
  }

  async getItemPrices(): Promise<number[]> {
    return test.step('Get product prices', async () => {
      const priceTexts = await this.itemPrices.allTextContents();
      return priceTexts.map(p => parseFloat(p.replace('$', '')));
    });
  }

  async clickItemByName(itemName: string): Promise<void> {
    await test.step(`Click on product: ${itemName}`, async () => {
      await this.itemNames.filter({ hasText: itemName }).click();
    });
  }

  async assertSocialLinks(): Promise<void> {
    await test.step('Assert social media links are visible', async () => {
      await expect(this.twitterLink, 'Twitter link should be visible').toBeVisible();
      await expect(this.facebookLink, 'Facebook link should be visible').toBeVisible();
      await expect(this.linkedinLink, 'LinkedIn link should be visible').toBeVisible();
    });
  }

  async assertCartBadgeCount(expected: number): Promise<void> {
    await test.step(`Assert cart badge count is ${expected}`, async () => {
      const count = await this.getCartCount();
      expect(count, `Cart badge should show ${expected}`).toBe(expected);
    });
  }

  async assertCartBadgeNotVisible(): Promise<void> {
    await test.step('Assert cart badge is not visible', async () => {
      await expect(this.cartBadge, 'Cart badge should not be visible').not.toBeVisible();
    });
  }

  async assertSortedAZ(): Promise<void> {
    await test.step('Assert products are sorted A to Z', async () => {
      const names = await this.getItemNames();
      expect(names, 'Product names should be sorted A to Z').toEqual([...names].sort());
    });
  }

  async assertSortedZA(): Promise<void> {
    await test.step('Assert products are sorted Z to A', async () => {
      const names = await this.getItemNames();
      expect(names, 'Product names should be sorted Z to A').toEqual([...names].sort().reverse());
    });
  }

  async assertSortedPriceLowToHigh(): Promise<void> {
    await test.step('Assert products are sorted price low to high', async () => {
      const prices = await this.getItemPrices();
      expect(prices, 'Prices should be sorted low to high').toEqual([...prices].sort((a, b) => a - b));
    });
  }

  async assertSortedPriceHighToLow(): Promise<void> {
    await test.step('Assert products are sorted price high to low', async () => {
      const prices = await this.getItemPrices();
      expect(prices, 'Prices should be sorted high to low').toEqual([...prices].sort((a, b) => b - a));
    });
  }

  async assertTwitterLinkOpensNewTab(context: BrowserContext): Promise<void> {
    await test.step('Assert Twitter link opens x.com/saucelabs in new tab', async () => {
      const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        this.twitterLink.click(),
      ]);
      await expect(newTab, 'New tab should open x.com/saucelabs').toHaveURL(/x\.com\/saucelabs/);
    });
  }

  async assertFacebookLinkOpensNewTab(context: BrowserContext): Promise<void> {
    await test.step('Assert Facebook link opens facebook.com/saucelabs in new tab', async () => {
      const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        this.facebookLink.click(),
      ]);
      await expect(newTab, 'New tab should open facebook.com/saucelabs').toHaveURL(/facebook\.com\/saucelabs/);
    });
  }

  async assertLinkedInLinkOpensNewTab(context: BrowserContext): Promise<void> {
    await test.step('Assert LinkedIn link opens linkedin.com/company/sauce-labs in new tab', async () => {
      const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        this.linkedinLink.click(),
      ]);
      await expect(newTab, 'New tab should open linkedin.com/company/sauce-labs').toHaveURL(/linkedin\.com\/company\/sauce-labs/);
    });
  }

  async assertAllImagesAreSame(): Promise<void> {
    await test.step('Assert all product images have the same src', async () => {
      const images = await this.productImages.all();
      const srcs = await Promise.all(images.map(img => img.getAttribute('src')));
      const uniqueSrcs = new Set(srcs);
      expect(uniqueSrcs.size, 'All product images should have the same src').toBe(1);
    });
  }

  async assertCartIconMatchesSnapshot(snapshotName: string, options?: { maxDiffPixels?: number; maxDiffPixelRatio?: number }): Promise<void> {
    await test.step(`Assert cart icon matches snapshot: ${snapshotName}`, async () => {
      await expect(this.cartLink).toHaveScreenshot(snapshotName, options);
    });
  }

  async assertStandardCartIconLayout(): Promise<void> {
    await this.assertCartIconMatchesSnapshot('cart-icon.png', { maxDiffPixelRatio: 0.07 });
  }

  async assertVisualUserCartIconLayout(): Promise<void> {
    await this.assertCartIconMatchesSnapshot('cart-icon.png', { maxDiffPixels: 0 });
  }
}
