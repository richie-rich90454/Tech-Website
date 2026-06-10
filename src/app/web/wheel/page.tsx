'use client';
import Script from 'next/script';
import { useState, useRef } from 'react';

declare global {
  interface Window {
    superwheel?: {
      create: (selector: string, options: Record<string, unknown>) => void;
      start?: () => void;
      stop?: (prizeId: number) => void;
      onResult?: (callback: (prizeId: number) => void) => void;
    };
  }
}

export default function WheelPage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (spinning || !scriptLoaded) return;
    setSpinning(true);
    setResult('');

    try {
      const res = await fetch('/web/api/wheel/spin', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.prize !== undefined) {
        if (window.superwheel?.stop) {
          window.superwheel.stop(data.prize);
        }
        setResult(`You won: ${data.prizeName || data.prize}`);
      } else {
        setResult(data.error || 'Spin failed.');
      }
    } catch {
      setResult('Network error. Please try again.');
    } finally {
      setTimeout(() => setSpinning(false), 3000);
    }
  };

  return (
    <>
      <Script
        src="/web/wheel/superwheel.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Lucky Wheel</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql" aria-current="page">IPstress</li>
                <li className="breadcrumb-item text-muted" aria-current="page">Wheel</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-lg-6 mx-auto">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="card-title">Spin & Win</h4>
                <p className="text-muted">Try your luck and win exciting prizes!</p>
                {result && (
                  <div className={`alert ${result.startsWith('You won') ? 'alert-success' : 'alert-danger'}`}>
                    {result}
                  </div>
                )}
                <div className="mt-4">
                  <div
                    ref={wheelRef}
                    id="superwheel"
                    style={{ margin: '0 auto', maxWidth: '400px' }}
                  />
                  <button
                    className="btn btn-danger btn-lg mt-4"
                    onClick={handleSpin}
                    disabled={spinning || !scriptLoaded}
                  >
                    {spinning ? 'Spinning...' : 'SPIN NOW'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}