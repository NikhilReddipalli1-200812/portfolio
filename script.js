/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT — REDDIPALLI NIKHIL EESWAR
 * High-performance, accessible vanilla JavaScript with Certificate Lightbox
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- 1. GLOBAL ELEMENT SELECTORS ---
    const header = document.getElementById('header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const currentYearEl = document.getElementById('current-year');
    const canvas = document.getElementById('ambient-canvas');

    // Certificate Modal Elements
    const certModal = document.getElementById('cert-modal');
    const certModalOverlay = document.getElementById('cert-modal-overlay');
    const certModalClose = document.getElementById('cert-modal-close');
    const modalCertCloseBtn = document.getElementById('modal-cert-close-btn');
    const modalCertTitle = document.getElementById('modal-cert-title');
    const modalCertIssuer = document.getElementById('modal-cert-issuer');
    const modalCertDate = document.getElementById('modal-cert-date');
    const modalCertImg = document.getElementById('modal-cert-img');
    const modalCertPdfBtn = document.getElementById('modal-cert-pdf-btn');
    const certPageNav = document.getElementById('cert-page-nav');
    const certPage1Btn = document.getElementById('cert-page-1-btn');
    const certPage2Btn = document.getElementById('cert-page-2-btn');

    // Set Dynamic Copyright Year
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- 2. HERO TYPING EFFECT ---
    const typingTextEl = document.getElementById('typing-text');
    if (typingTextEl) {
        const roles = [
            'Data Science & Engineering Student',
            'Python Developer',
            'Aspiring AI/ML Engineer',
            'Automation & Software Enthusiast'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 70;
        const deletingSpeed = 40;
        const delayBetweenRoles = 2000;

        function typeLoop() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let delta = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentRole.length) {
                delta = delayBetweenRoles;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delta = 400;
            }

            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setTimeout(typeLoop, delta);
            } else {
                typingTextEl.textContent = roles[0];
            }
        }

        setTimeout(typeLoop, 800);
    }

    // --- 3. MOBILE MENU TOGGLE ---
    if (hamburgerBtn && navMenu) {
        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                toggleMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // --- 4. STICKY HEADER & BACK TO TOP BUTTON ---
    const handleScrollEvents = () => {
        const scrollY = window.scrollY;

        if (scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScrollEvents, { passive: true });
    handleScrollEvents();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 5. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    
    if ('IntersectionObserver' in window && sections.length > 0) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- 6. SCROLL REVEAL ANIMATION OBSERVER ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // --- 7. TOAST NOTIFICATION UTILITY ---
    let toastTimeout;
    const showToast = (message, duration = 3000) => {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // --- 8. COPY TO CLIPBOARD FUNCTIONALITY ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }

                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-check';
                    setTimeout(() => {
                        icon.className = 'fa-regular fa-copy';
                    }, 2000);
                }

                showToast(`Copied "${textToCopy}" to clipboard!`);
            } catch (err) {
                console.error('Failed to copy:', err);
                showToast('Failed to copy to clipboard.');
            }
        });
    });

    // --- 9. CERTIFICATE PROOF MODAL / LIGHTBOX LOGIC ---
    let currentCertData = null;

    const openCertModal = (arg1, titleArg, issuerArg, dateArg, pdfArg, img2Arg) => {
        if (!certModal) return;

        let title, issuer, date, img1, img2, pdf;

        if (typeof arg1 === 'string') {
            img1 = arg1;
            title = titleArg || 'Certificate';
            issuer = issuerArg || 'Issuing Organization';
            date = dateArg || '-';
            pdf = pdfArg || img1;
            img2 = img2Arg || null;
        } else if (arg1 && arg1.getAttribute) {
            const card = arg1.closest ? arg1.closest('.cert-card') : arg1;
            const target = card || arg1;
            title = target.getAttribute('data-cert-title') || 'Certificate';
            issuer = target.getAttribute('data-cert-issuer') || 'Issuing Organization';
            date = target.getAttribute('data-cert-date') || '-';
            img1 = target.getAttribute('data-cert-img');
            img2 = target.getAttribute('data-cert-img2');
            pdf = target.getAttribute('data-cert-pdf');
        }

        if (!img1 && !pdf) return;

        currentCertData = { title, issuer, date, img1, img2, pdf };

        if (modalCertTitle) modalCertTitle.textContent = title;
        if (modalCertIssuer) modalCertIssuer.textContent = issuer;
        if (modalCertDate) {
            const dateSpan = modalCertDate.querySelector('span');
            if (dateSpan) dateSpan.textContent = date;
            else modalCertDate.textContent = date;
        }

        // Set primary image
        if (modalCertImg && img1) {
            modalCertImg.src = img1;
            modalCertImg.alt = `${title} Certificate Proof`;
        }

        // Multi-page navigation switcher
        if (certPageNav) {
            if (img2) {
                certPageNav.style.display = 'flex';
                if (certPage1Btn) certPage1Btn.classList.add('active');
                if (certPage2Btn) certPage2Btn.classList.remove('active');
            } else {
                certPageNav.style.display = 'none';
            }
        }

        // PDF / Full Document Button
        if (modalCertPdfBtn) {
            if (pdf) {
                modalCertPdfBtn.href = pdf;
                modalCertPdfBtn.style.display = 'inline-flex';
            } else if (img1) {
                modalCertPdfBtn.href = img1;
                modalCertPdfBtn.style.display = 'inline-flex';
            } else {
                modalCertPdfBtn.style.display = 'none';
            }
        }

        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    // Assign to window for direct HTML onclick attribute invocation
    window.openCertificate = openCertModal;
    window.closeCertificate = closeCertModal;

    const closeCertModal = () => {
        if (!certModal) return;
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Attach click and keyboard handlers to all available certificate cards
    const certCards = document.querySelectorAll('.cert-card.proof-available');
    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openCertModal(card);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCertModal(card);
            }
        });
    });

    // Multi-page switcher inside modal
    if (certPage1Btn && certPage2Btn && modalCertImg) {
        certPage1Btn.addEventListener('click', () => {
            if (currentCertData && currentCertData.img1) {
                modalCertImg.src = currentCertData.img1;
                certPage1Btn.classList.add('active');
                certPage2Btn.classList.remove('active');
            }
        });

        certPage2Btn.addEventListener('click', () => {
            if (currentCertData && currentCertData.img2) {
                modalCertImg.src = currentCertData.img2;
                certPage2Btn.classList.add('active');
                certPage1Btn.classList.remove('active');
            }
        });
    }

    // Close modal triggers
    if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
    if (modalCertCloseBtn) modalCertCloseBtn.addEventListener('click', closeCertModal);
    if (certModalOverlay) certModalOverlay.addEventListener('click', closeCertModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });

    // --- 10. REAL FORMSPREE CONTACT FORM INTERACTION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');
        const submitBtn = document.getElementById('submit-btn');
        const formStatusAlert = document.getElementById('form-status-alert');

        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        const showError = (id, message) => {
            const errorEl = document.getElementById(`${id}-error`);
            if (errorEl) errorEl.textContent = message;
        };

        const clearErrors = () => {
            ['name', 'email', 'subject', 'message'].forEach(id => {
                showError(id, '');
            });
            if (formStatusAlert) {
                formStatusAlert.style.display = 'none';
                formStatusAlert.innerHTML = '';
                formStatusAlert.className = 'form-status-alert';
            }
        };

        // Real-time error clearing as user types
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    const id = input.id.replace('form-', '');
                    showError(id, '');
                });
            }
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            let isValid = true;
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (!name) {
                showError('name', 'Please enter your name.');
                isValid = false;
            } else if (name.length < 2) {
                showError('name', 'Name must be at least 2 characters long.');
                isValid = false;
            }

            if (!email) {
                showError('email', 'Please enter your email address.');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address.');
                isValid = false;
            }

            if (!subject) {
                showError('subject', 'Please enter a subject.');
                isValid = false;
            }

            if (!message) {
                showError('message', 'Please enter your message.');
                isValid = false;
            } else if (message.length < 5) {
                showError('message', 'Message must be at least 5 characters long.');
                isValid = false;
            }

            if (!isValid) return;

            // Set loading state on submit button
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Sending Message...</span>';

            const formData = new FormData(contactForm);
            const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/meaqorzo';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success feedback
                    contactForm.reset();

                    if (formStatusAlert) {
                        formStatusAlert.className = 'form-status-alert form-status-success';
                        formStatusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> <div><strong>Message Sent!</strong><br>Thanks for reaching out! Your message has been sent successfully.</div>';
                        formStatusAlert.style.display = 'flex';
                    }

                    showToast('Thanks for reaching out! Your message has been sent successfully.', 4000);
                } else {
                    const data = await response.json().catch(() => ({}));
                    let errorMsg = 'Something went wrong. Please try again.';
                    
                    if (data && data.errors && data.errors.length > 0) {
                        errorMsg = data.errors.map(err => err.message).join(', ');
                    }

                    if (formStatusAlert) {
                        formStatusAlert.className = 'form-status-alert form-status-error';
                        formStatusAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <div><strong>Something went wrong. Please try again.</strong><br>${errorMsg}</div>`;
                        formStatusAlert.style.display = 'flex';
                    }

                    showToast('Something went wrong. Please try again.', 4000);
                }
            } catch (networkError) {
                console.error('Contact Form Network Error:', networkError);
                if (formStatusAlert) {
                    formStatusAlert.className = 'form-status-alert form-status-error';
                    formStatusAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <div><strong>Something went wrong. Please try again.</strong><br>Could not connect to the form server. Please email directly to <a href="mailto:nikhilreddipalli1@gmail.com">nikhilreddipalli1@gmail.com</a>.</div>';
                    formStatusAlert.style.display = 'flex';
                }

                showToast('Something went wrong. Please try again.', 4000);
            } finally {
                // Restore submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        });
    }

    // --- 11. AMBIENT PARTICLES CANVAS ---
    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 25000), 45);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.4 + 0.1;
                this.color = Math.random() > 0.5 ? '99, 102, 241' : '6, 182, 212';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animateParticles);
        };

        animateParticles();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }, 200);
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animateParticles();
            }
        });
    }
});
