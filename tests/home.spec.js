import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display hero section with correct text', async ({ page }) => {
        await expect(page.getByText('Timeless Elegance,')).toBeVisible();
        await expect(page.getByText('Modern Soul')).toBeVisible();
        await expect(page.getByText('Discover our exclusive collection')).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
        await page.getByRole('link', { name: 'Shop Sarees' }).click();
        await expect(page).toHaveURL(/.*shop\?category=sarees/);

        await page.goto('/');
        await page.getByRole('link', { name: 'Explore Dresses' }).click();
        await expect(page).toHaveURL(/.*shop\?category=dresses/);
    });

    test('should display featured collections', async ({ page }) => {
        await expect(page.getByText('Curated Collections')).toBeVisible();
        await expect(page.getByText('Wedding Edit')).toBeVisible();
        await expect(page.getByText('Festive Glam')).toBeVisible();
        await expect(page.getByText('Casual Chic')).toBeVisible();
    });

    test('should display footer with contact info', async ({ page }) => {
        await expect(page.getByText('Contact Us')).toBeVisible();
        await expect(page.getByText('Tulsi Arcade')).toBeVisible();
        await expect(page.getByText('+91 91061 18628')).toBeVisible();
    });
});
