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

// Dashboard functionality (only initialize if on dashboard page)
if (document.querySelector('#thoughtModal')) {
    // Quote API
    const fetchQuote = async () => {
        try {
            const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
                headers: {
                    'X-Api-Key': 'wFN1moy4x9MmhU4iWjqWCA==jdTzKyOwCmZ5QhfV'  // Replace with your API key
                }
            });
            const [data] = await response.json();
            document.getElementById('quote-text').textContent = data.quote;
            document.getElementById('quote-author').textContent = `- ${data.author}`;
        } catch (error) {
            console.error('Error fetching quote:', error);
            document.getElementById('quote-text').textContent = 'Every day is a new beginning.';
            document.getElementById('quote-author').textContent = '- Unknown';
        }
    };

    // Modal functionality
    const modal = document.getElementById('thoughtModal');
    const addBtn = document.getElementById('addThoughtBtn');
    const closeBtn = document.getElementById('closeModal');
    const moodOptions = document.querySelectorAll('.mood-option');
    const thoughtForm = document.getElementById('thoughtForm');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Mood selection
    const moodButtons = document.querySelectorAll('.mood-btn');
    let selectedMood = '3'; // Default mood

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            button.classList.add('selected');
            // Update selected mood
            selectedMood = button.dataset.mood;
        });
    });

    // Initialize Firestore
    const db = firebase.firestore();
    let currentUser = null;

    // Check authentication state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadThoughts();
        } else {
            window.location.href = '../auth/login.html';
        }
    });

    // Load thoughts from Firestore
    async function loadThoughts() {
        const thoughtsList = document.getElementById('thoughtsList');
        
        try {
            const snapshot = await db.collection('thoughts')
                .where('userId', '==', currentUser.uid)
                .orderBy('timestamp', 'desc')
                .get();

            if (snapshot.empty) {
                thoughtsList.innerHTML = '<p class="no-thoughts">No thoughts just yet</p>';
                return;
            }

            thoughtsList.innerHTML = '';
            snapshot.forEach(doc => {
                const thought = doc.data();
                const date = thought.timestamp.toDate();
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);

                const moodEmoji = getMoodEmoji(thought.mood);
                
                thoughtsList.innerHTML += `
                    <div class="thought-card">
                        <div class="thought-header">
                            <span class="thought-title">${thought.title}</span>
                            <div>
                                <span class="thought-date">${formattedDate}</span>
                                <span class="thought-mood">${moodEmoji}</span>
                            </div>
                        </div>
                        <p class="thought-content">${thought.body}</p>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error loading thoughts:', error);
            thoughtsList.innerHTML = '<p class="no-thoughts">Error loading thoughts. Please try again later.</p>';
        }
    }

    // Helper function to get mood emoji
    function getMoodEmoji(mood) {
        const moods = {
            '1': '😢',
            '2': '😕',
            '3': '😐',
            '4': '🙂',
            '5': '😊'
        };
        return moods[mood] || '😐';
    }

    // Update form submission
    thoughtForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('thoughtTitle').value;
        const body = document.getElementById('thoughtBody').value;

        try {
            await db.collection('thoughts').add({
                userId: currentUser.uid,
                title: title,
                body: body,
                mood: selectedMood, // Use the selectedMood variable
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Clear form and close modal
            thoughtForm.reset();
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            selectedMood = '3'; // Reset selected mood
            modal.style.display = 'none';

            // Reload thoughts to show new entry
            loadThoughts();
        } catch (error) {
            console.error('Error saving thought:', error);
            alert('Error saving your thought. Please try again.');
        }
    });

    // Fetch quote on page load
    fetchQuote();

    // Sign out functionality
    const signOutBtn = document.getElementById('auth_btn');
    signOutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            console.log('User signed out successfully');
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out. Please try again.');
        }
    });

    // Update the auth state change listener to handle sign out
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            signOutBtn.textContent = 'Sign Out';
            loadThoughts();
        } else {
            currentUser = null;
            window.location.href = '../auth/login.html';
        }
    });
}