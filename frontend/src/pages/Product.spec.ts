import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';

import ProductPage from './Product.vue';
import { useProductStore } from '@/stores/product';
import type { Product } from '@/models/product.ts';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const globalStubs = {
  Navbar: true,
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
    variableDenomPriceMinAmount: '10.00',
    variableDenomPriceMaxAmount: '50.00',
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

  it('should render detailed product information on data loads', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    await vi.dynamicImportSettled();

    expect(wrapper.text()).toContain('Be The King: Judge Destiny (Canada) - Codashop');
    expect(wrapper.text()).toContain('Top Up Be The King Gold in Codashop');
    expect(wrapper.text()).toContain('$10.00 - $50.00');
    expect(wrapper.text()).toContain('Be The King: Judge Destiny - Name');
    expect(wrapper.text()).toContain('Discount');
  });

  it('should render loading indicator state when isLoading is true', async () => {
    const store = useProductStore(pinia);
    store.isLoading = true;
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    expect(wrapper.text()).toContain('loading...');
  });

  it('should render caught exception strings when details request failure path executes', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockRejectedValue('Something went wrong' as any);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    await vi.dynamicImportSettled();

    expect(wrapper.text()).toContain('Something went wrong');
  });

  it('should render product logo image node if it exists', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    await vi.dynamicImportSettled();

    const image = wrapper.get('img');
    expect(image.attributes('src')).toBe('https://test.com/logo.png');
  });

  it('should not render product logo image node if logo location string is missing', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue({
      ...product,
      logoLocation: '',
    });

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    await vi.dynamicImportSettled();

    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('should trigger router redirect back to home page when click back button', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    const backButton = wrapper.get('[data-test="back-button"]');
    await backButton!.trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should trigger router routing path modification when edit button fires clicks', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    const editButton = wrapper.get('[data-test="edit-button"]');
    await editButton!.trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/products/1/edit');
  });

  it('should call deleteProduct action and route back to root home view when delete button fires', async () => {
    const store = useProductStore(pinia);
    vi.spyOn(store, 'getProductDetail').mockResolvedValue(product);
    const deleteSpy = vi.spyOn(store, 'deleteProduct').mockResolvedValue(undefined as any);

    const wrapper = mount(ProductPage, {
      props: { id: '1' },
      global: { plugins: [pinia], stubs: globalStubs },
    });

    await vi.dynamicImportSettled();

    // Locate the third action button ("Delete")
    const deleteButton = wrapper.get('[data-test="delete-button"]');
    await deleteButton.trigger('click');

    expect(deleteSpy).toHaveBeenCalledWith('1');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});