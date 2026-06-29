import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

import ProductPage from './Home.vue';
import ProductListItem from '@/components/product/ListItem.vue';
import { useProductStore } from '@/stores/product';
import type { Product } from '@/models/product.ts';

// Stub child components that don't affect this test scope directly
const globalStubs = {
  Navbar: true,
  SearchBox: true,
  'router-link': true,
};

describe('ProductPage', () => {
  const product: Product = {
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

  let pinia: any;

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });
  });

  it('should render loading indicator state when isLoading variable is true', async () => {
    const store = useProductStore(pinia);
    store.isLoading = true;
    store.products = [];

    const wrapper = mount(ProductPage, {
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    expect(wrapper.text()).toContain('loading...');
  });

  it('should loop and render a list of ProductListItem from products', async () => {
    const store = useProductStore(pinia);
    store.isLoading = false;
    store.products = [
      product,
      { ...product, id: 2, name: 'Second Game Premium' }
    ];

    const wrapper = mount(ProductPage, {
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    const listItems = wrapper.findAllComponents(ProductListItem);

    expect(listItems).toHaveLength(2);
    expect(listItems[0].props('product')).toEqual(product);
    expect(listItems[1].props('product').name).toBe('Second Game Premium');
    expect(wrapper.text()).not.toContain('loading...');
  });

  it('should trigger loadProduct action passing the keyword text when SearchBox emits search event', async () => {
    const store = useProductStore(pinia);
    const loadProductSpy = vi.spyOn(store, 'loadProduct').mockResolvedValue(undefined as any);

    const wrapper = mount(ProductPage, {
      global: {
        plugins: [pinia],
        stubs: {
          Navbar: true,
          'router-link': true,
          SearchBox: true
        },
      },
    });

    const searchBoxComponent = wrapper.findComponent('search-box-stub') as any;
    await searchBoxComponent.vm.$emit('search', 'mechanist');

    expect(loadProductSpy).toHaveBeenCalledWith('mechanist');
  });
});