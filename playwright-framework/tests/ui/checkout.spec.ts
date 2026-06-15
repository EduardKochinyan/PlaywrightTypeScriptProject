import { test } from '../../fixtures/ui.fixtures';
import { shippingData } from '../../test-data/checkout';
import { products } from '../../test-data/products';

test.describe('Checkout', () => {
  test.describe('with item in cart', () => {
    test.beforeEach(async ({ authenticatedPage, cartPage, checkoutPage }) => {
      await authenticatedPage.addItemToCart(products.backpack.id);
      await authenticatedPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.assertOnStepOnePage();
    });

    test('successful checkout', async ({ checkoutPage }) => {
      await checkoutPage.fillShippingInfo(shippingData.standard);
      await checkoutPage.continue();
      await checkoutPage.assertOnStepTwoPage();
      await checkoutPage.finish();
      await checkoutPage.assertOnCompletePage();
    });

    test('shows validation errors for missing required fields', async ({ checkoutPage }) => {
      await checkoutPage.continue();
      await checkoutPage.assertFirstNameRequired();

      await checkoutPage.fillShippingInfo(shippingData.missingLastName);
      await checkoutPage.continue();
      await checkoutPage.assertLastNameRequired();

      await checkoutPage.fillShippingInfo(shippingData.missingPostalCode);
      await checkoutPage.continue();
      await checkoutPage.assertPostalCodeRequired();
    });

    test('cancel on step one returns to cart', async ({ cartPage, checkoutPage }) => {
      await checkoutPage.cancel();
      await cartPage.assertOnCartPage();
    });

    test('item appears in order summary', async ({ checkoutPage }) => {
      await checkoutPage.fillShippingInfo(shippingData.standard);
      await checkoutPage.continue();
      await checkoutPage.assertOnStepTwoPage();
      await checkoutPage.assertItemInSummary(products.backpack.name);
    });

    test('cancel on step two returns to inventory page', async ({ authenticatedPage, checkoutPage }) => {
      await checkoutPage.fillShippingInfo(shippingData.standard);
      await checkoutPage.continue();
      await checkoutPage.assertOnStepTwoPage();
      await checkoutPage.cancel();
      await authenticatedPage.assertOnInventoryPage();
    });

    test('price total on step two matches sum of cart items', async ({ checkoutPage }) => {
      await checkoutPage.fillShippingInfo(shippingData.standard);
      await checkoutPage.continue();
      await checkoutPage.assertOnStepTwoPage();
      await checkoutPage.assertSubtotalMatchesItemPrices();
    });

    test('tax line is displayed on step two', async ({ checkoutPage }) => {
      await checkoutPage.fillShippingInfo(shippingData.standard);
      await checkoutPage.continue();
      await checkoutPage.assertOnStepTwoPage();
      await checkoutPage.assertTaxVisible();
    });
  });

  test('checkout completes with empty cart', async ({ authenticatedPage, cartPage, checkoutPage }) => {
    await authenticatedPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillShippingInfo(shippingData.standard);
    await checkoutPage.continue();
    await checkoutPage.assertOnStepTwoPage();
    await checkoutPage.finish();
    await checkoutPage.assertOnCompletePage();
  });

});
