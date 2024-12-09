import { getCartId } from 'components/cart/actions';
import { ProductList } from 'components/product/product-list';
import { Wrapper } from 'components/wrapper';
import { getCart, getCollectionProducts } from 'lib/fourthwall';

export const metadata = {
  description: 'This is what riemann dreamed of',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage({ searchParams }: { searchParams: { currency?: string } }) {
  const cartId = await getCartId();
  const currency = (await searchParams).currency || 'GBP';
  const cart = getCart(cartId, currency);
  const products = await getCollectionProducts({ collection: 'commutator', currency });

  return (
    <Wrapper currency={currency} cart={cart}>
      <ProductList products={products} />
    </Wrapper>
  );
}
