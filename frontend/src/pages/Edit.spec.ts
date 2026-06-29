import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';

import EditPage from './Edit.vue';
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

describe('EditPage', () => {
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

  it('should fetch product details on mounted', async () => {
    const store = useProductStore(pinia);
    const detailSpy = vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(EditPage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    await vi.dynamicImportSettled();

    expect(detailSpy).toHaveBeenCalledWith('1');
    expect(wrapper.text()).toContain('Edit - Be The King: Judge Destiny - Name');
  });

  it('should not render ProductForm layout until the backend data returns', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockImplementation(() => new Promise(() => {}));

    const wrapper = mount(EditPage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    expect(wrapper.findComponent('product-form-stub').exists()).toBe(false);
  });

  it('should render ProductForm passing initial data when state resolves', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(EditPage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    await vi.dynamicImportSettled();

    const formStub = wrapper.findComponent('product-form-stub');
    expect(formStub.exists()).toBe(true);
    expect(formStub.props('initialData')).toEqual(product);
    expect(formStub.props('submitButtonText')).toBe('Save Changes');
  });

  it('should execute update and route redirect on form submission', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);
    const updateSpy = vi.spyOn(store, 'updateProduct').mockResolvedValue(undefined as any);

    const wrapper = mount(EditPage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    await vi.dynamicImportSettled();

    const updatedFormData = { ...product, name: 'Mutated Custom Name Title' };
    const formStub = wrapper.findComponent('product-form-stub');
    
    await formStub.vm.$emit('submit', updatedFormData);

    expect(updateSpy).toHaveBeenCalledWith('1', updatedFormData);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should trigger router redirect back to details view when click back button', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(EditPage, {
      props: { id: '1' },
      global: {
        plugins: [pinia],
        stubs: globalStubs,
      },
    });

    const backButton = wrapper.get('button.secondary-button');
    await backButton.trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/products/1');
  });
});