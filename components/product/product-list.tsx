'use client';

import { Product } from 'lib/types';
import { Link } from 'next-view-transitions';
import s from './product-list.module.css';

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className={s.container}>
      <div className={s.listContainer}>
        {products.map((p) => (
          <Link className={s.product} href={`/product/${p.handle}`} prefetch={true} key={p.id}>
            <img src={p.featuredImage.url} className={s.productImg} />
          </Link>
        ))}
      </div>
    </div>
  );
}