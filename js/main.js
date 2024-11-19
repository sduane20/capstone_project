"use strict";

// DOM Elements
const heroSection = document.getElementById('hero');
const carousel = document.querySelector('.carousel');
const carouselDots = document.querySelector('.carousel-dots');
const signUp = document.querySelector('.signUp');
const signIn = document.querySelector('.signIn');

// Auth form toggle functions
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

// Carousel functionality
if (carousel && carouselDots) {
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

    // Auto advance slides every 10 seconds
    if (slides.length > 0) {
        setInterval(nextSlide, 10000);
    }
}

// Firebase Authentication (only initialize if on auth pages)
if (document.querySelector('#signInForm') || document.querySelector('#signUpForm')) {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBd_Bf-a5g8sNBD0zUXF6XTOKt3n6XD4vw",
        authDomain: "tranquil-thoughts.firebaseapp.com",
        projectId: "tranquil-thoughts",
        storageBucket: "tranquil-thoughts.appspot.com",
        messagingSenderId: "46951344026",
        appId: "1:46951344026:web:d6c924c18c9b52f5ce7c23"
    };

    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        
        // Set up Google provider with custom parameters
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });

        // Google Auth Event Listeners
        const googleSignInBtn = document.getElementById('GoogleSignIn');
        const googleSignUpBtn = document.getElementById('GoogleSignUp');

        const handleGoogleAuth = async () => {
            try {
                const result = await firebase.auth().signInWithPopup(googleProvider);
                console.log('Successfully authenticated:', result.user.email);
                window.location.href = '../src/dashboard.html';
            } catch (error) {
                console.error('Authentication error:', error);
                alert('Failed to authenticate with Google. Please try again.');
            }
        };

        googleSignInBtn?.addEventListener('click', handleGoogleAuth);
        googleSignUpBtn?.addEventListener('click', handleGoogleAuth);

    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}