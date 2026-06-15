import { test } from '../../fixtures/ui.fixtures';
import { products } from '../../test-data/products';

test.describe('Navigation Menu', () => {
  test('navigation menu opens successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.openMenu();
    await authenticatedPage.assertMenuOpen();
  });

  test('About button redirects to Sauce Labs website', async ({ authenticatedPage }) => {
    await authenticatedPage.clickAbout();
    await authenticatedPage.assertRedirectedToSauceLabs();
  });

  test('Logout button redirects to login page', async ({ authenticatedPage }) => {
    await authenticatedPage.clickLogout();
    await authenticatedPage.assertAtLoginPage();
  });

  test('All Items from cart returns to inventory page', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.clickAllItems();
    await authenticatedPage.assertOnInventoryPage();
  });

  test('Reset App State clears cart', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.assertCartBadgeCount(1);
    await authenticatedPage.resetAppState();
    await authenticatedPage.assertCartBadgeCount(0);
    await authenticatedPage.assertCartBadgeNotVisible();
  });
});
