import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';
import { ShippingInfo } from '../../test-data/checkout';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly summaryInfo: Locator;
  readonly completeHeader: Locator;
  readonly itemName: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly cartItemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryInfo = page.locator('.summary_info');
    this.completeHeader = page.locator('.complete-header');
    this.itemName = page.locator('.inventory_item_name');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.cartItemPrices = page.locator('.cart_list .inventory_item_price');
  }

  async fillShippingInfo(info: ShippingInfo): Promise<void> {
    await test.step('Fill shipping info', async () => {
      await this.firstNameInput.fill(info.firstName);
      await this.lastNameInput.fill(info.lastName ?? '');
      await this.postalCodeInput.fill(info.postalCode ?? '');
    });
  }

  async continue(): Promise<void> {
    await test.step('Click Continue', async () => {
      await this.continueButton.click();
    });
  }

  async cancel(): Promise<void> {
    await test.step('Click Cancel', async () => {
      await this.cancelButton.click();
    });
  }

  async finish(): Promise<void> {
    await test.step('Click Finish', async () => {
      await this.finishButton.click();
    });
  }

  async assertOnStepOnePage(): Promise<void> {
    await test.step('Assert on checkout step one page', async () => {
      await expect(this.page, 'URL should contain /checkout-step-one').toHaveURL(/checkout-step-one/);
    });
  }

  async assertOnStepTwoPage(): Promise<void> {
    await test.step('Assert on checkout step two page', async () => {
      await Promise.all([
        expect(this.page, 'URL should contain /checkout-step-two').toHaveURL(/checkout-step-two/),
        expect(this.summaryInfo, 'Summary info should be visible').toBeVisible(),
      ]);
    });
  }

  async assertOnCompletePage(): Promise<void> {
    await test.step('Assert on checkout complete page', async () => {
      await Promise.all([
        expect(this.page, 'URL should contain /checkout-complete').toHaveURL(/checkout-complete/),
        expect(this.completeHeader, 'Complete header should say "Thank you for your order!"').toHaveText('Thank you for your order!'),
      ]);
    });
  }

  async assertErrorMessage(message: string): Promise<void> {
    await test.step(`Assert error message: "${message}"`, async () => {
      await expect(this.errorMessage, `Error message should contain "${message}"`).toContainText(message);
    });
  }

  async assertTaxVisible(): Promise<void> {
    await test.step('Assert tax line is visible on step two', async () => {
      await expect(this.taxLabel, 'Tax line should be visible on step two').toBeVisible();
    });
  }

  async assertSubtotalMatchesItemPrices(): Promise<void> {
    await test.step('Assert subtotal matches sum of item prices', async () => {
      const priceTexts = await this.cartItemPrices.allTextContents();
      const sum = priceTexts.map(p => parseFloat(p.replace('$', ''))).reduce((a, b) => a + b, 0);
      const subtotalText = await this.subtotalLabel.textContent() ?? '';
      const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
      expect(Math.round(sum * 100), 'Subtotal should match sum of cart item prices').toBe(Math.round(subtotal * 100));
    });
  }

  async assertItemInSummary(itemName: string): Promise<void> {
    await test.step(`Assert item in order summary: "${itemName}"`, async () => {
      await expect(this.itemName, `Order summary should contain item "${itemName}"`).toContainText(itemName);
    });
  }

  async assertLastNameEmpty(): Promise<void> {
    await test.step('Assert last name field is empty', async () => {
      await expect(this.lastNameInput, 'Last name field should be empty').toHaveValue('');
    });
  }

  async assertFirstNameRequired(): Promise<void> {
    await this.assertErrorMessage('First Name is required');
  }

  async assertLastNameRequired(): Promise<void> {
    await this.assertErrorMessage('Last Name is required');
  }

  async assertPostalCodeRequired(): Promise<void> {
    await this.assertErrorMessage('Postal Code is required');
  }
}
