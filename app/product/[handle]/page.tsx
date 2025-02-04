import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCartId } from 'components/cart/actions';
import { ProductProvider } from 'components/product/product-context';
import ProductDetails from 'components/product/product-details';
import { Wrapper } from 'components/wrapper';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getCart, getProduct } from 'lib/fourthwall';

export async function generateMetadata({
  params
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const product = await getProduct({ handle: (await params).handle, currency: 'GBP' });

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.title,
    description: product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({
  params,
  searchParams
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ currency?: string }>;
}) {
  const currency = (await searchParams).currency || 'GBP';
  const cartId = await getCartId();
  const cart = getCart(cartId, currency);

  const product = await getProduct({
    handle: (await params).handle,
    currency
  });

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <Wrapper currency={currency} cart={cart}>
      <ProductProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd)
          }}
        />
        <ProductDetails product={product}></ProductDetails>
      </ProductProvider>
    </Wrapper>
  );
}
