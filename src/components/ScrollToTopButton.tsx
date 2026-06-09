'use client';
import { useEffect } from 'react';

export default function ScrollToTopButton() {
  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById('topbutton');
      const bar = document.getElementById('bar');
      if (btn && bar) {
        btn.style.display = (document.body.scrollTop > bar.offsetTop || document.documentElement.scrollTop > bar.offsetTop) ? 'block' : 'none';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} id="topbutton" title="Go to top">Top</button>
  );
}