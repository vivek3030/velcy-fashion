import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// SEO utilities for meta tags and structured data
export const useSEO = (config = {}) => {
  const location = useLocation()

  const defaultConfig = {
    title: 'Velcy Fashion - Premium Fashion & Clothing',
    description: 'Discover the latest fashion trends at Velcy Fashion. Shop premium quality clothing, accessories, and more with free shipping across India.',
    keywords: 'fashion, clothing, online shopping, premium fashion, Indian fashion, trendy clothes',
    type: 'website',
    image: '/og-image.jpg',
    url: window.location.origin + location.pathname,
    siteName: 'Velcy Fashion',
    locale: 'en_IN'
  }

  const seoConfig = { ...defaultConfig, ...config }

  useEffect(() => {
    // Update basic meta tags
    document.title = seoConfig.title

    // Update description meta tag
    updateMetaTag('description', seoConfig.description)

    // Update keywords meta tag
    updateMetaTag('keywords', seoConfig.keywords)

    // Update canonical URL
    updateLinkTag('canonical', seoConfig.url)

    // Update Open Graph tags
    updateMetaProperty('og:title', seoConfig.title)
    updateMetaProperty('og:description', seoConfig.description)
    updateMetaProperty('og:type', seoConfig.type)
    updateMetaProperty('og:image', seoConfig.image)
    updateMetaProperty('og:url', seoConfig.url)
    updateMetaProperty('og:site_name', seoConfig.siteName)
    updateMetaProperty('og:locale', seoConfig.locale)

    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image')
    updateMetaName('twitter:title', seoConfig.title)
    updateMetaName('twitter:description', seoConfig.description)
    updateMetaName('twitter:image', seoConfig.image)

    // Add structured data
    addStructuredData(seoConfig)

  }, [seoConfig, location.pathname])
}

// Helper functions to update meta tags
const updateMetaTag = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.appendChild(tag)
  }
  tag.content = content
}

const updateMetaProperty = (property, content) => {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.content = content
}

const updateMetaName = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.appendChild(tag)
  }
  tag.content = content
}

const updateLinkTag = (rel, href) => {
  let tag = document.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.rel = rel
    document.head.appendChild(tag)
  }
  tag.href = href
}

// Add structured data for SEO
const addStructuredData = (config) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": config.siteName,
    "url": window.location.origin,
    "description": config.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  // Add e-commerce specific structured data for product pages
  if (config.type === 'product' && config.product) {
    structuredData["@type"] = "Product"
    structuredData.name = config.product.name
    structuredData.description = config.product.description
    structuredData.image = config.product.images || [config.image]
    structuredData.brand = {
      "@type": "Brand",
      "name": "Velcy Fashion"
    }
    structuredData.offers = {
      "@type": "Offer",
      "price": config.product.price,
      "priceCurrency": "INR",
      "availability": config.product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Velcy Fashion"
      }
    }
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData, null, 2)
  document.head.appendChild(script)
}

// Generate product page SEO configuration
export const generateProductSEO = (product) => ({
  title: `${product.name} - Velcy Fashion`,
  description: product.description || `Shop ${product.name} at Velcy Fashion. Premium quality ${product.category} with free shipping across India.`,
  keywords: `${product.name}, ${product.category}, fashion, clothing, velcy fashion, ${product.tags?.join(', ') || ''}`,
  type: 'product',
  image: product.images?.[0] || product.image,
  product: {
    name: product.name,
    description: product.description,
    price: product.price,
    inStock: product.inStock !== false,
    images: product.images,
    category: product.category
  }
})

// Generate category page SEO configuration
export const generateCategorySEO = (category) => ({
  title: `${category.charAt(0).toUpperCase() + category.slice(1)} Collection - Velcy Fashion`,
  description: `Explore our latest ${category} collection. Premium quality fashion with free shipping across India.`,
  keywords: `${category}, ${category} fashion, ${category} clothing, velcy fashion`,
  type: 'website',
  image: `/category-${category}.jpg`
})

// Generate page-specific SEO configuration
export const generatePageSEO = (page, data = {}) => {
  const seoConfigs = {
    home: {
      title: 'Velcy Fashion - Premium Fashion & Clothing Online Shopping',
      description: 'Discover the latest fashion trends at Velcy Fashion. Shop premium quality clothing, accessories, and more with free shipping across India.',
      keywords: 'fashion, clothing, online shopping, premium fashion, Indian fashion, trendy clothes, velcy fashion'
    },
    shop: {
      title: 'Shop All Collections - Velcy Fashion',
      description: 'Browse our complete collection of premium fashion and clothing. Find the latest trends in Indian fashion with Velcy.',
      keywords: 'shop, fashion collection, online clothing store, buy clothes online, velcy fashion'
    },
    about: {
      title: 'About Velcy Fashion - Our Story & Mission',
      description: 'Learn about Velcy Fashion\'s mission to bring premium quality fashion to every Indian. Discover our story and values.',
      keywords: 'about velcy fashion, fashion brand, premium clothing, indian fashion store'
    },
    contact: {
      title: 'Contact Velcy Fashion - Customer Support',
      description: 'Get in touch with Velcy Fashion for customer support, inquiries, and assistance. We\'re here to help you.',
      keywords: 'contact velcy fashion, customer support, fashion store contact'
    },
    checkout: {
      title: 'Checkout - Velcy Fashion',
      description: 'Complete your purchase at Velcy Fashion. Secure checkout with multiple payment options and fast delivery.',
      keywords: 'checkout, buy clothes, secure payment, fashion checkout'
    },
    cart: {
      title: 'Shopping Cart - Velcy Fashion',
      description: 'Review your shopping cart at Velcy Fashion. Edit items and proceed to secure checkout.',
      keywords: 'shopping cart, buy fashion, online cart'
    },
    wishlist: {
      title: 'My Wishlist - Velcy Fashion',
      description: 'View and manage your wishlist at Velcy Fashion. Save your favorite items for later.',
      keywords: 'wishlist, saved items, fashion favorites'
    }
  }

  return seoConfigs[page] || seoConfigs.home
}

// SEO Hook for dynamic page titles
export const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} - Velcy Fashion`
    }
  }, [title])
}