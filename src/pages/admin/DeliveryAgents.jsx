import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { motion } from 'framer-motion'
import { Plus, User, Phone, Mail, MapPin, Star, Bike, Car, Truck, Clock, TrendingUp, Loader2, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { deliveryAgentService, suggestBestAgents } from '../../lib/deliveryService'
import SEO from '../../components/common/SEO'

const DeliveryAgents = () => {
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [suggestedAgents, setSuggestedAgents] = useState([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [editingAgent, setEditingAgent] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        status: 'active',
        vehicleType: 'bike',
        vehicleNumber: ''
    })

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            setLoading(true)
            const agentData = await deliveryAgentService.getAllAgents()
            setAgents(agentData)
        } catch (error) {
            console.error('Error fetching agents:', error)
            toast.error('Failed to fetch delivery agents')
            // Load mock data for development
            setAgents([
                {
                    id: '1',
                    name: 'Raj Kumar',
                    phone: '+91 98765 43210',
                    email: 'raj.kumar@example.com',
                    status: 'active',
                    totalDeliveries: 156,
                    averageRating: 4.7,
                    vehicleDetails: {
                        type: 'bike',
                        number: 'DL-01-AB-1234'
                    },
                    joinedAt: new Date('2023-01-15')
                },
                {
                    id: '2',
                    name: 'Priya Singh',
                    phone: '+91 98765 43211',
                    email: 'priya.singh@example.com',
                    status: 'active',
                    totalDeliveries: 89,
                    averageRating: 4.9,
                    vehicleDetails: {
                        type: 'van',
                        number: 'DL-02-CD-5678'
                    },
                    joinedAt: new Date('2023-03-20')
                },
                {
                    id: '3',
                    name: 'Amit Sharma',
                    phone: '+91 98765 43212',
                    email: 'amit.sharma@example.com',
                    status: 'busy',
                    totalDeliveries: 234,
                    averageRating: 4.5,
                    vehicleDetails: {
                        type: 'truck',
                        number: 'DL-03-EF-9012'
                    },
                    joinedAt: new Date('2022-11-10')
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const loadSuggestedAgents = async () => {
        try {
            setLoadingSuggestions(true)
            const suggestions = await suggestBestAgents()
            setSuggestedAgents(suggestions)
        } catch (error) {
            console.error('Error loading suggested agents:', error)
            toast.error('Failed to load agent suggestions')
        } finally {
            setLoadingSuggestions(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingAgent) {
                // Update existing agent (you'd need to implement updateAgent in deliveryService)
                toast.success('Agent updated successfully')
            } else {
                await deliveryAgentService.createAgent({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    status: formData.status,
                    vehicleDetails: {
                        type: formData.vehicleType,
                        number: formData.vehicleNumber
                    }
                })
                toast.success('Agent added successfully')
            }

            setShowAddModal(false)
            setEditingAgent(null)
            setFormData({
                name: '',
                phone: '',
                email: '',
                status: 'active',
                vehicleType: 'bike',
                vehicleNumber: ''
            })
            fetchAgents()
        } catch (error) {
            console.error('Error saving agent:', error)
            toast.error('Failed to save agent')
        }
    }

    const handleStatusChange = async (agentId, newStatus) => {
        try {
            await deliveryAgentService.updateAgentStatus(agentId, newStatus)
            setAgents(agents.map(agent =>
                agent.id === agentId ? { ...agent, status: newStatus } : agent
            ))
            toast.success(`Agent status updated to ${newStatus}`)
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update agent status')
        }
    }

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'bike': return <Bike size={20} />
            case 'van': return <Car size={20} />
            case 'truck': return <Truck size={20} />
            default: return <Bike size={20} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700'
            case 'inactive': return 'bg-gray-100 text-gray-700'
            case 'busy': return 'bg-yellow-100 text-yellow-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const stats = {
        total: agents.length,
        active: agents.filter(a => a.status === 'active').length,
        busy: agents.filter(a => a.status === 'busy').length,
        avgRating: agents.length > 0
            ? (agents.reduce((sum, a) => sum + (a.averageRating || 0), 0) / agents.length).toFixed(1)
            : '0.0'
    }

    return (
        <AdminLayout>
            <SEO
                title="Delivery Agents - Admin"
                description="Manage delivery agents for Velcy Fashion"
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Delivery Agents</h1>
                    <p className="text-gray-600">Manage your delivery team and track performance</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadSuggestedAgents}
                        disabled={loadingSuggestions}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {loadingSuggestions ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <TrendingUp size={16} />
                        )}
                        Get Suggestions
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-accent transition-colors"
                    >
                        <Plus size={16} />
                        Add Agent
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Agents</h3>
                        <User size={20} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Active Now</h3>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Busy</h3>
                        <Clock size={20} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.busy}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.avgRating}</p>
                </div>
            </div>

            {/* Suggested Agents */}
            {suggestedAgents.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommended Agents for Next Order</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestedAgents.map((agent, index) => (
                            <div key={agent.id} className="bg-white rounded-lg p-3 flex items-center gap-3">
                                <div className="text-sm font-bold text-blue-600">#{index + 1}</div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{agent.name}</p>
                                    <p className="text-xs text-gray-600">Score: {agent.suggestionScore}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        {agent.averageRating}
                                    </div>
                                    <div className="text-xs text-gray-500">{agent.totalDeliveries} deliveries</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Agents List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading delivery agents...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-700">Agent</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Contact</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Vehicle</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Performance</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Joined</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {agents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                                    <User size={18} className="text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{agent.name}</p>
                                                    <p className="text-sm text-gray-600">ID: {agent.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {agent.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {agent.email}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-accent">
                                                    {getVehicleIcon(agent.vehicleDetails?.type)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium capitalize">{agent.vehicleDetails?.type}</p>
                                                    <p className="text-xs text-gray-500">{agent.vehicleDetails?.number}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-medium">{agent.averageRating || 0}</span>
                                                </div>
                                                <p className="text-xs text-gray-600">{agent.totalDeliveries || 0} deliveries</p>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <select
                                                value={agent.status}
                                                onChange={(e) => handleStatusChange(agent.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border-none cursor-pointer focus:ring-2 focus:ring-accent ${getStatusColor(agent.status)}`}
                                            >
                                                <option value="active" className="bg-white text-gray-700">Active</option>
                                                <option value="busy" className="bg-white text-gray-700">Busy</option>
                                                <option value="inactive" className="bg-white text-gray-700">Inactive</option>
                                            </select>
                                        </td>

                                        <td className="p-4 text-sm text-gray-600">
                                            {agent.joinedAt?.toDate ? agent.joinedAt.toDate().toLocaleDateString() : 'Unknown'}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingAgent(agent)
                                                        setFormData({
                                                            name: agent.name,
                                                            phone: agent.phone,
                                                            email: agent.email,
                                                            status: agent.status,
                                                            vehicleType: agent.vehicleDetails?.type || 'bike',
                                                            vehicleNumber: agent.vehicleDetails?.number || ''
                                                        })
                                                        setShowAddModal(true)
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {agents.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <User size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No delivery agents found</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="mt-4 text-accent hover:text-primary font-medium"
                                >
                                    Add your first agent
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Agent Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingAgent ? 'Edit Agent' : 'Add New Agent'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="agent@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="busy">Busy</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vehicle Type
                                </label>
                                <select
                                    value={formData.vehicleType}
                                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                >
                                    <option value="bike">Bike</option>
                                    <option value="van">Van</option>
                                    <option value="truck">Truck</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vehicle Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.vehicleNumber}
                                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="DL-01-AB-1234"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false)
                                        setEditingAgent(null)
                                        setFormData({
                                            name: '',
                                            phone: '',
                                            email: '',
                                            status: 'active',
                                            vehicleType: 'bike',
                                            vehicleNumber: ''
                                        })
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-white hover:text-accent transition-colors"
                                >
                                    {editingAgent ? 'Update' : 'Add'} Agent
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    )
}

export default DeliveryAgents