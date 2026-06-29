import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ProductItem from './ListItem.vue';
import type { Product } from '@/models/product.ts';

describe('ProductItem', () => {
  const product : Product = {
      id: 1,
      gvtId: 99,
      name: 'Be The King: Judge Destiny - Name',
      productTagline: 'Top Up Be The King Gold in Codashop',
      shortDescription: '<a>Short description...</a>',
      longDescription: '<a>Long description...</a>',
      logoLocation: 'https://test.com/logo.png',
      productUrl: 'http://localhost.com',
      voucherTypeName: 'Discount',
      orderUrl: 'http://localhost.com',
      productTitle: 'Be The King: Judge Destiny (Canada) - Codashop',
      variableDenomPriceMinAmount: '0.0',
      variableDenomPriceMaxAmount: '0.0',
  };

  it('should render product information', () => {
    const wrapper = mount(ProductItem, {
      props: { product },
    });

    expect(wrapper.text()).toContain('Be The King: Judge Destiny - Name');
    expect(wrapper.text()).toContain('Be The King: Judge Destiny (Canada) - Codashop');
  });

  it('should render anchor to navigate into product page', () => {
    const wrapper = mount(ProductItem, {
      props: { product },
    });

    const link = wrapper.get('a');

    expect(link.attributes('href')).toBe('/products/1');
  });

  it('should render product logo if existed', () => {
    const wrapper = mount(ProductItem, {
      props: { product },
    });

    const image = wrapper.get('img');

    expect(image.attributes('src')).toBe(
      'https://test.com/logo.png',
    );
  });

  it('should not render product logo if product logo is not existed', () => {
    const wrapper = mount(ProductItem, {
      props: {
        product: {
          ...product,
          logoLocation: '',
        },
      },
    });

    expect(wrapper.find('img').exists()).toBe(false);
  });
});