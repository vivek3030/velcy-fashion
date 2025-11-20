import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should add item to cart and proceed to checkout', async ({ page }) => {
        // 1. Go to Shop
        await page.goto('/shop');

        // 2. Click on a product (wait for it to be visible)
        const productLink = page.getByText('Kanjivaram Silk Saree').first();
        await expect(productLink).toBeVisible({ timeout: 10000 });
        await productLink.click();
        await expect(page).toHaveURL(/.*product/);

        // 3. Add to Cart
        await page.getByRole('button', { name: 'Add to Cart' }).click();

        // 4. Wait for cart drawer to open (AddToCart automatically opens it)
        // Use the new test id for reliability
        const checkoutLink = page.getByTestId('checkout-link');
        await expect(checkoutLink).toBeVisible({ timeout: 5000 });

        // 5. Click Checkout
        await checkoutLink.click();

        // 6. Should redirect to Login if not authenticated (assuming test starts unauthenticated)
        await expect(page).toHaveURL(/.*login/);
    });
});