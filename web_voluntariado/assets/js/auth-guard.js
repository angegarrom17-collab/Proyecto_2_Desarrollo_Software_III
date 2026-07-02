// ============================================
// AUTH-GUARD.JS - Protección simple de páginas
// Verifica que el usuario haya iniciado sesión
// ============================================

(function() {
    // NO ejecutar en la página de login para evitar bucle
    const path = window.location.pathname;
    if (path.includes("login.html") || path.includes("/login/")) {
        return;
    }

    // Verificar si hay sesión activa
    const usuario = sessionStorage.getItem("usuario_logueado");

    if (!usuario) {
        // No hay sesión, redirigir al login
        window.location.href = "pages/login.html";  // Desde web_voluntariado/ raíz
        return;
    }

    // Opcional: mostrar nombre del usuario en algún lugar
    try {
        const datos = JSON.parse(usuario);
        console.log("Usuario autenticado:", datos.nombre || datos.email);
    } catch (e) {
        sessionStorage.removeItem("usuario_logueado");
        window.location.href = "pages/login.html";
    }
})();