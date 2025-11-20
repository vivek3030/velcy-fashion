# Deployment Guide for VelcyFashion

This guide will help you deploy your VelcyFashion e-commerce website to production.

## Prerequisites

1.  **Firebase Project**: You need a Firebase project set up.
2.  **Razorpay Account**: You need a Razorpay account for payments.
3.  **GitHub Account**: Recommended for continuous deployment.
4.  **Netlify or Vercel Account**: Recommended hosting providers.

## Step 1: Environment Variables

Create a `.env` file in the root directory (copy from `.env.example` if available) and fill in your actual credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 2: Firebase Security Rules

1.  Go to your Firebase Console -> Firestore Database -> Rules.
2.  Copy the contents of `firestore.rules` from this project and paste them into the editor.
3.  Publish the rules.

## Step 3: Build for Production

Run the following command to create a production build:

```bash
npm run build
```

This will create a `dist` folder containing your optimized website.

## Step 4: Deploy to Netlify (Recommended)

1.  **Drag and Drop**: You can simply drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop).
2.  **Git Integration (Better)**:
    *   Push your code to GitHub.
    *   Log in to Netlify and click "New site from Git".
    *   Select your repository.
    *   Build command: `npm run build`
    *   Publish directory: `dist`
    *   **Important**: Go to Site Settings -> Environment Variables and add all your `.env` variables there.

## Step 5: Admin Access

To make a user an admin:
1.  Sign up/Login with the phone number you want to be an admin.
2.  Go to Firebase Console -> Firestore Database -> `users` collection.
3.  Find the document with the user's UID.
4.  Change the `role` field from `'user'` to `'admin'`.
5.  Refresh the website, and you should see the Admin Dashboard.

## Step 6: Razorpay Integration

Currently, the payment button is a mock. To integrate real payments:
1.  Install Razorpay SDK: `npm install razorpay` (backend) or use the frontend script.
2.  Update `src/pages/Checkout.jsx` to call the Razorpay API.

Enjoy your new e-commerce store!
