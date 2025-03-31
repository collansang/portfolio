/*
======================
Table of Contents
======================
1. Navigation
2. Sticky Header
3. Portfolio Filter
4. Portfolio Lightbox
5. Testimonials Slider
6. Back To Top Button
7. Form Validation
8. Smooth Scrolling
9. Animation on Scroll
======================
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    const testimonialSlider = document.getElementById('testimonialSlider');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    const contactForm = document.getElementById('contactForm');

    // 1. Navigation
    // Toggle navigation menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Set active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 2. Sticky Header
    // Change header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
        
        // Set active nav link based on scroll position
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Portfolio Filter
    // Filter portfolio items by category
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active filter button
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Portfolio Lightbox
    // Open lightbox on portfolio item click
    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = link.getAttribute('href');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close lightbox on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 5. Testimonials Slider
    let currentSlide = 0;
    
    // Show current slide
    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialSlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Show next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }
    
    // Show previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }
    
    // Event listeners for slider controls
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause slider on hover
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // 6. Back To Top Button
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 7. Form Validation
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            let valid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (!name.value.trim()) {
                valid = false;
                showError(name, 'Name is required');
            } else {
                removeError(name);
            }
            
            if (!email.value.trim()) {
                valid = false;
                showError(email, 'Email is required');
            } else if (!isValidEmail(email.value)) {
                valid = false;
                showError(email, 'Please enter a valid email');
            } else {
                removeError(email);
            }
            
            if (!message.value.trim()) {
                valid = false;
                showError(message, 'Message is required');
            } else {
                removeError(message);
            }
            
            if (valid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    contactForm.reset();
                    showSuccessMessage();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Helper function to show error
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        if (!formGroup.querySelector('.error-message')) {
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            errorEl.style.color = 'var(--error-color)';
            errorEl.style.fontSize = '12px';
            errorEl.style.marginTop = '5px';
            errorEl.style.display = 'block';
            formGroup.appendChild(errorEl);
        }
    }
    
    // Helper function to remove error
    function removeError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) {
            formGroup.removeChild(errorEl);
        }
    }
    
    // Helper function to show success message
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Your message has been sent successfully!';
        successMessage.style.backgroundColor = 'var(--success-color)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '10px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.marginTop = '20px';
        successMessage.style.textAlign = 'center';
        
        const formGroup = contactForm.querySelector('.form-group:last-child');
        formGroup.parentNode.insertBefore(successMessage, formGroup.nextSibling);
        
        setTimeout(() => {
            formGroup.parentNode.removeChild(successMessage);
        }, 5000);
    }

    // 8. Smooth Scrolling
    // Apply smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 9. Animation on Scroll
    // Add fade-in animation to elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.about-content, .skill-item, .service-item, .portfolio-item, .testimonial-content, .contact-info, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles
    document.querySelectorAll('.about-content, .skill-item, .service-item, .portfolio-item, .testimonial-content, .contact-info, .contact-form').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Apply initial animations
    setTimeout(animateOnScroll, 100);
    
    // Apply animations on scroll
    window.addEventListener('scroll', animateOnScroll);
});