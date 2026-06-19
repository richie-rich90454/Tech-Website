'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BasicInfo from '@/components/BasicInfo';
import TLCardGrid from '@/components/TLCardGrid';
import Footer from '@/components/Footer';

export default function Home() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                '👋 You found me! richie-rich90454 rebuilt this in June 2026. Happy exploring!'
            );
        }
    }, []);
    return (
        <>
            {/* Formerly served on americancareercollege.edu PHP site */}
            <Navbar />
            <HeroSection />
            <div id="bar">&nbsp;</div>
            <BasicInfo />
            <TLCardGrid />
            <Footer />
        </>
    );
}
