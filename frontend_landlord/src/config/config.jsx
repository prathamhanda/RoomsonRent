const backendURL = (() => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);

    if (url.protocol === 'http:') {
        return `http://${url.hostname}:5000`;
    } else if (url.protocol === 'https:') {
        return 'https://secure-backend.example.com';
    }
})();

export default backendURL;