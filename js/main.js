"use strict";
//DOM Elements
const heroSection = document.getElementById('hero');
const carousel = document.querySelector('.carousel');
const carouselDots = document.querySelector('.carousel-dots')
const signUp = document.querySelector('.signUp');
const signIn = document.querySelector('.signIn');
                
                function showSignIn() {
                    signUp.classList.remove('active');
                    signUp.classList.add('deactivate');
                
                    setTimeout(() => {
                        signUp.classList.remove('deactivate');
                        signIn.classList.add('active');
                    }, 300);
                }
                
                function showSignUp() {
                    signIn.classList.remove('active');
                    signIn.classList.add('deactivate');
                
                    setTimeout(() => {
                        signIn.classList.remove('deactivate');
                        signUp.classList.add('active');
                    }, 300);
                }

let currentSlide = 0;
                const slides = document.querySelectorAll('.carousel-slide');
                
                // Create dots
                if (slides.length > 0) {
                    slides.forEach((_, index) => {
                        const dot = document.createElement('div');
                        dot.classList.add('dot');
                        if (index === 0) dot.classList.add('active');
                        dot.addEventListener('click', () => goToSlide(index));
                        carouselDots.appendChild(dot);
                    });
                }
                
                function goToSlide(n) {
                    currentSlide = n;
                    updateCarousel();
                }
                
                function updateCarousel() {
                    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
                    
                    // Update dots
                    document.querySelectorAll('.dot').forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentSlide);
                    });
                }
                
                function nextSlide() {
                    currentSlide = (currentSlide + 1) % slides.length;
                    updateCarousel();
                }
                
                // Auto advance slides every 5 seconds
                if (slides.length > 0) {
                    setInterval(nextSlide, 10000);
                } 