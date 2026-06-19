'use client';

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='arial' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
    return (
        <img
            src={src}
            alt={alt}
            onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
            }}
        />
    );
}
