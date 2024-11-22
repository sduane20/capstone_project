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

// Used Microsoft CoPilot and ChatGPT to helop with Firebase login information syntax
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
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }

    // Set up Google provider
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');

    // Google Auth Event Listeners
    const googleSignInBtn = document.getElementById('GoogleSignIn');
    const googleSignUpBtn = document.getElementById('GoogleSignUp');

    const handleGoogleAuth = async () => {
        try {
            // Force account selection
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await firebase.auth().signInWithPopup(googleProvider);
            const user = result.user;
            
            // Check if this is a new user
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                // Create user document for new users
                await firebase.firestore().collection('users').doc(user.uid).set({
                    firstName: user.displayName?.split(' ')[0] || '',
                    lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            console.log('Successfully authenticated:', user.email);
            window.location.href = '../src/dashboard.html';
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Failed to authenticate with Google. Please try again.');
        }
    };

    googleSignInBtn?.addEventListener('click', handleGoogleAuth);
    googleSignUpBtn?.addEventListener('click', handleGoogleAuth);

    // Email/Password Sign Up
    const signUpForm = document.getElementById('signUpForm');
    signUpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('emailSignUp').value;
        const password = document.getElementById('passwordSignUp').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;

        try {
            // Create user with email and password
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            // Add user details to Firestore
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('User created successfully');
            window.location.href = '../src/dashboard.html';
        } catch (error) {
            console.error('Sign up error:', error);
            let errorMessage = 'An error occurred during sign up.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please sign in or use a different email.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Please choose a stronger password (at least 6 characters).';
                    break;
            }
            
            alert(errorMessage);
        }
    });

    // Email/Password Sign In
    const signInForm = document.getElementById('signInForm');
    signInForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('emailSignIn').value;
        const password = document.getElementById('passwordSignIn').value;

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            window.location.href = '../src/dashboard.html';
        } catch (error) {
            console.error('Sign in error:', error);
            if (error.code === 'auth/invalid-credential') {
                alert('Invalid email or password. Please try again.');
            } else {
                alert(error.message);
            }
        }
    });
}

// Dashboard functionality (only initialize if on dashboard page)
if (document.querySelector('#thoughtModal')) {
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
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    let currentUser = null;

    // Auth state listener
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const signOutBtn = document.getElementById('auth_btn');
            signOutBtn.textContent = 'Sign Out';
            
            // Fetch and display user's name
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    document.getElementById('userName').textContent = userData.firstName;
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            
            loadThoughts();
        } else {
            window.location.href = '../auth/login.html';
        }
    });

    // Sign out functionality
    const signOutBtn = document.getElementById('auth_btn');
    signOutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out. Please try again.');
        }
    });

    // Update the loadThoughts function
    async function loadThoughts() {
        const thoughtsList = document.getElementById('thoughtsList');
        const currentUser = firebase.auth().currentUser;
        
        if (!currentUser) {
            console.error('No authenticated user');
            return;
        }

        try {
            // Show loading state
            thoughtsList.innerHTML = '<p class="loading-thoughts">Loading your thoughts...</p>';

            // Check if index exists before querying
            const snapshot = await db.collection('thoughts')
                .where('userId', '==', currentUser.uid)
                .orderBy('timestamp', 'desc')
                .get()
                .catch(error => {
                    if (error.code === 'failed-precondition') {
                        throw new Error('Database index is still building. Please try again in a few minutes.');
                    }
                    throw error;
                });

            if (snapshot.empty) {
                thoughtsList.innerHTML = '<p class="no-thoughts">No thoughts just yet</p>';
                return;
            }

            thoughtsList.innerHTML = '';
            snapshot.forEach(doc => {
                const thought = doc.data();
                const thoughtDate = thought.timestamp ? new Date(thought.timestamp.toDate()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Date not available';
                
                thoughtsList.innerHTML += `
                    <div class="thought-card" onclick="viewThought('${doc.id}')">
                        <div class="thought-header">
                            <h3 class="thought-title">${thought.title}</h3>
                            <div class="thought-actions">
                                <button class="edit-btn" onclick="event.stopPropagation(); editThought('${doc.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-btn" onclick="event.stopPropagation(); deleteThought('${doc.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="thought-meta">
                            <span class="thought-date">${thoughtDate}</span>
                            <span class="thought-mood">${getMoodEmoji(thought.mood)}</span>
                        </div>
                        <div class="thought-preview">
                            ${thought.body.substring(0, 150)}${thought.body.length > 150 ? '...' : ''}
                        </div>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error loading thoughts:', error);
            thoughtsList.innerHTML = `
                <p class="error">
                    ${error.message || 'Error loading thoughts. Please try again later.'}
                </p>
            `;
        }
    }

    // View thought function
    async function viewThought(thoughtId) {
        try {
            const doc = await db.collection('thoughts').doc(thoughtId).get();
            if (!doc.exists) return;
            
            const thought = doc.data();
            const date = thought.timestamp.toDate();
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);

            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content view-thought">
                    <span class="close-btn" onclick="modal.style.display='none'">&times;</span>
                    <h2>${thought.title}</h2>
                    <div class="thought-meta">
                        <span class="thought-date">${formattedDate}</span>
                        <span class="thought-mood">${getMoodEmoji(thought.mood)}</span>
                    </div>
                    <p class="thought-content">${thought.body}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error viewing thought:', error);
            alert('Error loading thought. Please try again.');
        }
    }

    // Edit thought function
    async function editThought(thoughtId) {
        try {
            const doc = await db.collection('thoughts').doc(thoughtId).get();
            if (!doc.exists) return;
            
            const thought = doc.data();
            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn" onclick="modal.style.display='none'">&times;</span>
                    <form class="thought-form" id="editThoughtForm">
                        <h2>Edit Thought</h2>
                        <input type="text" id="editTitle" value="${thought.title}" required>
                        <textarea id="editBody" rows="5" required>${thought.body}</textarea>
                        <div class="mood-rating">
                            <button type="button" class="mood-btn ${thought.mood === '1' ? 'selected' : ''}" data-mood="1">😢</button>
                            <button type="button" class="mood-btn ${thought.mood === '2' ? 'selected' : ''}" data-mood="2">😕</button>
                            <button type="button" class="mood-btn ${thought.mood === '3' ? 'selected' : ''}" data-mood="3">😐</button>
                            <button type="button" class="mood-btn ${thought.mood === '4' ? 'selected' : ''}" data-mood="4">🙂</button>
                            <button type="button" class="mood-btn ${thought.mood === '5' ? 'selected' : ''}" data-mood="5">😊</button>
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            `;

            // Add mood selection listeners
            const moodButtons = document.querySelectorAll('.mood-btn');
            let selectedMood = thought.mood;
            moodButtons.forEach(button => {
                button.addEventListener('click', () => {
                    moodButtons.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    selectedMood = button.dataset.mood;
                });
            });

            // Add form submission listener
            document.getElementById('editThoughtForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await db.collection('thoughts').doc(thoughtId).update({
                        title: document.getElementById('editTitle').value,
                        body: document.getElementById('editBody').value,
                        mood: selectedMood,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    modal.style.display = 'none';
                    loadThoughts();
                } catch (error) {
                    console.error('Error updating thought:', error);
                    alert('Error updating thought. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error editing thought:', error);
            alert('Error loading thought for editing. Please try again.');
        }
    }

    // Delete thought function
    async function deleteThought(thoughtId) {
        if (confirm('Are you sure you want to delete this thought?')) {
            try {
                await db.collection('thoughts').doc(thoughtId).delete();
                loadThoughts();
            } catch (error) {
                console.error('Error deleting thought:', error);
                alert('Error deleting thought. Please try again.');
            }
        }
    }

    // Make functions globally available
    window.viewThought = viewThought;
    window.editThought = editThought;
    window.deleteThought = deleteThought;

    // Quote API functionality
    const fetchQuote = async () => {
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        
        try {
            const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
                headers: {
                    'X-Api-Key': 'wFN1moy4x9MmhU4iWjqWCA==jdTzKyOwCmZ5QhfV',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const [data] = await response.json();
            
            if (data && data.quote) {
                quoteText.textContent = `"${data.quote}"`;
                quoteAuthor.textContent = `- ${data.author}`;
            } else {
                throw new Error('Invalid quote data received');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            // Fallback quote in case of API failure
            quoteText.textContent = '"Every moment is a fresh beginning."';
            quoteAuthor.textContent = '- T.S. Eliot';
        }
    };

    // Fetch quote immediately when page loads
    fetchQuote();
    
    // Refresh quote every hour
    setInterval(fetchQuote, 3600000);

    // Modal functionality
    const modal = document.getElementById('thoughtModal');
    const addBtn = document.getElementById('addThoughtBtn');
    const closeBtn = document.getElementById('closeModal');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const thoughtForm = document.getElementById('thoughtForm');
    let selectedMood = '3'; // Default mood

    // Add thought button click handler
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        thoughtForm.reset();
        moodButtons.forEach(btn => btn.classList.remove('selected'));
    });

    // Close button click handler
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Mood selection
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedMood = button.dataset.mood;
        });
    });

    // Form submission
    thoughtForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('thoughtTitle').value;
        const body = document.getElementById('thoughtBody').value;

        try {
            // Check if user is authenticated
            if (!firebase.auth().currentUser) {
                throw new Error('User not authenticated');
            }

            // Create the thought document
            const thoughtData = {
                userId: firebase.auth().currentUser.uid,
                title: title,
                body: body,
                mood: selectedMood,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Add to Firestore
            await db.collection('thoughts').add(thoughtData);
            console.log('Thought saved successfully');

            // Clear form and close modal
            thoughtForm.reset();
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            selectedMood = '3'; // Reset selected mood
            modal.style.display = 'none';

            // Reload thoughts to show new entry
            await loadThoughts();
        } catch (error) {
            console.error('Error saving thought:', error);
            alert('Error saving your thought. Please try again.');
        }
    });

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

    // Load thoughts when page loads
    loadThoughts();
}