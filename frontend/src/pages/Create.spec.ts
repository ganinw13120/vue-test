import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';

import CreatePage from './Create.vue';
import { useProductStore } from '@/stores/product';
import type { Product } from '@/models/product.ts';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const globalStubs = {
  Navbar: true,
  ProductForm: true,
};

describe('CreatePage', () => {
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
  let mockRouter: any;

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    mockRouter = { push: vi.fn() };
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it('should render ProductForm passing initial data when state resolves', async () => {
    const store = useProductStore(pinia);

    const wrapper = mount(CreatePage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    await vi.dynamicImportSettled();

    const formStub = wrapper.findComponent('product-form-stub');
    expect(formStub.exists()).toBe(true);
    expect(formStub.props('submitButtonText')).toBe('Create new product');
  });

  it('should execute create product and route redirect', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);
    const createProductSpy = vi.spyOn(store, 'createProduct').mockResolvedValue(undefined as any);

    const wrapper = mount(CreatePage, {
      props: {},
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    await vi.dynamicImportSettled();

    const formStub = wrapper.findComponent('product-form-stub');
    
    await formStub.vm.$emit('submit', product);

    expect(createProductSpy).toHaveBeenCalledWith(product);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should trigger router redirect back to home page', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(CreatePage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    const backButton = wrapper.get('button.secondary-button');
    await backButton.trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});