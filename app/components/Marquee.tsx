export default function Marquee() {
    const logos = [
        { src: "https://cdn.magicui.design/companies/Airbnb.svg", alt: "Airbnb" },
        { src: "https://cdn.magicui.design/companies/Instagram.svg", alt: "instagram" },
        { src: "https://cdn.magicui.design/companies/Stripe.svg", alt: "Stripe" },
        { src: "https://cdn.magicui.design/companies/Google.svg", alt: "Google" },
        { src: "https://cdn.magicui.design/companies/Airbnb.svg", alt: "Airbnb" },
        { src: "https://cdn.magicui.design/companies/Instagram.svg", alt: "instagram" },
        { src: "https://cdn.magicui.design/companies/Stripe.svg", alt: "Stripe" },
        { src: "https://cdn.magicui.design/companies/Google.svg", alt: "Google" },
    ];

    return (
        <div className="opacity-40">
            <h3 className="text-sm text-center mt-10 font-bold text-gray-300">Users include engineers from:</h3>
            <div className="relative flex overflow-x-hidden mt-6 mb-10">
                {/* Gradient Overlay - Left */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-body-1 to-transparent"></div>

                {/* Scrolling container - content duplicated for seamless loop */}
                <div className="animate-marquee flex">
                    {[...logos, ...logos].map((logo, idx) => (
                        <img
                            key={`logo-1-${idx}`}
                            src={logo.src}
                            alt={logo.alt}
                            className="dark:brightness-0 dark:invert h-10 w-28 mx-8 flex-shrink-0"
                        />
                    ))}
                    {[...logos, ...logos].map((logo, idx) => (
                        <img
                            key={`logo-2-${idx}`}
                            src={logo.src}
                            alt={logo.alt}
                            className="dark:brightness-0 dark:invert h-10 w-28 mx-8 flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Gradient Overlay - Right */}
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-body-1 to-transparent"></div>
            </div>
        </div>
    );
}
