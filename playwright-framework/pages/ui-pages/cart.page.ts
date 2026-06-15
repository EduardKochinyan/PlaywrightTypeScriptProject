import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartTitle: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  private removeButton(itemId: string): Locator {
    return this.page.locator(`[data-test="remove-${itemId}"]`);
  }

  async goto(): Promise<void> {
    await this.navigate('/cart.html');
  }

  async getCartItemCount(): Promise<number> {
    return test.step('Get cart item count', async () => {
      return this.cartItems.count();
    });
  }

  async getItemNames(): Promise<string[]> {
    return test.step('Get cart item names', async () => {
      return this.itemNames.allTextContents();
    });
  }

  async removeItem(itemName: string): Promise<void> {
    await test.step(`Remove item from cart: ${itemName}`, async () => {
      await this.removeButton(itemName).click();
    });
  }

  async assertOnCartPage(): Promise<void> {
    await test.step('Assert on cart page', async () => {
      await expect(this.cartTitle, 'Cart title should be "Your Cart"').toHaveText('Your Cart');
      await expect(this.page, 'URL should contain /cart').toHaveURL(/cart/);
    });
  }

  async checkout(): Promise<void> {
    await test.step('Proceed to checkout', async () => {
      await this.checkoutButton.click();
    });
  }

  async getItemPrices(): Promise<number[]> {
    return test.step('Get cart item prices', async () => {
      const priceTexts = await this.itemPrices.allTextContents();
      return priceTexts.map(p => parseFloat(p.replace('$', '')));
    });
  }

  async assertItemInCart(itemName: string): Promise<void> {
    await test.step(`Assert item in cart: ${itemName}`, async () => {
      const names = await this.getItemNames();
      expect(names, `Cart should contain item: ${itemName}`).toContain(itemName);
    });
  }

  async assertCartIsEmpty(): Promise<void> {
    await test.step('Assert cart is empty', async () => {
      const count = await this.getCartItemCount();
      expect(count, 'Cart should have 0 items').toBe(0);
    });
  }

  async continueShopping(): Promise<void> {
    await test.step('Continue shopping - return to inventory', async () => {
      await this.continueShoppingButton.click();
      await expect(this.page, 'Should navigate back to inventory page').toHaveURL(/inventory/);
    });
  }

  async assertItemPrices(expectedPrices: number[]): Promise<void> {
    await test.step('Assert cart item prices match expected', async () => {
      const prices = await this.getItemPrices();
      expect(prices.length, `Cart should have ${expectedPrices.length} priced item(s)`).toBe(expectedPrices.length);
      prices.forEach((price, i) => {
        expect(price, `Item price at index ${i} should be ${expectedPrices[i]}`).toBe(expectedPrices[i]);
      });
    });
  }
}
