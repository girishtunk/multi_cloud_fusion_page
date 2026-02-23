        const ANALYTICS_CONSENT_KEY = 'analyticsConsent';

        // Theme toggle functionality
        function toggleTheme() {
            const body = document.body;
            
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            
            setThemeToggleIcon(isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        }

        function setThemeToggleIcon(isLight) {
            const themeToggle = document.getElementById('themeToggle');
            if (!themeToggle) {
                return;
            }

            themeToggle.innerHTML = isLight
                ? '<i class="bi bi-sun-fill" aria-hidden="true"></i>'
                : '<i class="bi bi-moon-stars-fill" aria-hidden="true"></i>';
            themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }

        function getAnalyticsConsent() {
            try {
                return localStorage.getItem(ANALYTICS_CONSENT_KEY);
            } catch (error) {
                return null;
            }
        }

        function setAnalyticsConsent(value) {
            try {
                localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
            } catch (error) {
                // Ignore localStorage failures and keep runtime behavior safe.
            }
        }

        function applyAnalyticsConsent() {
            if (getAnalyticsConsent() === 'granted' && typeof window.initAnalytics === 'function') {
                window.initAnalytics();
            }
        }

        function removeConsentBanner() {
            const banner = document.getElementById('consentBanner');
            if (banner) {
                banner.remove();
            }
        }

        function createConsentBanner() {
            if (document.getElementById('consentBanner')) {
                return;
            }

            const banner = document.createElement('section');
            banner.id = 'consentBanner';
            banner.className = 'consent-banner';
            banner.setAttribute('role', 'dialog');
            banner.setAttribute('aria-live', 'polite');
            banner.setAttribute('aria-label', 'Analytics consent');

            banner.innerHTML = `
                <p>
                    We use analytics to improve the website and app experience.
                    Review our <a href="privacy.html">Privacy Policy</a>, <a href="terms.html">Terms of Service</a>,
                    and <a href="gdpr.html">GDPR Compliance</a> pages.
                </p>
                <div class="consent-actions">
                    <button type="button" class="consent-btn consent-btn-primary" id="consentAccept">Accept</button>
                    <button type="button" class="consent-btn consent-btn-secondary" id="consentDecline">Decline</button>
                </div>
            `;

            document.body.appendChild(banner);

            const acceptBtn = document.getElementById('consentAccept');
            const declineBtn = document.getElementById('consentDecline');

            acceptBtn?.addEventListener('click', () => {
                setAnalyticsConsent('granted');
                applyAnalyticsConsent();
                removeConsentBanner();
            });

            declineBtn?.addEventListener('click', () => {
                setAnalyticsConsent('denied');
                if (typeof window.disableAnalyticsTracking === 'function') {
                    window.disableAnalyticsTracking();
                }
                removeConsentBanner();
            });
        }

        function initConsentFlow() {
            const consent = getAnalyticsConsent();

            if (consent === 'granted') {
                applyAnalyticsConsent();
                return;
            }

            if (consent === 'denied') {
                return;
            }

            createConsentBanner();
        }

        function initConsentManagerControls() {
            document.addEventListener('click', (event) => {
                const trigger = event.target.closest('.manage-consent');
                if (!trigger) {
                    return;
                }

                event.preventDefault();
                removeConsentBanner();
                createConsentBanner();
            });
        }

        // Load saved theme preference
        window.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
            }

            setThemeToggleIcon(savedTheme === 'light');
            initHeaderScrollState();

            initRevealAnimations();
            initConsentFlow();
            initConsentManagerControls();
        });

        // Form submission handling
        const waitlistForm = document.getElementById('waitlistForm');
        if (waitlistForm) {
            waitlistForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitBtn = document.getElementById('submitBtn');
                const successMessage = document.getElementById('successMessage');
                const formError = document.getElementById('formError');
                const form = this;
                const osTypes = getCheckedValuesByIds(['osIos', 'osAndroid']);
                const accessTiming = getCheckedValuesByIds(['accessBeta', 'accessLaunch']);

                formError.style.display = 'none';
                formError.textContent = '';

                if (osTypes.length === 0) {
                    formError.textContent = 'Please select at least one OS type.';
                    formError.style.display = 'block';
                    return;
                }

                if (accessTiming.length === 0) {
                    formError.textContent = 'Please select Beta access or Full launch.';
                    formError.style.display = 'block';
                    return;
                }
                
                // Disable submit button
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';

                // Submit directly to Google Form endpoint (targeted to hidden iframe).
                form.submit();

                successMessage.style.display = 'block';
                form.reset();
                formError.style.display = 'none';
                formError.textContent = '';

                submitBtn.disabled = false;
                submitBtn.textContent = 'Join Waitlist';

                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            });
        }

        function getCheckedValues(name) {
            return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                .map((input) => input.value);
        }

        function getCheckedValuesByIds(ids) {
            return ids
                .map((id) => document.getElementById(id))
                .filter((input) => input && input.checked)
                .map((input) => input.value);
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Progressive reveal animations for key content blocks
        function initRevealAnimations() {
            const revealTargets = document.querySelectorAll(
                '.section-header, .feature-card, .step, .signup-form, .footer-content'
            );

            revealTargets.forEach((el, index) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
            });

            if (!('IntersectionObserver' in window)) {
                revealTargets.forEach((el) => el.classList.add('in-view'));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.14,
                rootMargin: '0px 0px -40px 0px'
            });

            revealTargets.forEach((el) => observer.observe(el));
        }

        function initHeaderScrollState() {
            const header = document.querySelector('header');
            if (!header) {
                return;
            }

            const updateScrollState = () => {
                header.classList.toggle('is-scrolled', window.scrollY > 10);
            };

            updateScrollState();
            window.addEventListener('scroll', updateScrollState, { passive: true });
        }
