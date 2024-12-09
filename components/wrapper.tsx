import { Cart } from 'lib/types';
import { ReactNode } from 'react';
import { CartProvider } from './cart/cart-context';
import CartModal from './cart/cart-modal';

export function Wrapper({
  children,
  currency,
  cart
}: {
  children: ReactNode;
  currency: string;
  cart: Promise<Cart | undefined>;
}) {
  return (
    <CartProvider cartPromise={cart}>
      <CartModal />
      {children}
    </CartProvider>
  );
}
