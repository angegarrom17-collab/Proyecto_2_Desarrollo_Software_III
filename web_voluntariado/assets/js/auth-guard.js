

(function() {
    const usuario = sessionStorage.getItem("usuario_logueado");

    if (!usuario) {
        window.location.href = "../login/login.html";
        return;
    }

    try {
        const datos = JSON.parse(usuario);
        console.log("Usuario autenticado:", datos.nombre || datos.email);
    } catch (e) {
        sessionStorage.removeItem("usuario_logueado");
        window.location.href = "../login/login.html";
    }
})();
