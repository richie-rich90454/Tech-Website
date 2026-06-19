'use client';

import { useEffect } from 'react';
import Link from 'next/link';

const faqs = [
    {
        q: 'How does IPstress work?',
        a: 'Pick a plan that fits the capacity you need, top up your balance, and launch tests from the Hub. Our backends handle the routing and concurrency so you can focus on the target.',
    },
    {
        q: 'What payment methods do you accept?',
        a: 'Stripe, PayPal, and Bitcoin. Crypto payments credit automatically once one confirmation lands. Card payments are instant.',
    },
    {
        q: 'How long does support take?',
        a: 'Tickets are answered around the clock. Most replies land within 20 minutes during business hours and within 2 hours overnight.',
    },
    {
        q: 'Can I cancel or get a refund?',
        a: 'Subscriptions are non-recurring by default — they expire at the end of the term. If a plan is unusable due to a fault on our side, we issue a prorated refund to your balance.',
    },
    {
        q: 'Is my account safe?',
        a: 'All launches are routed through isolated infrastructure. We do not log target metadata, and your payment details are tokenised by the gateway — we never store raw card data.',
    },
];

export default function WebLandingPage(): React.ReactElement {
    useEffect(() => {
        // Re-bind a single delegated handler for any inline FAQ toggles.
        const onClick = (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            const tab = target.closest('[data-faq-tab]') as HTMLElement | null;
            if (!tab) return;
            e.preventDefault();
            const id = tab.getAttribute('data-faq-tab') ?? '';
            document.querySelectorAll<HTMLElement>('[data-faq-panel]').forEach((p) => {
                const isOpen = p.getAttribute('data-faq-panel') === id;
                p.style.display = isOpen ? 'block' : 'none';
            });
            document.querySelectorAll<HTMLElement>('[data-faq-tab]').forEach((t) => {
                t.classList.toggle('active', t === tab);
            });
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    return (
        <>
            {/* banner-area start */}
            <section className="banner_area" id="particles-js">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-6 col-lg-6 col-md-12">
                            <div className="banner_content">
                                <h1 className="wow fadeInLeft animated">
                                    IPstress <span>Best</span>
                                    <br />
                                    Stresser on the market L7 / L4
                                </h1>
                                <p className="wow fadeInLeft" data-wow-delay="0.2s">
                                    The cheapest price, the best service guarantee.
                                </p>
                                <ul className="btn_list">
                                    <li>
                                        <Link
                                            className="theme_btn wow fadeInUp animated"
                                            href="/web/register"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="theme_btn b-btn wow fadeInUp animated"
                                            data-wow-delay="0.3s"
                                            href="/web/login"
                                        >
                                            Log in
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-12 wow zoomIn animated">
                            <div className="right-ilustrat">
                                <img
                                    className="up_animat"
                                    src="/web/images/banner/banner_ilustration1.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* banner-area end */}

            {/* our_mission_area start */}
            <section id="about" className="our_mission_area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="title">
                                <h2>
                                    Why to choose
                                    <br />
                                    <span>IPstress</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 wow fadeInUp animated">
                            <div className="mission_text">
                                <h5>Security</h5>
                                <p>
                                    The tests you initiate are never shared with a 3rd party and
                                    100% safe system.
                                </p>
                            </div>
                        </div>
                        <div
                            className="col-lg-3 col-md-6 wow fadeInUp animated"
                            data-wow-delay="0.3s"
                        >
                            <div className="mission_text mt_1">
                                <h5>Best power</h5>
                                <p>
                                    If you want to get the best service at very affordable prices,
                                    make the right choice here, register and buy now.
                                </p>
                            </div>
                        </div>
                        <div
                            className="col-lg-3 col-md-6 wow fadeInUp animated"
                            data-wow-delay="0.6s"
                        >
                            <div className="mission_text mt_01">
                                <h5>Easy to use interface</h5>
                                <p>
                                    A panel welcomes you, which you can use in the best way our
                                    developers have done.
                                </p>
                            </div>
                        </div>
                        <div
                            className="col-lg-3 col-md-6 wow fadeInUp animated"
                            data-wow-delay="0.9s"
                        >
                            <div className="mission_text">
                                <h5>Support</h5>
                                <p>All plans have a 7/24 support, easily contact.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* our_mission_area end */}

            {/* make_bitcoin_area start */}
            <section className="mining_invest_area make_bitcoin">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-6">
                            <div className="mining_text">
                                <div className="title ti_2">
                                    <h2>
                                        How to use <span>IPstress</span>
                                    </h2>
                                    <p>Watch the video and learn to use with ease.</p>
                                </div>
                                <ul className="btn_list">
                                    <a
                                        className="btn btn-primary"
                                        href="https://www.youtube.com/watch?v="
                                        role="button"
                                    >
                                        Watch Video
                                    </a>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <img
                                src="/web/images/invest/mac1.png"
                                alt=""
                                className="right_img up_animat"
                            />
                        </div>
                    </div>
                </div>
            </section>
            {/* make_bitcoin_area end */}

            {/* faq_area start */}
            <section id="faq" className="faq_area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="title">
                                <h2>
                                    What stress
                                    <br />
                                    <span>FAQ</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 offset-lg-2">
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a
                                    className="nav-item nav-link active"
                                    data-faq-tab="regular"
                                    href="#regular"
                                    role="tab"
                                    aria-controls="regular"
                                    aria-selected="true"
                                >
                                    <h6>Regular questions</h6>
                                </a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div data-faq-panel="regular" className="faq_desc">
                                {faqs.map((item) => (
                                    <div className="faq_desc" key={item.q}>
                                        <h5>{item.q}</h5>
                                        <p>{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* faq_area end */}

            {/* footer */}
            <footer className="footer_area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="footer_widget">
                                <h5>IPstress</h5>
                                <p>
                                    L7 / L4 stress testing with a focus on reliability and clean
                                    reporting.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="footer_widget">
                                <h5>Explore</h5>
                                <ul className="cta_list">
                                    <li>
                                        <Link href="/web#about">About</Link>
                                    </li>
                                    <li>
                                        <Link href="/web#plans">Plans</Link>
                                    </li>
                                    <li>
                                        <Link href="/web#faq">FAQ</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="footer_widget">
                                <h5>Account</h5>
                                <ul className="cta_list">
                                    <li>
                                        <Link href="/web/register">Register</Link>
                                    </li>
                                    <li>
                                        <Link href="/web/login">Log in</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="copy_right">
                        <a>&copy; 2026 IPstress · All rights reserved</a>
                    </div>
                </div>
            </footer>

            {/* Scroll Top Button */}
            <button
                className="scroll-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>
        </>
    );
}
