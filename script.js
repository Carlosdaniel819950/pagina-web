// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Proteção de rota (executa em todas as páginas)
auth.onAuthStateChanged(user => {
    const isProtectedPage = window.location.pathname.includes('home.html');
    if (isProtectedPage && !user) {
        window.location.href = 'index.html'; // Redireciona se não estiver logado
    }
});

// Login com email/senha
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => window.location.href = 'home.html')
            .catch(err => alert('Erro: ' + err.message));
    });
}

// Cadastro com nome e idade
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                return db.collection('usuarios').doc(cred.user.uid).set({
                    nome: name,
                    idade: age,
                    email: email,
                    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                window.location.href = 'home.html';
            })
            .catch(err => alert('Erro: ' + err.message));
    });
}

// Login com Google
const googleBtn = document.getElementById('googleLogin');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                return db.collection('usuarios').doc(user.uid).set({
                    nome: user.displayName || 'Usuário Google',
                    email: user.email,
                    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            })
            .then(() => window.location.href = 'home.html')
            .catch(err => alert('Erro: ' + err.message));
    });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => window.location.href = 'logout.html');
    });
}

// Loader animado
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('fade-out');
    }
});
