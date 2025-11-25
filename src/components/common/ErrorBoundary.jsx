import React, { Component } from 'react'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        }
    }

    static getDerivedStateFromError(error) {
        // Generate unique error ID for tracking
        const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        return {
            hasError: true,
            error,
            errorId
        }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo })

        // Log detailed error information
        console.group('🚨 Error Boundary: Component Error')
        console.error('Error:', error)
        console.error('Error Info:', errorInfo)
        console.error('Error ID:', this.state.errorId)
        console.error('User Agent:', navigator.userAgent)
        console.error('URL:', window.location.href)
        console.groupEnd()

        // In production, you would send this to your error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { extra: { errorInfo, errorId: this.state.errorId } })
            console.warn('Error would be sent to error reporting service in production')
        }

        // Try to report error to analytics
        try {
            if (window.gtag) {
                window.gtag('event', 'exception', {
                    description: error.message,
                    fatal: false,
                    custom_map: { error_id: this.state.errorId }
                })
            }
        } catch (analyticsError) {
            console.warn('Failed to report error to analytics:', analyticsError)
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        })
    }

    handleReload = () => {
        // Clear any potential cached state
        try {
            sessionStorage.clear()
            localStorage.removeItem('cart') // Clear potentially corrupted cart data
        } catch (e) {
            console.warn('Could not clear storage:', e)
        }

        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            const isDevelopment = process.env.NODE_ENV === 'development'

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
                        {/* Error Icon */}
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-6">
                            We're sorry for the inconvenience. An unexpected error occurred while loading this page.
                        </p>

                        {/* Error ID for support */}
                        <div className="bg-gray-100 rounded-lg p-3 mb-6">
                            <p className="text-xs text-gray-600">
                                Error ID: <code className="bg-white px-2 py-1 rounded text-xs font-mono">
                                    {this.state.errorId}
                                </code>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Please reference this ID when contacting support
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={this.handleReload}
                                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Reload Page
                                </button>

                                <Link
                                    to="/"
                                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Home size={16} />
                                    Go Home
                                </Link>
                            </div>

                            <a
                                href="mailto:support@velcyfashion.com"
                                className="w-full border border-accent text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={16} />
                                Contact Support
                            </a>
                        </div>

                        {/* Development Info */}
                        {isDevelopment && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                                    Development Error Details
                                </summary>
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs">
                                    <div className="mb-2">
                                        <strong>Error:</strong> {this.state.error.toString()}
                                    </div>
                                    {this.state.errorInfo && (
                                        <div className="mb-2">
                                            <strong>Component Stack:</strong>
                                            <pre className="mt-1 whitespace-pre-wrap text-red-800">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                    <div>
                                        <strong>Stack Trace:</strong>
                                        <pre className="mt-1 whitespace-pre-wrap text-red-800 text-xs overflow-x-auto">
                                            {this.state.error.stack}
                                        </pre>
                                    </div>
                                </div>
                            </details>
                        )}

                        {/* Helpful Tips */}
                        <div className="mt-6 text-xs text-gray-500">
                            <p className="mb-2">This might help:</p>
                            <ul className="text-left space-y-1">
                                <li>• Check your internet connection</li>
                                <li>• Try refreshing the page</li>
                                <li>• Clear your browser cache</li>
                                <li>• Contact support if the problem persists</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
