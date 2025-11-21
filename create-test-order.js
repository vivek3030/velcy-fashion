// Test script to create a sample order in Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createTestOrder() {
    try {
        const orderData = {
            userId: '+919999999999', // Mock user ID
            orderNumber: `VF-${Date.now()}`,
            items: [
                {
                    id: 1,
                    name: 'Kanjivaram Silk Saree',
                    price: 12999,
                    quantity: 1,
                    selectedColor: '#800000',
                    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop'
                }
            ],
            shippingAddress: {
                name: 'Test User',
                mobile: '9876543210',
                address: '123 Test Street',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001',
                landmark: 'Near Test Mall'
            },
            subtotal: 12999,
            shipping: 0,
            total: 12999,
            status: 'pending',
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        console.log('✅ Test order created successfully!');
        console.log('Order ID:', docRef.id);
        console.log('Order Number:', orderData.orderNumber);
        console.log('Total Amount: ₹', orderData.total);
        console.log('\nYou can now test the admin panel at http://localhost:5173/admin/orders');

        return docRef.id;
    } catch (error) {
        console.error('❌ Error creating test order:', error);
        throw error;
    }
}

createTestOrder();
