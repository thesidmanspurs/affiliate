import ProductListClient, { AdminProduct } from './ProductListClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let products: AdminProduct[] = [];

  try {
    const res = await fetch('http://localhost:4100/api/admin/products', { cache: 'no-store' });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error('Failed to load admin products:', err);
  }

  return <ProductListClient initialProducts={products} />;
}
