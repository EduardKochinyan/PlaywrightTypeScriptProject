export interface ShippingInfo {
  firstName: string;
  lastName?: string;
  postalCode?: string;
}

export const shippingData = {
  standard: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  errorUser: {
    firstName: 'Eduard',
    lastName: 'Kochinyan',
    postalCode: '123321',
  },
  missingLastName: {
    firstName: 'John',
  },
  missingPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
  },
} satisfies Record<string, ShippingInfo>;
