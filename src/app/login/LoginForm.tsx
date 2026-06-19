'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/login.css';

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

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: formData,
        });

        if (res.redirected) {
            router.push('/admin');
            return;
        }

        const data = await res.json();
        if (data.error) {
            setError(data.error);
        }
        setLoading(false);
    }

    return (
        <div id="main">
            <div id="big">
                <h1 id="login-heading">Login</h1>
                <div id="login">
                    <h2 id="login-info">
                        You have reached an admin-only access site.
                        <br />
                        If you&apos;re an admin, log in with your credentials.
                    </h2>
                    <form id="login-form" method="post" onSubmit={handleSubmit}>
                        <p>
                            <input type="text" name="username" placeholder="Username" required />
                        </p>
                        <p>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                        </p>
                        {error && (
                            <p id="login-error" style={{ color: 'red' }}>
                                {error}
                            </p>
                        )}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
