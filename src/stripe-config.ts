export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const PRODUCTS: Record<string, StripeProduct> = {
  PURCHASE_SALE: {
    priceId: 'price_1RT566QLnd69H9mmQFvvCeoy',
    name: 'Купле продажа',
    description: 'Доступ к шаблонам договоров купли-продажи',
    mode: 'subscription'
  }
};