import { ReadonlyURLSearchParams } from 'next/navigation';
import { SIZE_LABELS } from './constants';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'NEXT_PUBLIC_FW_API_URL',
    'NEXT_PUBLIC_FW_STOREFRONT_TOKEN',
    'NEXT_PUBLIC_FW_COLLECTION',
    'NEXT_PUBLIC_FW_CHECKOUT',
    'NEXT_PUBLIC_VERCEL_URL'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/fourthwall#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }
};

export const formatPrice = ({
  amount,
  currencyCode: currency
}: {
  amount: number | string;
  currencyCode: string;
}) => {
  /* @ts-ignore */
  amount = parseInt(amount);
  return `${currency === 'USD' ? '\\' : ''}${new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount)}`;
};

export const dynamicSizeLabels = (sizes: string[]) => {
  return {
    ...sizes.reduce((a, c) => ({ ...a, [c]: c }), {}),
    ...SIZE_LABELS
  };
};
