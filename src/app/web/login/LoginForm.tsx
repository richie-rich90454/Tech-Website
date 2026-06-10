'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch('/web/api/auth/login', {
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
    setLoading(false);
  }

  return (
    <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="p-3">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">IPstress</h2>
                <h3 className="card-title text-center">Login</h3>
                <form className="mt-4" method="post" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="text-white" htmlFor="username">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
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
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="enter your password"
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
                        <button name="doLogin" type="submit" className="btn btn-block btn-primary" disabled={loading}>
                          {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-12 text-center mt-3">
              Don&apos;t have an account?{' '}
              <a href="/web/register" className="text-primary">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}