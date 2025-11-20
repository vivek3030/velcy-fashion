# Razorpay Setup Guide for VelcyFashion

To accept real online payments, you need a Razorpay account.

## Step 1: Create an Account
1.  Go to [Razorpay](https://razorpay.com/).
2.  Sign up for a new account.

## Step 2: Generate API Keys
1.  Log in to your Razorpay Dashboard.
2.  In the left sidebar, go to **Settings**.
3.  Click on the **API Keys** tab.
4.  Click **Generate Key**.
5.  You will see a **Key ID** and a **Key Secret**.
    *   **Key ID**: This is what we need for the website (starts with `rzp_test_` or `rzp_live_`).
    *   **Key Secret**: Keep this safe, but we don't strictly need it for the frontend checkout (though it's good to have).

## Step 3: Test vs Live Mode
*   **Test Mode**: Use this first! It lets you simulate payments without spending real money. The key starts with `rzp_test_`.
*   **Live Mode**: Once you have verified everything works, you can switch to Live Mode. You will need to submit KYC documents to Razorpay to activate Live Mode. The key starts with `rzp_live_`.

## Step 4: Send me the Key ID
Please reply with your **Key ID**.

Example: `rzp_test_1234567890abcdef`
