import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/ui-pages/login.page';
import { InventoryPage } from '../pages/ui-pages/inventory.page';
import { CartPage } from '../pages/ui-pages/cart.page';
import { CheckoutPage } from '../pages/ui-pages/checkout.page';
import { ProductPage } from '../pages/ui-pages/product.page';
import { users } from '../test-data/users';

type UIFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  authenticatedPage: InventoryPage;
};

export const test = base.extend<UIFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.assertOnInventoryPage();
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
