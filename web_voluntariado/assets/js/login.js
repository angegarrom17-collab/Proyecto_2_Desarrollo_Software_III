// ============================================
// LOGIN.JS - Validación de inicio de sesión
// ============================================

const API_URL = 'http://127.0.0.1:8000';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnIngresar = document.getElementById("btnIngresar");
const messageBox = document.getElementById("messageBox");
const loginForm = document.getElementById("loginForm");

function mostrarMensaje(texto, tipo) {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");
}

function ocultarMensaje() {
    messageBox.classList.add("hidden");
}

function extraerMensajeError(datos) {
    if (!datos) return 'Error desconocido';
    if (datos.detail) {
        if (typeof datos.detail === 'string') return datos.detail;
        if (Array.isArray(datos.detail)) {
            return datos.detail.map(err => err.msg || JSON.stringify(err)).join('; ');
        }
        return JSON.stringify(datos.detail);
    }
    if (datos.message) return datos.message;
    if (datos.error) return datos.error;
    return JSON.stringify(datos);
}

async function iniciarSesion() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validaciones básicas del frontend
    if (!email || !password) {
        mostrarMensaje("Complete todos los campos.", "error");
        return;
    }

    if (!email.includes("@")) {
        mostrarMensaje("Ingrese un correo válido.", "error");
        return;
    }

    // Deshabilitar botón mientras se procesa
    btnIngresar.disabled = true;
    btnIngresar.textContent = "Verificando...";
    ocultarMensaje();

    try {
        // Llamar al endpoint de login del backend
        const respuesta = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            // Login exitoso
            mostrarMensaje("✅ Inicio de sesión exitoso. Redirigiendo...", "success");

            // Guardar datos básicos en sessionStorage (simple, sin token JWT)
            sessionStorage.setItem("usuario_logueado", JSON.stringify({
                email: datos.email || email,
                nombre: datos.nombre || email,
                rol: datos.rol || "encargado"
            }));

            setTimeout(() => {
                window.location.href = "../index.html";  // ← CORREGIDO: ../ para subir de pages/ a raíz
            }, 1000);

            // Redirigir al panel principal - RUTA CORREGIDA
            setTimeout(() => {
                window.location.href = "index.html";  // Misma carpeta pages/ → sube a web_voluntariado/
            }, 1000);

        } else {
            mostrarMensaje(`❌ ${extraerMensajeError(datos)}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión. Verifique que el servidor esté activo.", "error");
        console.error("Error login:", error);
    } finally {
        btnIngresar.disabled = false;
        btnIngresar.textContent = "Ingresar";
    }
}

// Event Listeners
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSesion();
});

// Limpiar mensaje al escribir
emailInput.addEventListener("input", ocultarMensaje);
passwordInput.addEventListener("input", ocultarMensaje);

// Enfocar campo email al cargar
document.addEventListener("DOMContentLoaded", () => {
    emailInput.focus();
});