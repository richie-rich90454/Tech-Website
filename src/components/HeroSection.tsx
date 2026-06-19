import Image from 'next/image';

export default function HeroSection(): React.ReactElement {
    return (
        <div id="front" data-built-by="richie-rich90454">
            <Image
                src="/images/hero.svg"
                alt="Abstract hand-drawn welcome illustration"
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', zIndex: 0 }}
            />
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(180deg, rgba(13,15,45,0.35) 0%, rgba(13,15,45,0.55) 100%)',
                    zIndex: 1,
                }}
            />
            <h1>Welcome to BASIS International and Bilingual Schools·China Tech Tools</h1>
        </div>
    );
}
