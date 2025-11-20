# Deploying via GitHub

Deploying "to GitHub" usually means one of two things:
1.  **GitHub Pages**: Hosting the site directly on GitHub (Good, but requires extra config for React).
2.  **GitHub + Vercel/Netlify (Recommended)**: You push your code to GitHub, and Vercel/Netlify automatically builds and hosts it. This is the **industry standard** for React apps because it handles routing and performance automatically.

Here is the recommended workflow:

## Step 1: Push Code to GitHub

1.  **Create a Repository**:
    *   Go to [GitHub.com](https://github.com) and sign in.
    *   Click the **+** icon in the top right -> **New repository**.
    *   Name it `velcy-fashion`.
    *   Make it **Public** or **Private**.
    *   **Do not** check "Initialize with README" (we already have code).
    *   Click **Create repository**.

2.  **Push your code**:
    Open your terminal in the project folder and run these commands (copy-paste from GitHub's "…or push an existing repository..." section):

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/velcy-fashion.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

## Step 2: Connect to Vercel (Easiest & Best Performance)

1.  Go to [Vercel.com](https://vercel.com) and sign up with **GitHub**.
2.  Click **"Add New..."** -> **"Project"**.
3.  You will see your `velcy-fashion` repository. Click **Import**.
4.  **Configure Project**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables** (CRITICAL):
        *   Copy all values from your `.env` file.
        *   Add them here one by one (e.g., `VITE_FIREBASE_API_KEY`, `VITE_RAZORPAY_KEY_ID`, etc.).
5.  Click **Deploy**.

## Why not just GitHub Pages?
GitHub Pages is great for static HTML, but for React Apps with routing (like `/shop`, `/checkout`), it often breaks when you refresh the page unless you add complex configuration. Vercel handles this out of the box.
