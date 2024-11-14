"use strict";
/*
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set up Google and Apple Auth providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const appleProvider = new firebase.auth.OAuthProvider('apple.com');

// Google Sign-In event listener
document.getElementById('GoogleSignIn').addEventListener('click', () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then((result) => {
        window.location.href = '../src/dashboard.html';
    })
    .catch((error) => {
        console.error('Error during Google Sign-in:', error);
    });
});

// Google Sign-Up event listener
document.getElementById('GoogleSignUp').addEventListener('click', () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then((result) => {
        window.location.href = '../src/dashboard.html';
    })
    .catch((error) => {
        console.error('Error during Google Sign-up:', error);
    });
});

// Apple Sign-In event listener
document.getElementById('AppleSignIn').addEventListener('click', () => {
    firebase.auth().signInWithPopup(appleProvider)
    .then((result) => {
        window.location.href = '../src/dashboard.html';
    })
    .catch((error) => {
        console.error('Error during Apple Sign-in:', error);
    });
});

// Apple Sign-Up event listener
document.getElementById('AppleSignUp').addEventListener('click', () => {
    firebase.auth().signInWithPopup(appleProvider)
    .then((result) => {
        window.location.href = '../src/dashboard.html';
    })
    .catch((error) => {
        console.error('Error during Apple Sign-up:', error);
    });
});

// Email Sign-Up form submission handler
document.getElementById('signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailSignUp').value;
    const password = document.getElementById('passwordSignUp').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        window.location.href = '../src/dashboard.html';
    })
    .catch((error) => {
        console.error('Error during email sign-up:', error);
    });
});

// Email Sign-In form submission handler
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailSignIn').value;
    const password = document.getElementById('passwordSignIn').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        window.location.href = '../src/dashboard.html';
    })
    .catch((error) => {
        console.error('Error during email sign-in:', error);
    });
});*/

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