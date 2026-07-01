const API_URL = 'http://127.0.0.1:8000';
const btnLogin = document.getElementById('btnLogin');
const errorMsg = document.getElementById('errorMsg');

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    errorMsg.style.display = 'none';
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const resp = await fetch(`${API_URL}/login/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await resp.json();

        if (resp.ok && data.success) {
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = data.detail || 'Correo o contraseña incorrectos';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.textContent = 'Error de conexión con el servidor';
        errorMsg.style.display = 'block';
    } finally {
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }
});