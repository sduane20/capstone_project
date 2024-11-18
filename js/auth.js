//Used Microsoft co-pilot to fix code for Firebase login. Using the firebase docs lead to many errors lol.

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
        firebase.initializeApp(firebaseConfig);
        
        // Set up Google and Apple Auth providers
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        
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
        });


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