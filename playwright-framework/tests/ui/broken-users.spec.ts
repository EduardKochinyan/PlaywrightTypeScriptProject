import { test, expect } from '../../fixtures/ui.fixtures';
import { users } from '../../test-data/users';
import { shippingData } from '../../test-data/checkout';

test.describe('Problem User', () => {
  test('Same images shown for all items', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.problem.username, users.problem.password);
    await inventoryPage.assertAllImagesAreSame();
  });
});

test.describe('Performance Glitch User', () => {
  test('Excessive login time', async ({ loginPage, inventoryPage }) => {
    const startTime = Date.now();
    await loginPage.login(users.performance.username, users.performance.password);
    await inventoryPage.assertOnInventoryPage();
    const duration = Date.now() - startTime;
    expect(duration, 'Login time should exceed the threshold').toBeGreaterThan(3000);
  });
});

test.describe('Error User', () => {
  test('Error User Checkout issue', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await loginPage.login(users.error.username, users.error.password);
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.checkout();
    await checkoutPage.assertOnStepOnePage();
    await checkoutPage.fillShippingInfo(shippingData.errorUser);
    await checkoutPage.assertLastNameEmpty();
  });
});

test.describe('Visual User', () => {
  test('Standard User Layout', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.assertStandardCartIconLayout();
  });

  test('visual user inventory layout should match correct layout', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.visual.username, users.visual.password);
    await inventoryPage.assertVisualUserCartIconLayout();
  });
});
