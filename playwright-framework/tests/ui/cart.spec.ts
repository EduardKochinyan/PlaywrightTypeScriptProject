import { test } from '../../fixtures/ui.fixtures';
import { products } from '../../test-data/products';

test.describe('Cart', () => {
  test('cart page loads correctly', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.goToCart();
    await cartPage.assertOnCartPage();
  });

  test('item added appears in cart', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertItemInCart(products.backpack.name);
  });

  test('removing item from cart page decreases item count', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.goToCart();
    await cartPage.removeItem(products.backpack.id);
    await cartPage.assertCartIsEmpty();
  });

  test('cart is empty when no items added', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.goToCart();
    await cartPage.assertCartIsEmpty();
  });

  test('continue shopping button returns to inventory page', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.goToCart();
    await cartPage.continueShopping();
  });

  test('multiple items show correct badge count and all appear in cart', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.addItemToCart(products.bikeLight.id);
    await authenticatedPage.addItemToCart(products.boltTShirt.id);
    await authenticatedPage.assertCartBadgeCount(3);
    await authenticatedPage.goToCart();
    await cartPage.assertItemInCart(products.backpack.name);
    await cartPage.assertItemInCart(products.bikeLight.name);
    await cartPage.assertItemInCart(products.boltTShirt.name);
  });

  test('item prices are displayed in cart', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.goToCart();
    await cartPage.assertItemPrices([products.backpack.price]);
  });
});
