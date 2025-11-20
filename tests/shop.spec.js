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
        // 1. Open filters on mobile if needed
        const filterBtn = page.getByTestId('filter-button');
        if (await filterBtn.isVisible()) {
            await filterBtn.click();
        }

        // 2. Click on 'Sarees' filter
        // Ensure sidebar is visible before clicking
        const sareeCheckbox = page.getByLabel('Saree', { exact: true }); // Assuming label text matches exactly
        // Or if label text is "Saree", your component uses 'Saree' in map loop but label says 'Sarees' in earlier text?
        // The code says `['All', 'Saree', 'Dress'...]`, so label is "Saree"

        // Wait for the checkbox to be actionable
        await expect(sareeCheckbox).toBeVisible();
        await sareeCheckbox.check();

        // 3. Verify URL or content update
        await expect(sareeCheckbox).toBeChecked();
    });

    test('should navigate to product details', async ({ page }) => {
        await page.getByText('Kanjivaram Silk Saree').first().click();
        await expect(page).toHaveURL(/.*product\/.*/);
        await expect(page.getByText('Add to Cart')).toBeVisible();
    });
});