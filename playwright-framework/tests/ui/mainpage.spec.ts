import { test } from '../../fixtures/ui.fixtures';
import { products } from '../../test-data/products';

test.describe('Cart Badge', () => {
  test('cart badge count is correct after adding item', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.assertCartBadgeCount(1);
  });

  test('removing item from main page updates badge', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCart(products.backpack.id);
    await authenticatedPage.removeItemFromCart(products.backpack.id);
    await authenticatedPage.assertCartBadgeCount(0);
    await authenticatedPage.assertCartBadgeNotVisible();
  });
});

test.describe('Filters', () => {
  test('sort A to Z successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('az');
    await authenticatedPage.assertSortedAZ();
  });

  test('sort Z to A successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('za');
    await authenticatedPage.assertSortedZA();
  });

  test('sort price low to high', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('lohi');
    await authenticatedPage.assertSortedPriceLowToHigh();
  });

  test('sort price high to low', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('hilo');
    await authenticatedPage.assertSortedPriceHighToLow();
  });
});

test.describe('Footer', () => {
  test('social media links are visible', async ({ authenticatedPage }) => {
    await authenticatedPage.assertSocialLinks();
  });

  test('Twitter link redirection Success', async ({ authenticatedPage, context }) => {
    await authenticatedPage.assertTwitterLinkOpensNewTab(context);
  });

  test('Facebook link redirection Success', async ({ authenticatedPage, context }) => {
    await authenticatedPage.assertFacebookLinkOpensNewTab(context);
  });

  test('LinkedIn link redirection Success', async ({ authenticatedPage, context }) => {
    await authenticatedPage.assertLinkedInLinkOpensNewTab(context);
  });
});
