// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
const API_URL = 'http://127.0.0.1:8000';

// ============================================
// REFERENCIAS AL DOM
// ============================================
const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryCorreo = document.getElementById("entry_correo");
const entryContrasena = document.getElementById("entry_contrasena");
const entryTipo = document.getElementById("entry_tipo");
const tbodyUsuarios = document.getElementById("tbodyUsuarios");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnEditar = document.getElementById("btnEditar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnSalir = document.getElementById("btnSalir");
const btnBorrar = document.getElementById("btnBorrar");

let idEditando = null;

// ============================================
// MENSAJES
// ============================================
function mostrarMensaje(texto, tipo = "success") {
    if (typeof texto !== 'string') texto = JSON.stringify(texto);
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 4000);
}

// ============================================
// EXTRAER MENSAJE DE ERROR
// ============================================
function extraerMensajeError(datos) {
    if (!datos) return 'Error desconocido';
    if (typeof datos.detail === 'string') return datos.detail;
    if (Array.isArray(datos.detail)) {
        return datos.detail.map(e => e.msg || JSON.stringify(e)).join('; ');
    }
    if (datos.message) return datos.message;
    if (datos.error) return datos.error;
    return JSON.stringify(datos);
}

// ============================================
// LIMPIAR CAMPOS
// ============================================
function limpiarCampos() {
    entryId.value = "";
    entryNombre.value = "";
    entryCorreo.value = "";
    entryContrasena.value = "";
    entryTipo.value = "encargado";
    idEditando = null;
    entryId.disabled = false;

    document.querySelectorAll("#tbodyUsuarios tr").forEach(tr => {
        tr.classList.remove("seleccionada");
    });
}

// ============================================
// VALIDAR CAMPOS REGISTRO
// ============================================
function validarCamposRegistro(id, correo, contrasena, tipo) {
    if (!id || !correo || !contrasena || !tipo) {
        mostrarMensaje("Complete todos los campos incluyendo el ID.", "warning");
        return false;
    }
    if (!/^\d+$/.test(id)) {
        mostrarMensaje("El ID debe ser numérico.", "error");
        return false;
    }
    if (!correo.includes("@")) {
        mostrarMensaje("El correo no tiene formato válido.", "error");
        return false;
    }
    if (contrasena.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
        return false;
    }
    if (tipo !== "encargado") {
        mostrarMensaje("Tipo de usuario no válido. Solo se acepta: encargado", "error");
        return false;
    }
    return true;
}

// ============================================
// VALIDAR CAMPOS EDICIÓN
// ============================================
function validarCamposEdicion(correo, contrasena, tipo) {
    if (!correo || !tipo) {
        mostrarMensaje("Complete el correo y el tipo de usuario.", "warning");
        return false;
    }
    if (!correo.includes("@")) {
        mostrarMensaje("El correo no tiene formato válido.", "error");
        return false;
    }
    if (contrasena && contrasena.length > 0 && contrasena.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
        return false;
    }
    if (tipo !== "encargado") {
        mostrarMensaje("Tipo de usuario no válido. Solo se acepta: encargado", "error");
        return false;
    }
    return true;
}

// ============================================
// CARGAR USUARIOS (GET)
// ============================================
async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const usuarios = await respuesta.json();
        tbodyUsuarios.innerHTML = "";

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            lblFooter.textContent = "Mostrando 0 registro(s)";
            return;
        }

        usuarios.forEach((u) => {
            const tr = document.createElement("tr");
            const nombreMostrar = u.nombre || (u.email ? u.email.split('@')[0] : '');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${nombreMostrar}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyUsuarios tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryId.value = u.id;
                entryNombre.value = nombreMostrar;
                entryCorreo.value = u.email;
                entryContrasena.value = "";
                entryTipo.value = u.rol;

                idEditando = u.id;
                entryId.disabled = true;
            });

            tbodyUsuarios.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${usuarios.length} registro(s)`;

    } catch (error) {
        mostrarMensaje("❌ Error al cargar usuarios: " + error.message, "error");
        console.error("Error cargarTabla:", error);
    }
}

// ============================================
// REGISTRAR USUARIO (POST)
// ============================================
async function registrarUsuario() {
    const id = entryId.value.trim();
    const correo = entryCorreo.value.trim();
    const contrasena = entryContrasena.value.trim();
    const tipo = entryTipo.value.trim();

    if (!validarCamposRegistro(id, correo, contrasena, tipo)) return;

    // Solo enviamos lo que el backend espera (sin 'nombre')
    const usuario = {
        id: id,
        email: correo,
        password: contrasena,
        rol: tipo
    };

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok || respuesta.status === 201) {
            mostrarMensaje(`✅ Usuario '${datos.email || correo}' registrado correctamente.`, "success");
            limpiarCampos();
            setTimeout(cargarTabla, 300);
        } else {
            mostrarMensaje(`❌ Error: ${extraerMensajeError(datos)}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error("Error registrar:", error);
    }
}

// ============================================
// EDITAR USUARIO (PUT)
// ============================================
async function editarUsuario() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un usuario de la tabla para editar.", "warning");
        return;
    }

    const correo = entryCorreo.value.trim();
    const contrasena = entryContrasena.value.trim();
    const tipo = entryTipo.value.trim();

    if (!validarCamposEdicion(correo, contrasena, tipo)) return;

    const usuario = {
        email: correo,
        password: contrasena,
        rol: tipo
    };

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Usuario actualizado correctamente.`, "success");
            limpiarCampos();
            setTimeout(cargarTabla, 300);
        } else {
            mostrarMensaje(`❌ Error: ${extraerMensajeError(datos)}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error("Error editar:", error);
    }
}

// ============================================
// ELIMINAR USUARIO (DELETE)
// ============================================
async function eliminarUsuario() {
    const id = entryId.value.trim();

    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje("✅ Registro eliminado.", "success");
            limpiarCampos();
            setTimeout(cargarTabla, 300);
        } else {
            mostrarMensaje(`❌ Error: ${extraerMensajeError(datos)}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error("Error eliminar:", error);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
btnRegistrar.addEventListener("click", registrarUsuario);
btnEditar.addEventListener("click", editarUsuario);
btnLimpiar.addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de usuarios?")) {
        window.location.href = "../index.html";
    }
});
btnBorrar.addEventListener("click", eliminarUsuario);

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            idEditando ? editarUsuario() : registrarUsuario();
        }
    });
});

// ============================================
// CARGAR AL INICIAR
// ============================================
document.addEventListener("DOMContentLoaded", cargarTabla);