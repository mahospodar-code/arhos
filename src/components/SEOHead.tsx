
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export function SEOHead({ title, description, image, url }: SEOHeadProps) {
    const siteTitle = 'ARHOS Atelier | Architektúra & Dizajn';
    const defaultDescription = 'Architektonický ateliér ARHOS. Racionálna architektúra, autentický interiér a nadčasový dizajn.';
    const siteUrl = 'https://arhos.sk'; // To be updated with real domain

    const finalTitle = title ? `${title} | ARHOS` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalUrl = url ? `${siteUrl}${url}` : siteUrl;
    const finalImage = image ? `${siteUrl}${image}` : `${siteUrl}/images/logo-brand-arhos.png`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="title" content={finalTitle} />
            <meta name="description" content={finalDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ArchitectureFirm",
                    "name": "ARHOS Atelier",
                    "url": siteUrl,
                    "logo": `${siteUrl}/images/logo-brand-arhos.png`,
                    "image": `${siteUrl}/images/hero_architecture.jpg`,
                    "description": defaultDescription,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "",
                        "addressLocality": "Michalovce",
                        "addressRegion": "Košický kraj",
                        "postalCode": "07101",
                        "addressCountry": "SK"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": "48.7548",
                        "longitude": "21.9195"
                    },
                    "telephone": "+421 910 274 925",
                    "email": "arhos.atelier@gmail.com",
                    "openingHoursSpecification": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday"
                        ],
                        "opens": "09:00",
                        "closes": "17:00"
                    },
                    "priceRange": "$$$",
                    "sameAs": [
                        "https://www.instagram.com/arhos_atelier",
                        "https://www.facebook.com/arhosatelier"
                    ]
                })}
            </script>
        </Helmet>
    );
}
