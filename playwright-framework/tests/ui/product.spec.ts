import { test } from '../../fixtures/ui.fixtures';
import { products } from '../../test-data/products';

test.describe('Product Detail Page', () => {
  test('navigate to product detail page by clicking item name', async ({ authenticatedPage, productPage }) => {
    await authenticatedPage.clickItemByName(products.backpack.name);
    await productPage.assertOnProductDetailPage();
  });

  test('product detail page shows correct name, price and description', async ({ authenticatedPage, productPage }) => {
    await authenticatedPage.clickItemByName(products.backpack.name);
    await productPage.assertProductDetails(products.backpack);
  });

  test('add to cart from product detail page updates badge', async ({ authenticatedPage, productPage }) => {
    await authenticatedPage.clickItemByName(products.backpack.name);
    await productPage.addToCart();
    await authenticatedPage.assertCartBadgeCount(1);
  });
});
