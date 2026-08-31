// In production, set VITE_BACKEND_URL in the Vercel project's environment
// variables to point at wherever the backend is currently hosted. This file
// should not need to change again when that host changes.
const backendURL = (() => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return `http://${url.hostname}:5000`;
    }
    return import.meta.env.VITE_BACKEND_URL || 'https://backend.ror.pratham.codes';
})();

export default backendURL;