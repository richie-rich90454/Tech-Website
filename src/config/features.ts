function flag(name: string, fallback = false): boolean {
    const v = process.env[name];
    if (v === undefined) return fallback;
    return v === "true" || v === "1" || v === "yes";
}

// Every user-facing feature can be toggled off via environment variables.
// This lets payments, reCAPTCHA, the wheel, affiliate program, gift cards,
// and the IP-stress hub be disabled without code changes.
export const features = {
    payments: flag("FEATURE_PAYMENTS", true),
    recaptcha: flag("FEATURE_RECAPTCHA", false),
    wheel: flag("FEATURE_WHEEL", true),
    affiliate: flag("FEATURE_AFFILIATE", true),
    giftcards: flag("FEATURE_GIFTCARDS", true),
    ipstress: flag("FEATURE_IPSTRESS", true),
};

export type FeatureName = keyof typeof features;

export function isFeatureEnabled(name: FeatureName): boolean {
    return features[name];
}
