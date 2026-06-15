export interface Product {
  id: string;
  name: string;
  price: number;
  descriptionSnippet?: string;
}

export const products = {
  backpack:    { id: 'sauce-labs-backpack',            name: 'Sauce Labs Backpack',           price: 29.99, descriptionSnippet: 'carry.allTheThings()' },
  bikeLight:   { id: 'sauce-labs-bike-light',          name: 'Sauce Labs Bike Light',          price: 9.99  },
  boltTShirt:  { id: 'sauce-labs-bolt-t-shirt',        name: 'Sauce Labs Bolt T-Shirt',        price: 15.99 },
  fleeceJacket:{ id: 'sauce-labs-fleece-jacket',       name: 'Sauce Labs Fleece Jacket',       price: 49.99 },
  onesie:      { id: 'sauce-labs-onesie',              name: 'Sauce Labs Onesie',              price: 7.99  },
  redTShirt:   { id: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
} satisfies Record<string, Product>;
