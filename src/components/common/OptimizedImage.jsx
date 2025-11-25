import React, { useState, forwardRef } from 'react'
import { useImageLazyLoading, useWebPSupport } from '../../hooks/usePerformanceOptimization'

const OptimizedImage = forwardRef((
    {
        src,
        alt,
        width,
        height,
        className = '',
        loading: externalLoading = 'lazy',
        sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        quality = 80,
        placeholder = 'blur',
        onLoad,
        onError,
        style = {},
        ...props
    },
    ref
) => {
    const [imageError, setImageError] = useState(false)
    const { supportsWebP, getOptimizedImageUrl } = useWebPSupport()

    // Use the custom lazy loading hook
    const {
        ref: imageRef,
        src: optimizedSrc,
        loading,
        error,
        handleLoad: handleImageLoad,
        handleError: handleImageError
    } = useImageLazyLoading(src)

    // Generate placeholder URL for blur effect
    const getPlaceholderUrl = (src, width = 20, height = 20) => {
        if (!src) return null

        // For Unsplash images, use their built-in placeholder service
        if (src.includes('unsplash.com')) {
            const url = new URL(src)
            url.searchParams.set('w', width)
            url.searchParams.set('h', height)
            url.searchParams.set('fit', 'crop')
            url.searchParams.set('blur', 10)
            url.searchParams.set('q', 20)
            return url.toString()
        }

        // For other images, you might want to use a placeholder service
        // or return the original URL
        return src
    }

    // Get final optimized URL
    const finalSrc = optimizedSrc ? getOptimizedImageUrl(optimizedSrc, { width, height, quality }) : null
    const placeholderSrc = getPlaceholderUrl(src, 20, 20)

    // Combine refs
    const combinedRef = (element) => {
        if (typeof ref === 'function') {
            ref(element)
        } else if (ref) {
            ref.current = element
        }
        imageRef(element)
    }

    // Handle image load
    const handleLoadEvent = (e) => {
        handleImageLoad()
        if (onLoad) onLoad(e)
    }

    // Handle image error
    const handleErrorEvent = (e) => {
        setImageError(true)
        handleImageError()
        if (onError) onError(e)
    }

    // Generate styles
    const imageStyle = {
        ...style,
        transition: 'opacity 0.3s ease-in-out',
        objectFit: style.objectFit || 'cover'
    }

    // Default placeholder component
    const Placeholder = () => (
        <div
            className={`absolute inset-0 bg-gray-200 ${className}`}
            style={{
                backgroundImage: placeholderSrc ? `url(${placeholderSrc})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px)',
                transform: 'scale(1.1)'
            }}
        />
    )

    // Error fallback component
    const ErrorFallback = () => (
        <div
            className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className}`}
        >
            <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        </div>
    )

    // If no src provided, show placeholder
    if (!src) {
        return <Placeholder />
    }

    // Show error fallback if there was an error
    if (imageError || error) {
        return <ErrorFallback />
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{
                width: width || '100%',
                height: height || 'auto',
                ...style
            }}
            {...props}
        >
            {/* Placeholder */}
            {placeholder === 'blur' && placeholderSrc && (
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                        !loading && finalSrc ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                        backgroundImage: `url(${placeholderSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(10px)',
                        transform: 'scale(1.1)'
                    }}
                />
            )}

            {/* Main image */}
            {finalSrc && (
                <img
                    ref={combinedRef}
                    src={finalSrc}
                    alt={alt}
                    className={`w-full h-full transition-opacity duration-300 ${
                        loading ? 'opacity-0' : 'opacity-100'
                    } ${className}`}
                    style={imageStyle}
                    sizes={sizes}
                    onLoad={handleLoadEvent}
                    onError={handleErrorEvent}
                    loading={externalLoading}
                    decoding="async"
                />
            )}

            {/* Loading skeleton */}
            {loading && placeholder === 'skeleton' && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}

            {/* Performance indicators (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-0 left-0 bg-black/50 text-white text-xs p-1 rounded-br">
                    {loading ? 'Loading...' : 'Loaded'}
                    {supportsWebP && <span className="ml-1">WebP</span>}
                </div>
            )}
        </div>
    )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage

// Utility function for creating responsive image sets
export const createResponsiveImageSet = (baseUrl, options = {}) => {
    const { widths = [320, 640, 768, 1024, 1280, 1536] } = options

    const srcset = widths
        .map(width => {
            // Simple optimization for common CDNs
            let optimizedUrl = baseUrl
            if (baseUrl.includes('unsplash.com')) {
                const url = new URL(baseUrl)
                url.searchParams.set('w', width)
                url.searchParams.set('fit', 'crop')
                url.searchParams.set('auto', 'compress')
                optimizedUrl = url.toString()
            }
            return `${optimizedUrl} ${width}w`
        })
        .join(', ')

    return srcset
}