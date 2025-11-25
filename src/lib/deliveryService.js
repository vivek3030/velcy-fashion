import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

// Delivery Agent Service
export const deliveryAgentService = {
    // Create a new delivery agent
    async createAgent(agentData) {
        try {
            const agentWithTimestamp = {
                ...agentData,
                status: agentData.status || 'active',
                totalDeliveries: agentData.totalDeliveries || 0,
                averageRating: agentData.averageRating || 0,
                joinedAt: Timestamp.now(),
                currentLocation: {
                    latitude: agentData.currentLocation?.latitude || null,
                    longitude: agentData.currentLocation?.longitude || null,
                    lastUpdated: Timestamp.now()
                }
            }

            const docRef = await addDoc(collection(db, 'deliveryAgents'), agentWithTimestamp)
            return { id: docRef.id, ...agentWithTimestamp }
        } catch (error) {
            console.error('Error creating delivery agent:', error)
            throw error
        }
    },

    // Get all delivery agents
    async getAllAgents() {
        try {
            const q = query(collection(db, 'deliveryAgents'), orderBy('joinedAt', 'desc'))
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error fetching delivery agents:', error)
            throw error
        }
    },

    // Get active delivery agents
    async getActiveAgents() {
        try {
            const q = query(
                collection(db, 'deliveryAgents'),
                where('status', '==', 'active'),
                orderBy('averageRating', 'desc')
            )
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error fetching active delivery agents:', error)
            throw error
        }
    },

    // Update agent status
    async updateAgentStatus(agentId, status) {
        try {
            const agentRef = doc(db, 'deliveryAgents', agentId)
            await updateDoc(agentRef, { status })
            return true
        } catch (error) {
            console.error('Error updating agent status:', error)
            throw error
        }
    },

    // Update agent location
    async updateAgentLocation(agentId, latitude, longitude) {
        try {
            const agentRef = doc(db, 'deliveryAgents', agentId)
            await updateDoc(agentRef, {
                currentLocation: {
                    latitude,
                    longitude,
                    lastUpdated: Timestamp.now()
                }
            })
            return true
        } catch (error) {
            console.error('Error updating agent location:', error)
            throw error
        }
    },

    // Update agent rating
    async updateAgentRating(agentId, newRating) {
        try {
            const agentRef = doc(db, 'deliveryAgents', agentId)
            const agentDoc = await getDoc(agentRef)

            if (!agentDoc.exists()) {
                throw new Error('Agent not found')
            }

            const agentData = agentDoc.data()
            const totalDeliveries = agentData.totalDeliveries || 0
            const currentAverageRating = agentData.averageRating || 0

            // Calculate new average rating
            const newTotalDeliveries = totalDeliveries + 1
            const newAverageRating = ((currentAverageRating * totalDeliveries) + newRating) / newTotalDeliveries

            await updateDoc(agentRef, {
                totalDeliveries: newTotalDeliveries,
                averageRating: Math.round(newAverageRating * 10) / 10 // Round to 1 decimal place
            })

            return true
        } catch (error) {
            console.error('Error updating agent rating:', error)
            throw error
        }
    },

    // Get single agent by ID
    async getAgentById(agentId) {
        try {
            const agentRef = doc(db, 'deliveryAgents', agentId)
            const agentDoc = await getDoc(agentRef)

            if (!agentDoc.exists()) {
                return null
            }

            return {
                id: agentDoc.id,
                ...agentDoc.data()
            }
        } catch (error) {
            console.error('Error fetching agent:', error)
            throw error
        }
    }
}

// Delivery Assignment Service
export const deliveryAssignmentService = {
    // Create a new delivery assignment
    async createAssignment(assignmentData) {
        try {
            const assignmentWithTimestamp = {
                ...assignmentData,
                assignedAt: Timestamp.now(),
                status: 'assigned',
                customerRating: null,
                customerFeedback: null,
                proofOfDelivery: null
            }

            const docRef = await addDoc(collection(db, 'deliveryAssignments'), assignmentWithTimestamp)
            return { id: docRef.id, ...assignmentWithTimestamp }
        } catch (error) {
            console.error('Error creating delivery assignment:', error)
            throw error
        }
    },

    // Update assignment status
    async updateAssignmentStatus(assignmentId, status) {
        try {
            const assignmentRef = doc(db, 'deliveryAssignments', assignmentId)
            const updateData = { status }

            if (status === 'delivered') {
                updateData.actualDeliveryTime = Timestamp.now()
            }

            await updateDoc(assignmentRef, updateData)
            return true
        } catch (error) {
            console.error('Error updating assignment status:', error)
            throw error
        }
    },

    // Get assignments by agent ID
    async getAssignmentsByAgent(agentId, status = null) {
        try {
            let q = query(
                collection(db, 'deliveryAssignments'),
                where('agentId', '==', agentId),
                orderBy('assignedAt', 'desc')
            )

            if (status) {
                q = query(
                    collection(db, 'deliveryAssignments'),
                    where('agentId', '==', agentId),
                    where('status', '==', status),
                    orderBy('assignedAt', 'desc')
                )
            }

            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error fetching agent assignments:', error)
            throw error
        }
    },

    // Get assignment by order ID
    async getAssignmentByOrderId(orderId) {
        try {
            const q = query(
                collection(db, 'deliveryAssignments'),
                where('orderId', '==', orderId),
                limit(1)
            )
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
                return null
            }

            const doc = querySnapshot.docs[0]
            return {
                id: doc.id,
                ...doc.data()
            }
        } catch (error) {
            console.error('Error fetching assignment by order ID:', error)
            throw error
        }
    },

    // Add customer rating and feedback
    async addCustomerFeedback(assignmentId, rating, feedback, proofOfDelivery = null) {
        try {
            const assignmentRef = doc(db, 'deliveryAssignments', assignmentId)
            await updateDoc(assignmentRef, {
                customerRating: rating,
                customerFeedback: feedback,
                proofOfDelivery: proofOfDelivery ? {
                    ...proofOfDelivery,
                    timestamp: Timestamp.now()
                } : null
            })
            return true
        } catch (error) {
            console.error('Error adding customer feedback:', error)
            throw error
        }
    },

    // Get all assignments with optional status filter
    async getAllAssignments(status = null) {
        try {
            let q = query(collection(db, 'deliveryAssignments'), orderBy('assignedAt', 'desc'))

            if (status) {
                q = query(
                    collection(db, 'deliveryAssignments'),
                    where('status', '==', status),
                    orderBy('assignedAt', 'desc')
                )
            }

            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error fetching all assignments:', error)
            throw error
        }
    }
}

// Helper function to suggest best agent for order
export async function suggestBestAgents(warehouseLocation = { latitude: 28.6139, longitude: 77.2090 }, limit = 3) {
    try {
        const activeAgents = await deliveryAgentService.getActiveAgents()

        // Calculate distance scores and performance scores
        const scoredAgents = activeAgents.map(agent => {
            let distanceScore = 0
            let performanceScore = (agent.averageRating || 0) / 5 // Normalize rating to 0-1

            // Simple distance calculation (you might want to use a more sophisticated method)
            if (agent.currentLocation?.latitude && agent.currentLocation?.longitude) {
                const distance = Math.sqrt(
                    Math.pow(agent.currentLocation.latitude - warehouseLocation.latitude, 2) +
                    Math.pow(agent.currentLocation.longitude - warehouseLocation.longitude, 2)
                )
                // Inverse distance score (closer is better)
                distanceScore = Math.max(0, 1 - (distance / 0.1)) // Assuming 0.1 degrees as max reasonable distance
            } else {
                distanceScore = 0.5 // Neutral score if location unknown
            }

            // Calculate current workload (simplified - you might want to get real-time assignments)
            const workloadScore = 1 // Assuming all agents have similar capacity for now

            // Final score is weighted combination
            const finalScore = (distanceScore * 0.4) + (performanceScore * 0.4) + (workloadScore * 0.2)

            return {
                ...agent,
                suggestionScore: Math.round(finalScore * 100) / 100
            }
        })

        // Sort by score and return top suggestions
        return scoredAgents
            .sort((a, b) => b.suggestionScore - a.suggestionScore)
            .slice(0, limit)
    } catch (error) {
        console.error('Error suggesting agents:', error)
        throw error
    }
}

// Mock data for testing (remove in production)
export const mockAgents = [
    {
        name: 'Raj Kumar',
        phone: '+91 98765 43210',
        email: 'raj.kumar@example.com',
        status: 'active',
        currentLocation: {
            latitude: 28.6139,
            longitude: 77.2090,
            lastUpdated: new Date()
        },
        totalDeliveries: 156,
        averageRating: 4.7,
        vehicleDetails: {
            type: 'bike',
            number: 'DL-01-AB-1234'
        }
    },
    {
        name: 'Priya Singh',
        phone: '+91 98765 43211',
        email: 'priya.singh@example.com',
        status: 'active',
        currentLocation: {
            latitude: 28.6239,
            longitude: 77.2190,
            lastUpdated: new Date()
        },
        totalDeliveries: 89,
        averageRating: 4.9,
        vehicleDetails: {
            type: 'van',
            number: 'DL-02-CD-5678'
        }
    }
]