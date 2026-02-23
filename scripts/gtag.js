// Google Analytics bootstrap (GA4), initialized only after consent.
(function setupAnalytics() {
    const measurementId = 'G-26XWMY809Y';
    let initialized = false;
    const disableKey = `ga-disable-${measurementId}`;

    function disableAnalyticsTracking() {
        if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
            return;
        }

        window[disableKey] = true;
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', { analytics_storage: 'denied' });
        }
    }

    function initAnalytics() {
        if (initialized || !measurementId || measurementId === 'G-XXXXXXXXXX') {
            return;
        }

        window[disableKey] = false;
        initialized = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

        const src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        if (!document.querySelector(`script[src="${src}"]`)) {
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = src;
            document.head.appendChild(gaScript);
        }

        window.gtag('js', new Date());
        window.gtag('consent', 'default', { analytics_storage: 'granted' });
        window.gtag('config', measurementId);
    }

    window.initAnalytics = initAnalytics;
    window.disableAnalyticsTracking = disableAnalyticsTracking;

    let consentState;
    try {
        consentState = localStorage.getItem('analyticsConsent');
    } catch (error) {
        consentState = null;
    }

    if (consentState === 'granted') {
        initAnalytics();
    } else if (consentState === 'denied') {
        disableAnalyticsTracking();
    }
})();
