import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';
import { Product } from '../../test-data/products';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async assertOnProductDetailPage(): Promise<void> {
    await test.step('Assert on product detail page', async () => {
      await expect(this.page, 'Should navigate to product detail page').toHaveURL(/inventory-item/);
    });
  }

  async assertProductDetails(product: Product): Promise<void> {
    await test.step(`Assert product details: ${product.name}`, async () => {
      await Promise.all([
        expect(this.productName, `Product name should be "${product.name}"`).toHaveText(product.name),
        expect(this.productPrice, `Product price should be "$${product.price}"`).toHaveText(`$${product.price}`),
        ...(product.descriptionSnippet
          ? [expect(this.productDescription, `Product description should contain "${product.descriptionSnippet}"`).toContainText(product.descriptionSnippet)]
          : []),
      ]);
    });
  }

  async addToCart(): Promise<void> {
    await test.step('Add product to cart from detail page', async () => {
      await this.addToCartButton.click();
    });
  }

  async goBack(): Promise<void> {
    await test.step('Go back to products', async () => {
      await this.backButton.click();
    });
  }
}
