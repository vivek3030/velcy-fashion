import { useEffect, useRef, useState, useCallback } from 'react'

// Intersection Observer for lazy loading
export const useIntersectionObserver = (options = {}) => {
    const [entries, setEntries] = useState([])
    const observer = useRef()

    const observe = useCallback((element) => {
        if (element) {
            observer.current = new IntersectionObserver((entries) => {
                setEntries(entries)
            }, {
                threshold: 0.1,
                rootMargin: '50px',
                ...options
            })
            observer.current.observe(element)
        }
    }, [options])

    const unobserve = useCallback((element) => {
        if (element && observer.current) {
            observer.current.unobserve(element)
        }
    }, [])

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [])

    return { observe, unobserve, entries }
}

// Image lazy loading hook
export const useImageLazyLoading = (src, options = {}) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const imgRef = useRef()

    const { observe, unobserve, entries } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '50px',
        ...options
    })

    useEffect(() => {
        if (entries.length > 0 && entries[0].isIntersecting && src && !imageSrc) {
            setImageSrc(src)
            unobserve(imgRef.current)
        }
    }, [entries, src, imageSrc, unobserve])

    const handleLoad = () => {
        setLoading(false)
        setError(false)
    }

    const handleError = () => {
        setLoading(false)
        setError(true)
    }

    return {
        ref: (element) => {
            imgRef.current = element
            if (element && !imageSrc) {
                observe(element)
            }
        },
        src: imageSrc,
        loading,
        error,
        handleLoad,
        handleError
    }
}

// General lazy loading hook for any element
export const useLazyLoad = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const elementRef = useRef()

    const { observe, unobserve, entries } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '50px',
        ...options
    })

    useEffect(() => {
        if (entries.length > 0 && entries[0].isIntersecting && !hasLoaded) {
            setIsVisible(true)
            setHasLoaded(true)
            unobserve(elementRef.current)
        }
    }, [entries, hasLoaded, unobserve])

    return {
        ref: (element) => {
            elementRef.current = element
            if (element && !hasLoaded) {
                observe(element)
            }
        },
        isVisible,
        hasLoaded
    }
}

// WebP format detection and conversion
export const useWebPSupport = () => {
    const [supportsWebP, setSupportsWebP] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkWebPSupport = () => {
            const canvas = document.createElement('canvas')
            canvas.width = 1
            canvas.height = 1
            const webpDataUrl = canvas.toDataURL('image/webp')

            const support = webpDataUrl.indexOf('data:image/webp') === 0
            setSupportsWebP(support)
            setLoading(false)

            // Cache the result
            try {
                localStorage.setItem('webpSupport', JSON.stringify(support))
            } catch (e) {
                console.warn('Could not cache WebP support:', e)
            }
        }

        // Check cached result first
        try {
            const cached = localStorage.getItem('webpSupport')
            if (cached !== null) {
                setSupportsWebP(JSON.parse(cached))
                setLoading(false)
                return
            }
        } catch (e) {
            console.warn('Could not read cached WebP support:', e)
        }

        checkWebPSupport()
    }, [])

    const getOptimizedImageUrl = useCallback((url, options = {}) => {
        if (!url || loading) return url

        const { width, height, quality = 80 } = options
        const params = new URLSearchParams()

        if (supportsWebP) {
            // Use WebP format if supported
            params.set('format', 'webp')
        } else {
            params.set('format', 'jpg')
        }

        if (width) params.set('w', width)
        if (height) params.set('h', height)
        params.set('q', quality)
        params.set('auto', 'compress')

        // For Unsplash images (you can adapt this for your image service)
        if (url.includes('unsplash.com')) {
            const urlObj = new URL(url)
            params.forEach((value, key) => {
                urlObj.searchParams.set(key, value)
            })
            return urlObj.toString()
        }

        // For other images, you might want to use an image optimization service
        // or return the original URL
        return url
    }, [supportsWebP, loading])

    return { supportsWebP, loading, getOptimizedImageUrl }
}

// Preload resources hook
export const useResourcePreloader = () => {
    const [preloadedResources, setPreloadedResources] = useState(new Set())

    const preloadImage = useCallback((src, options = {}) => {
        if (!src || preloadedResources.has(src)) return Promise.resolve()

        return new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = src

            link.onload = () => {
                setPreloadedResources(prev => new Set([...prev, src]))
                resolve(src)
            }

            link.onerror = reject

            document.head.appendChild(link)
        })
    }, [preloadedResources])

    const preloadFont = useCallback((fontUrl, fontFamily) => {
        const key = `${fontUrl}-${fontFamily}`
        if (preloadedResources.has(key)) return Promise.resolve()

        return new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'font'
            link.type = 'font/woff2'
            link.crossOrigin = 'anonymous'
            link.href = fontUrl

            link.onload = () => {
                setPreloadedResources(prev => new Set([...prev, key]))
                resolve(fontUrl)
            }

            link.onerror = reject

            document.head.appendChild(link)
        })
    }, [preloadedResources])

    const prefetchPage = useCallback((url) => {
        if (!url || preloadedResources.has(url)) return

        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = url

        document.head.appendChild(link)
        setPreloadedResources(prev => new Set([...prev, url]))
    }, [preloadedResources])

    return {
        preloadImage,
        preloadFont,
        prefetchPage,
        preloadedResources
    }
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        fcp: null, // First Contentful Paint
        lcp: null, // Largest Contentful Paint
        fid: null, // First Input Delay
        cls: null, // Cumulative Layout Shift
        loadTime: null
    })

    useEffect(() => {
        // Measure page load time
        const measureLoadTime = () => {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
                setMetrics(prev => ({ ...prev, loadTime }))
            }
        }

        // Measure First Contentful Paint
        const measureFCP = () => {
            if (performance.getEntriesByType) {
                const paintEntries = performance.getEntriesByType('paint')
                const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
                if (fcpEntry) {
                    setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }))
                }
            }
        }

        // Measure Largest Contentful Paint
        const measureLCP = () => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    const lastEntry = entries[entries.length - 1]
                    setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
                })
                observer.observe({ entryTypes: ['largest-contentful-paint'] })
            }
        }

        // Measure First Input Delay
        const measureFID = () => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    const firstEntry = entries[0]
                    if (firstEntry) {
                        setMetrics(prev => ({ ...prev, fid: firstEntry.processingStart - firstEntry.startTime }))
                    }
                })
                observer.observe({ entryTypes: ['first-input'] })
            }
        }

        // Measure Cumulative Layout Shift
        const measureCLS = () => {
            if ('PerformanceObserver' in window) {
                let clsValue = 0
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value
                        }
                    })
                    setMetrics(prev => ({ ...prev, cls: clsValue }))
                })
                observer.observe({ entryTypes: ['layout-shift'] })
            }
        }

        // Run measurements
        measureLoadTime()
        measureFCP()
        measureLCP()
        measureFID()
        measureCLS()

        // Fallback for load time if Performance Timing API is not available
        window.addEventListener('load', measureLoadTime)
    }, [])

    const logMetrics = useCallback(() => {
        console.group('🚀 Performance Metrics')
        console.log('Load Time:', metrics.loadTime ? `${metrics.loadTime}ms` : 'Not measured')
        console.log('First Contentful Paint:', metrics.fcp ? `${metrics.fcp}ms` : 'Not measured')
        console.log('Largest Contentful Paint:', metrics.lcp ? `${metrics.lcp}ms` : 'Not measured')
        console.log('First Input Delay:', metrics.fid ? `${metrics.fid}ms` : 'Not measured')
        console.log('Cumulative Layout Shift:', metrics.cls !== null ? metrics.cls.toFixed(3) : 'Not measured')
        console.groupEnd()

        // Send to analytics in production
        if (process.env.NODE_ENV === 'production' && window.gtag) {
            Object.entries(metrics).forEach(([metric, value]) => {
                if (value !== null) {
                    window.gtag('event', 'web_vitals', {
                        metric_name: metric,
                        metric_value: value
                    })
                }
            })
        }
    }, [metrics])

    return { metrics, logMetrics }
}

// Debounce hook for performance optimization
export const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null)

    const debouncedCallback = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args)
        }, delay)
    }, [callback, delay])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return debouncedCallback
}

// Throttle hook for performance optimization
export const useThrottle = (callback, delay) => {
    const lastRun = useRef(Date.now())

    const throttledCallback = useCallback((...args) => {
        if (Date.now() - lastRun.current >= delay) {
            callback(...args)
            lastRun.current = Date.now()
        }
    }, [callback, delay])

    return throttledCallback
}

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
    const [scrollTop, setScrollTop] = useState(0)

    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
        visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
    )

    const visibleItems = items.slice(visibleStart, visibleEnd).map((item, index) => ({
        item,
        index: visibleStart + index
    }))

    const totalHeight = items.length * itemHeight

    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop)
    }, [])

    return {
        visibleItems,
        totalHeight,
        visibleStart,
        visibleEnd,
        handleScroll
    }
}

// Memory management hook
export const useMemoryManagement = () => {
    const observers = useRef(new Set())
    const timeouts = useRef(new Set())
    const intervals = useRef(new Set())

    const addObserver = useCallback((observer) => {
        observers.current.add(observer)
        return observer
    }, [])

    const addTimeout = useCallback((timeout) => {
        timeouts.current.add(timeout)
        return timeout
    }, [])

    const addInterval = useCallback((interval) => {
        intervals.current.add(interval)
        return interval
    }, [])

    const cleanup = useCallback(() => {
        // Disconnect observers
        observers.current.forEach(observer => {
            if (observer.disconnect) observer.disconnect()
            if (observer.unobserve) observer.unobserve()
        })

        // Clear timeouts
        timeouts.current.forEach(timeout => clearTimeout(timeout))

        // Clear intervals
        intervals.current.forEach(interval => clearInterval(interval))

        // Clear all sets
        observers.current.clear()
        timeouts.current.clear()
        intervals.current.clear()
    }, [])

    useEffect(() => {
        return cleanup
    }, [cleanup])

    return {
        addObserver,
        addTimeout,
        addInterval,
        cleanup
    }
}