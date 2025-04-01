'use client';

import { Transition } from '@headlessui/react';
import { updateItemQuantity } from 'components/cart/actions';
import 'katex/dist/katex.min.css';
import { formatPrice } from 'lib/utils';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Latex from 'react-latex-next';
import { SIZE_LABELS } from '../../lib/constants';
import ImageWrapper from '../image-wrapper';
import { redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import s from './cart-modal.module.css';

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const quantityRef = useRef(cart?.totalQuantity);

  useEffect(() => {
    if (cart?.totalQuantity !== quantityRef.current) {
      if (cart?.totalQuantity && cart?.totalQuantity > 0 && !isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const sizeLabels = SIZE_LABELS;
  // const sizeLabels = useMemo(
  //   () =>
  //     dynamicSizeLabels([
  //       ...new Set(cart?.lines.map((x) => x.merchandise.selectedOptions.size || ''))
  //     ]),
  //   [cart]
  // );

  return (
    <>
      <button className={s.cartIcon} onClick={() => setIsOpen(true)}>
        <Latex>$f$</Latex>
      </button>

      <Transition show={isOpen}>
        <div className={`${s.container} transition duration-200 ease-in data-[closed]:opacity-0`}>
          <div className={s.backdrop} onClick={() => setIsOpen(false)} />
          <div className={s.mobileClose} onClick={() => setIsOpen(false)}>
            <Latex>$\bigotimes$</Latex>
          </div>
          <div className={s.modal}>
            <div className={s.title}>
              <Latex>$\text{`{Cart}`}$</Latex>
            </div>

            {cart?.lines.length ? (
              <div className={s.itemList}>
                {cart.lines.map((p, i) => (
                  <div key={`item-${i}`} className={s.item}>
                    <div className={s.itemImg}>
                      <ImageWrapper
                        priority={true}
                        width={89}
                        height={119}
                        alt="shirt"
                        src={p.merchandise.product.featuredImage.url}
                      />
                    </div>

                    <div className={s.itemInfo}>
                      <div className={s.itemTitle}>
                        <Latex>$\text{`{${p.merchandise.product.title}}`}$</Latex>
                      </div>

                      <div className={s.colorAndSize}>
                        <div
                          className={s.swatch}
                          style={{ background: p.merchandise.selectedOptions.color }}
                        />
                        <Latex>
                          $\ \ * \ \ \aleph_
                          {`{\\mathcal{${sizeLabels[p.merchandise.selectedOptions.size as keyof typeof sizeLabels]}}}`}
                          $
                        </Latex>
                      </div>

                      <div className={s.quantity}>
                        <form
                          action={async () => {
                            updateCartItem(p.merchandise.id, 'minus');
                            await formAction.bind(null, {
                              merchandiseId: p.merchandise.id,
                              quantity: p.quantity - 1
                            })();
                          }}
                        >
                          <button className={s.quantityBtn}>
                            <Latex>$-$</Latex>
                          </button>
                        </form>

                        <div className={s.quantityNum}>
                          <Latex>$\text{`{${p.quantity}}`}$</Latex>
                        </div>

                        <form
                          action={async () => {
                            updateCartItem(p.merchandise.id, 'plus');
                            await formAction.bind(null, {
                              merchandiseId: p.merchandise.id,
                              quantity: p.quantity + 1
                            })();
                          }}
                        >
                          <button className={`${s.quantityBtn} ${s.quantityBtnAdd}`}>
                            <Latex>$+$</Latex>
                          </button>
                        </form>
                      </div>

                      <div className={s.itemPrice}>
                        <Latex>
                          $\text
                          {`{${formatPrice({ amount: p.cost.totalAmount.amount, currencyCode: p.cost.totalAmount.currencyCode })}}`}
                          $
                        </Latex>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={s.emptyCart}>
                <Latex>$\emptyset$</Latex>
              </div>
            )}

            <div className={s.modalBottom}>
              <div className={s.totalPrice}>
                {!!cart?.lines.length && (
                  <Latex>$\text{`{${formatPrice(cart.cost.totalAmount)}}`}$</Latex>
                )}
              </div>

              {/* @ts-ignore */}
              <form action={() => redirectToCheckout(cart?.currency || 'GBP')}>
                <CheckoutButton disabled={!cart?.lines.length} />
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

function CheckoutButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button className={s.checkoutBtn} disabled={disabled}>
      {pending ? (
        <Latex>$\textit{`{Loading...}`}$</Latex>
      ) : (
        <Latex>$f_*(\mathscr{`{C}`})(U)$</Latex>
      )}
    </button>
  );
}
