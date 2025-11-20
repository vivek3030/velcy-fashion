import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'VelcyFashion | Premium Sarees & Dresses'
    const siteDescription = 'VelcyFashion - Your destination for premium sarees and dresses. Visit us at Tulsi Arcade, Surat, or shop online for the latest ethnic fashion trends.'
    const siteKeywords = 'sarees, dresses, fashion, ethnic wear, kanjivaram, banarasi, online shopping, velcyfashion, surat, gujarat'
    const siteUrl = 'https://velcyfashion.com'
    const siteImage = 'https://velcyfashion.com/og-image.jpg' // Placeholder

    return (
        <Helmet>
            <title>{title ? `${title} | VelcyFashion` : siteTitle}</title>
            <meta name="description" content={description || siteDescription} />
            <meta name="keywords" content={keywords || siteKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title ? `${title} | VelcyFashion` : siteTitle} />
            <meta property="og:description" content={description || siteDescription} />
            <meta property="og:image" content={image || siteImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || siteUrl} />
            <meta property="twitter:title" content={title ? `${title} | VelcyFashion` : siteTitle} />
            <meta property="twitter:description" content={description || siteDescription} />
            <meta property="twitter:image" content={image || siteImage} />
        </Helmet>
    )
}

export default SEO
