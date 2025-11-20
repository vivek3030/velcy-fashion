import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should add item to cart and proceed to checkout', async ({ page }) => {
        // 1. Go to Shop
        await page.goto('/shop');

        // 2. Click on a product
        await page.getByText('Kanjivaram Silk Saree').first().click();
        await expect(page).toHaveURL(/.*product/);

        // 3. Add to Cart
        await page.getByRole('button', { name: 'Add to Cart' }).click();

        // 4. Wait for cart drawer to open (AddToCart automatically opens it)
        await page.waitForSelector('[data-testid="checkout-link"]', { state: 'visible', timeout: 5000 });

        // 5. Click Checkout
        await page.getByTestId('checkout-link').click();

        // 6. Should redirect to Login if not authenticated
        await expect(page).toHaveURL(/.*checkout|.*login/);
    });
});
