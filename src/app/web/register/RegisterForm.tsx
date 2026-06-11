'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch('/web/api/auth/register', {
      method: 'POST',
      body: formData,
    });

    if (res.redirected) {
      router.push(res.url);
      return;
    }

    const data = await res.json();
    if (data.error) {
      setError(data.error);
    }
    if (data.success) {
      setSuccess(data.success);
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative">
      {/* register · richie-rich90454 · 2026/06 */}
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="p-3">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">IPstress</h2>
                <h3 className="card-title text-center">Register</h3>
                <form className="mt-4" method="post" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="text-white" htmlFor="username">
                          Username
                        </label>
                        <input
                          className="form-control"
                          id="username"
                          name="username"
                          type="text"
                          placeholder="enter your username"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="text-white" htmlFor="password">
                          Password
                        </label>
                        <input
                          className="form-control"
                          id="password"
                          name="password"
                          type="password"
                          placeholder="enter your password"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="text-white" htmlFor="confirmPassword">
                          Repeat Password
                        </label>
                        <input
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="repeat your password"
                          required
                        />
                      </div>
                    </div>
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                      <div className="col-lg-12">
                        <div className="g-recaptcha" data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}></div>
                      </div>
                    )}
                    <div className="col-lg-12 text-center">
                      <div className="form-group">
                        <button name="doRegister" type="submit" className="btn btn-block btn-primary" disabled={loading}>
                          {loading ? 'Registering...' : 'Sign Up'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-12 text-center mt-3">
              Already have an account?{' '}
              <a href="/web/login" className="text-primary">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}