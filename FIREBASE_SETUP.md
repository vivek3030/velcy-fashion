# Firebase Setup Guide for VelcyFashion

Follow these steps to set up your Firebase project and get the necessary credentials.

## Step 1: Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on **"Create a project"** (or "Add project").
3.  Enter a project name (e.g., `VelcyFashion`).
4.  You can disable Google Analytics for now (it simplifies setup).
5.  Click **"Create project"**.

## Step 2: Register the Web App
1.  Once the project is ready, click **"Continue"**.
2.  On the project overview page, look for the **Web** icon (it looks like `</>`) under "Get started by adding Firebase to your app". Click it.
3.  Enter an App nickname (e.g., `VelcyFashion Web`).
4.  Click **"Register app"**.
5.  **IMPORTANT**: You will see a code block with `const firebaseConfig = { ... }`.
6.  **COPY** the values inside this object. We need:
    *   `apiKey`
    *   `authDomain`
    *   `projectId`
    *   `storageBucket`
    *   `messagingSenderId`
    *   `appId`

## Step 3: Enable Authentication (Phone Login)
1.  In the left sidebar, click on **"Build"** -> **"Authentication"**.
2.  Click **"Get started"**.
3.  Click on the **"Sign-in method"** tab.
4.  Click on **"Phone"**.
5.  **Enable** it.
6.  (Optional) Add a test phone number for yourself (e.g., `9999999999` and code `123456`) so you don't use your real SMS quota during testing.
7.  Click **"Save"**.

## Step 4: Enable Firestore Database
1.  In the left sidebar, click on **"Build"** -> **"Firestore Database"**.
2.  Click **"Create database"**.
3.  Choose a location (e.g., `asia-south1` for Mumbai/India, or leave default).
4.  Start in **Test mode** (we will update rules later).
5.  Click **"Create"**.

## Step 5: Enable Storage (For Images)
1.  In the left sidebar, click on **"Build"** -> **"Storage"**.
2.  Click **"Get started"**.
3.  Start in **Test mode**.
4.  Click **"Done"**.

## Step 6: Send me the Credentials
Once you have the `firebaseConfig` values from Step 2, please reply with them in this format:

```
apiKey: ...
authDomain: ...
projectId: ...
storageBucket: ...
messagingSenderId: ...
appId: ...
```
