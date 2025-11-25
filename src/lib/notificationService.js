import { doc, updateDoc, arrayUnion, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// SMS Service Configuration
const SMS_CONFIG = {
    // For development, we'll use a mock service
    // In production, you'd use services like Twilio, MessageBird, or Indian SMS providers
    provider: 'mock', // 'twilio' | 'messagebird' | 'msg91' | 'mock'
    apiKey: process.env.REACT_APP_SMS_API_KEY,
    senderId: 'VELCYF',
    templates: {
        ORDER_CONFIRMED: 'Dear {name}, your order #{orderId} has been confirmed. Total: ₹{amount}. Track at {trackUrl}',
        ORDER_ASSIGNED: 'Your order #{orderId} has been assigned to {agentName}. Contact: {agentPhone}. Track at {trackUrl}',
        ORDER_PICKED_UP: 'Good news! Your order #{orderId} has been picked up by {agentName} and is on the way. Track: {trackUrl}',
        OUT_FOR_DELIVERY: 'Your order #{orderId} is out for delivery and will arrive soon. Agent: {agentName} ({agentPhone}). Track: {trackUrl}',
        ORDER_DELIVERED: 'Your order #{orderId} has been delivered successfully! Thank you for shopping with Velcy Fashion. Rate your experience: {rateUrl}',
        DELIVERY_FAILED: 'We attempted to deliver your order #{orderId} but couldn\'t reach you. Please contact: {supportPhone}',
        PAYMENT_SUCCESS: 'Payment of ₹{amount} for order #{orderId} successful. Your order will be confirmed shortly.'
    }
}

// Email templates (for email notifications)
const EMAIL_TEMPLATES = {
    ORDER_CONFIRMED: {
        subject: 'Order Confirmed - Velcy Fashion',
        body: 'Your order #{orderId} has been confirmed and will be delivered soon.'
    },
    ORDER_ASSIGNED: {
        subject: 'Delivery Agent Assigned - Order #{orderId}',
        body: 'A delivery agent has been assigned to your order #{orderId}.'
    },
    ORDER_DELIVERED: {
        subject: 'Order Delivered - Thank you for shopping with Velcy Fashion',
        body: 'Your order #{orderId} has been delivered successfully.'
    }
}

class NotificationService {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development'
    }

    // Mock SMS service for development
    async sendMockSMS(to, message, templateName = null) {
        console.log(`📱 [SMS MOCK] To: ${to}`)
        console.log(`📱 [SMS MOCK] Template: ${templateName}`)
        console.log(`📱 [SMS MOCK] Message: ${message}`)
        console.log('---')

        // Simulate SMS delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            success: true,
            messageId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'mock'
        }
    }

    // Real SMS integration would go here
    async sendRealSMS(to, message, templateName = null) {
        try {
            // Example with Twilio (you'd need to install twilio package)
            if (SMS_CONFIG.provider === 'twilio') {
                // const twilio = require('twilio')(SMS_CONFIG.accountSid, SMS_CONFIG.authToken)
                // const result = await twilio.messages.create({
                //     body: message,
                //     from: SMS_CONFIG.senderId,
                //     to: `+91${to}`
                // })
                // return { success: true, messageId: result.sid, provider: 'twilio' }
            }

            // Example with MSG91 (popular Indian SMS service)
            if (SMS_CONFIG.provider === 'msg91') {
                // Implementation would go here
            }

            throw new Error('SMS provider not configured')
        } catch (error) {
            console.error('SMS sending failed:', error)
            return { success: false, error: error.message }
        }
    }

    // Send SMS with template
    async sendSMS(phoneNumber, templateKey, variables = {}) {
        try {
            // Validate phone number (Indian format)
            if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
                throw new Error('Invalid phone number format')
            }

            const template = SMS_CONFIG.templates[templateKey]
            if (!template) {
                throw new Error(`Template ${templateKey} not found`)
            }

            // Replace variables in template
            let message = template
            Object.entries(variables).forEach(([key, value]) => {
                message = message.replace(new RegExp(`{${key}}`, 'g'), value)
            })

            // Add unsubscribe message for compliance
            message += '\n\nReply STOP to unsubscribe'

            // Send SMS
            const result = this.isDevelopment
                ? await this.sendMockSMS(phoneNumber, message, templateKey)
                : await this.sendRealSMS(phoneNumber, message, templateKey)

            // Log notification in Firebase
            await this.logNotification({
                type: 'sms',
                recipient: phoneNumber,
                templateKey,
                message,
                variables,
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                provider: result.provider,
                timestamp: new Date()
            })

            return result
        } catch (error) {
            console.error('Error sending SMS:', error)
            await this.logNotification({
                type: 'sms',
                recipient: phoneNumber,
                templateKey,
                variables,
                status: 'failed',
                error: error.message,
                timestamp: new Date()
            })
            throw error
        }
    }

    // Send email notification
    async sendEmail(email, templateKey, variables = {}) {
        try {
            const template = EMAIL_TEMPLATES[templateKey]
            if (!template) {
                throw new Error(`Email template ${templateKey} not found`)
            }

            // Replace variables in subject and body
            let subject = template.subject
            let body = template.body
            Object.entries(variables).forEach(([key, value]) => {
                subject = subject.replace(new RegExp(`{${key}}`, 'g'), value)
                body = body.replace(new RegExp(`{${key}}`, 'g'), value)
            })

            // In development, just log the email
            if (this.isDevelopment) {
                console.log(`📧 [EMAIL MOCK] To: ${email}`)
                console.log(`📧 [EMAIL MOCK] Subject: ${subject}`)
                console.log(`📧 [EMAIL MOCK] Body: ${body}`)
                console.log('---')

                await this.logNotification({
                    type: 'email',
                    recipient: email,
                    templateKey,
                    subject,
                    body,
                    variables,
                    status: 'sent',
                    provider: 'mock',
                    timestamp: new Date()
                })

                return { success: true, messageId: `EMAIL_MOCK_${Date.now()}` }
            }

            // Real email integration would go here
            // Example with Firebase Extensions, SendGrid, or Amazon SES
            throw new Error('Email service not configured')
        } catch (error) {
            console.error('Error sending email:', error)
            await this.logNotification({
                type: 'email',
                recipient: email,
                templateKey,
                variables,
                status: 'failed',
                error: error.message,
                timestamp: new Date()
            })
            throw error
        }
    }

    // Log notification to Firebase for analytics and debugging
    async logNotification(notificationData) {
        try {
            const notificationsRef = doc(db, 'system', 'notifications')
            await updateDoc(notificationsRef, {
                logs: arrayUnion({
                    ...notificationData,
                    timestamp: serverTimestamp()
                })
            })
        } catch (error) {
            console.error('Error logging notification:', error)
        }
    }

    // Order-related notification methods
    async notifyOrderConfirmation(orderData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            amount: orderData.total,
            trackUrl: `${window.location.origin}/track-order/${orderData.orderId || orderData.id}`
        }

        const promises = []

        // Send SMS if phone number exists
        if (orderData.customerPhone) {
            promises.push(
                this.sendSMS(orderData.customerPhone, 'ORDER_CONFIRMED', variables)
            )
        }

        // Send email if email exists
        if (orderData.customerEmail) {
            promises.push(
                this.sendEmail(orderData.customerEmail, 'ORDER_CONFIRMED', variables)
            )
        }

        return Promise.allSettled(promises)
    }

    async notifyOrderAssigned(orderData, agentData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            agentName: agentData.name,
            agentPhone: agentData.phone,
            trackUrl: `${window.location.origin}/track-order/${orderData.orderId || orderData.id}`
        }

        const promises = []

        if (orderData.customerPhone) {
            promises.push(
                this.sendSMS(orderData.customerPhone, 'ORDER_ASSIGNED', variables)
            )
        }

        if (orderData.customerEmail) {
            promises.push(
                this.sendEmail(orderData.customerEmail, 'ORDER_ASSIGNED', variables)
            )
        }

        return Promise.allSettled(promises)
    }

    async notifyOrderPickedUp(orderData, agentData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            agentName: agentData.name,
            trackUrl: `${window.location.origin}/track-order/${orderData.orderId || orderData.id}`
        }

        if (orderData.customerPhone) {
            return this.sendSMS(orderData.customerPhone, 'ORDER_PICKED_UP', variables)
        }
    }

    async notifyOrderOutForDelivery(orderData, agentData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            agentName: agentData.name,
            agentPhone: agentData.phone,
            trackUrl: `${window.location.origin}/track-order/${orderData.orderId || orderData.id}`
        }

        if (orderData.customerPhone) {
            return this.sendSMS(orderData.customerPhone, 'OUT_FOR_DELIVERY', variables)
        }
    }

    async notifyOrderDelivered(orderData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            rateUrl: `${window.location.origin}/track-order/${orderData.orderId || orderData.id}`
        }

        const promises = []

        if (orderData.customerPhone) {
            promises.push(
                this.sendSMS(orderData.customerPhone, 'ORDER_DELIVERED', variables)
            )
        }

        if (orderData.customerEmail) {
            promises.push(
                this.sendEmail(orderData.customerEmail, 'ORDER_DELIVERED', variables)
            )
        }

        return Promise.allSettled(promises)
    }

    async notifyPaymentSuccess(orderData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            amount: orderData.total
        }

        if (orderData.customerPhone) {
            return this.sendSMS(orderData.customerPhone, 'PAYMENT_SUCCESS', variables)
        }
    }

    async notifyDeliveryFailed(orderData) {
        const variables = {
            name: orderData.customerName || 'Customer',
            orderId: orderData.orderId || orderData.id,
            supportPhone: '+91-9876543210' // Your support number
        }

        if (orderData.customerPhone) {
            return this.sendSMS(orderData.customerPhone, 'DELIVERY_FAILED', variables)
        }
    }

    // Agent notification methods
    async notifyAgentAssignment(agentData, orderData) {
        const variables = {
            name: agentData.name,
            orderId: orderData.orderId || orderData.id,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            amount: orderData.total,
            customerAddress: orderData.address?.address
        }

        if (agentData.phone) {
            // Use a different template for agent notifications
            const message = `New order assigned: #{orderId} for {customerName} ({customerPhone}). Amount: ₹{amount}. Address: {customerAddress}.`

            return this.sendMockSMS(agentData.phone, message, 'AGENT_ASSIGNMENT')
        }
    }

    // Get notification statistics
    async getNotificationStats(timeRange = '24h') {
        try {
            const notificationsRef = doc(db, 'system', 'notifications')
            const docSnap = await getDoc(notificationsRef)

            if (!docSnap.exists()) {
                return { total: 0, sent: 0, failed: 0, sms: 0, email: 0 }
            }

            const logs = docSnap.data().logs || []
            const now = new Date()
            let cutoffTime

            switch (timeRange) {
                case '1h':
                    cutoffTime = new Date(now.getTime() - 60 * 60 * 1000)
                    break
                case '24h':
                    cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                    break
                case '7d':
                    cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    break
                default:
                    cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            }

            const filteredLogs = logs.filter(log => {
                const logTime = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp)
                return logTime >= cutoffTime
            })

            return {
                total: filteredLogs.length,
                sent: filteredLogs.filter(log => log.status === 'sent').length,
                failed: filteredLogs.filter(log => log.status === 'failed').length,
                sms: filteredLogs.filter(log => log.type === 'sms').length,
                email: filteredLogs.filter(log => log.type === 'email').length
            }
        } catch (error) {
            console.error('Error fetching notification stats:', error)
            return { total: 0, sent: 0, failed: 0, sms: 0, email: 0 }
        }
    }
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService

// Export for easy use in components
export const sendSMS = (...args) => notificationService.sendSMS(...args)
export const sendEmail = (...args) => notificationService.sendEmail(...args)
export const notifyOrderConfirmation = (...args) => notificationService.notifyOrderConfirmation(...args)
export const notifyOrderAssigned = (...args) => notificationService.notifyOrderAssigned(...args)
export const notifyOrderPickedUp = (...args) => notificationService.notifyOrderPickedUp(...args)
export const notifyOrderOutForDelivery = (...args) => notificationService.notifyOrderOutForDelivery(...args)
export const notifyOrderDelivered = (...args) => notificationService.notifyOrderDelivered(...args)
export const notifyPaymentSuccess = (...args) => notificationService.notifyPaymentSuccess(...args)
export const notifyDeliveryFailed = (...args) => notificationService.notifyDeliveryFailed(...args)
export const notifyAgentAssignment = (...args) => notificationService.notifyAgentAssignment(...args)
export const getNotificationStats = (...args) => notificationService.getNotificationStats(...args)
