export const backendURL = (() => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const hostname = url.hostname;
    
    console.log('Current hostname:', hostname);
    
    // Development environment
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
        return `http://${hostname}:5000`;
    } 
    // Production environment
    else {
        return 'https://backend.roomsonrent.in';
    }
})();

console.log('Using backend URL:', backendURL);

export default backendURL;