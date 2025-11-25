import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    product = null,
    breadcrumbs = null,
    noIndex = false
}) => {
    const siteTitle = 'VelcyFashion | Premium Sarees & Dresses'
    const siteDescription = 'Discover exquisite collection of premium sarees and dresses at VelcyFashion. Shop authentic Kanjivaram, Banarasi, and designer ethnic wear with free shipping across India.'
    const siteKeywords = 'sarees, dresses, fashion, ethnic wear, kanjivaram, banarasi, online shopping, velcyfashion, surat, gujarat, indian wear, designer sarees'
    const siteUrl = process.env.REACT_APP_SITE_URL || 'https://velcyfashion.com'
    const siteImage = process.env.REACT_APP_OG_IMAGE || `${siteUrl}/og-image.jpg`
    const currentUrl = url || siteUrl
    const currentTitle = title ? `${title} | VelcyFashion` : siteTitle
    const currentDescription = description || siteDescription

    // Generate structured data
    const generateStructuredData = () => {
        const baseStructuredData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${siteUrl}/#organization`,
                    "name": "VelcyFashion",
                    "url": siteUrl,
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${siteUrl}/logo.png`
                    },
                    "description": "Premium sarees and dresses online store",
                    "sameAs": [
                        // Add social media URLs when available
                    ],
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-9876543210",
                        "contactType": "customer service",
                        "availableLanguage": ["English", "Hindi"]
                    }
                },
                {
                    "@type": "WebSite",
                    "@id": `${siteUrl}/#website`,
                    "url": siteUrl,
                    "name": "VelcyFashion",
                    "description": siteDescription,
                    "publisher": {
                        "@id": `${siteUrl}/#organization`
                    },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${siteUrl}/search?q={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                }
            ]
        }

        // Add webpage data
        baseStructuredData["@graph"].push({
            "@type": "WebPage",
            "@id": `${currentUrl}/#webpage`,
            "url": currentUrl,
            "name": currentTitle,
            "description": currentDescription,
            "isPartOf": {
                "@id": `${siteUrl}/#website`
            },
            "about": {
                "@id": `${siteUrl}/#organization`
            },
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": image || siteImage
            }
        })

        // Add product structured data if provided
        if (product) {
            baseStructuredData["@graph"].push({
                "@type": "Product",
                "@id": `${currentUrl}/#product`,
                "name": product.name,
                "description": product.description || currentDescription,
                "image": product.images || [image || siteImage],
                "brand": {
                    "@type": "Brand",
                    "name": "VelcyFashion"
                },
                "offers": {
                    "@type": "Offer",
                    "url": currentUrl,
                    "priceCurrency": "INR",
                    "price": product.price,
                    "availability": product.inStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                    "seller": {
                        "@id": `${siteUrl}/#organization`
                    },
                    "shippingDetails": {
                        "@type": "OfferShippingDetails",
                        "shippingRate": {
                            "@type": "MonetaryAmount",
                            "value": "0",
                            "currency": "INR"
                        },
                        "deliveryTime": {
                            "@type": "ShippingDeliveryTime",
                            "businessDays": {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                "opens": "09:00",
                                "closes": "18:00"
                            },
                            "handlingTime": {
                                "@type": "QuantitativeValue",
                            "minValue": 1,
                            "maxValue": 2,
                            "unitCode": "DAY"
                            },
                            "transitTime": {
                                "@type": "QuantitativeValue",
                            "minValue": 1,
                            "maxValue": 3,
                            "unitCode": "DAY"
                            }
                        }
                    }
                })

            // Add aggregate rating if available
            if (product.rating) {
                baseStructuredData["@graph"][baseStructuredData["@graph"].length - 1].aggregateRating = {
                    "@type": "AggregateRating",
                    "ratingValue": product.rating,
                    "reviewCount": product.reviewCount || 10,
                    "bestRating": "5",
                    "worstRating": "1"
                }
            }
        }

        // Add breadcrumb structured data if provided
        if (breadcrumbs && breadcrumbs.length > 0) {
            baseStructuredData["@graph"].push({
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.name,
                    "item": item.url
                }))
            })
        }

        return baseStructuredData
    }

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{currentTitle}</title>
            <meta name="description" content={currentDescription} />
            <meta name="keywords" content={keywords || siteKeywords} />

            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />

            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex,nofollow" />}

            {/* Language and Location */}
            <html lang="en" />
            <meta name="geo.region" content="IN-GJ" />
            <meta name="geo.placename" content="Surat, Gujarat" />
            <meta name="ICBM" content="21.1702,72.8311" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="VelcyFashion" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={currentTitle} />
            <meta property="og:description" content={currentDescription} />
            <meta property="og:image" content={image || siteImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={currentDescription} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={currentTitle} />
            <meta name="twitter:description" content={currentDescription} />
            <meta name="twitter:image" content={image || siteImage} />
            <meta name="twitter:image:alt" content={currentDescription} />

            {/* Additional Meta Tags */}
            <meta name="author" content="VelcyFashion" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta name="theme-color" content="#d4af37" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(generateStructuredData())}
            </script>

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link rel="preconnect" href="https://images.unsplash.com" />
            <link rel="preconnect" href="https://firebase.googleapis.com" />
        </Helmet>
    )
}

export default SEO
