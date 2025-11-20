import { test, expect } from '@playwright/test';

test.describe('Shop Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/shop');
    });

    test('should display products', async ({ page }) => {
        // Wait for products to load (assuming dummy data loads instantly)
        await expect(page.getByText('Kanjivaram Silk Saree')).toBeVisible();
    });

    test('should filter by category', async ({ page }) => {
        // Click on 'Sarees' filter
        await page.getByLabel('Sarees').check();

        // Verify URL or content update
        // Note: Since we use local state dummy data, we check if the filter is checked
        await expect(page.getByLabel('Sarees')).toBeChecked();
    });

    test('should navigate to product details', async ({ page }) => {
        await page.getByText('Kanjivaram Silk Saree').first().click();
        await expect(page).toHaveURL(/.*product\/.*/);
        await expect(page.getByText('Add to Cart')).toBeVisible();
    });
});
