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

        // Load saved theme preference
        window.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
            }

            setThemeToggleIcon(savedTheme === 'light');
            initHeaderScrollState();

            initRevealAnimations();
        });

        // Form submission handling
        document.getElementById('waitlistForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const formError = document.getElementById('formError');
            const form = this;
            const osTypes = getCheckedValues('osType');
            const accessTiming = getCheckedValues('accessTiming');

            formError.style.display = 'none';
            formError.textContent = '';

            if (osTypes.length === 0) {
                formError.textContent = 'Please select at least one OS type.';
                formError.style.display = 'block';
                return;
            }

            if (accessTiming.length === 0) {
                formError.textContent = 'Please select beta access or after full launch.';
                formError.style.display = 'block';
                return;
            }
            
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                osTypes,
                accessTiming,
                gdprConsent: document.getElementById('gdprConsent').checked,
                timestamp: new Date().toISOString()
            };
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Joining...';
            
            // Simulate API call (replace with your actual endpoint)
            setTimeout(() => {
                console.log('Waitlist signup:', formData);
                
                // Show success message
                successMessage.style.display = 'block';
                form.reset();
                formError.style.display = 'none';
                formError.textContent = '';
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Join Waitlist';
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
                
                // TODO: Send data to your backend/email service
                // Example: fetch('/api/waitlist', { method: 'POST', body: JSON.stringify(formData) })
            }, 1500);
        });

        function getCheckedValues(name) {
            return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                .map((input) => input.value);
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
