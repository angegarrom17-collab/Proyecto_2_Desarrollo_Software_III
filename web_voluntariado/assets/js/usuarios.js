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
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
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
// VALIDAR CAMPOS
// ============================================
function validarCampos(correo, contrasena, tipo) {
    if (!correo || !contrasena || !tipo) {
        mostrarMensaje("Complete todos los campos obligatorios (correo, contraseña, tipo).", "warning");
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
// CARGAR USUARIOS DESDE LA API (GET)
// ============================================
async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios/`);

        if (!respuesta.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const usuarios = await respuesta.json();
        tbodyUsuarios.innerHTML = "";

        usuarios.forEach((u) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.email.split('@')[0]}</td>  <!-- Usamos parte del email como nombre -->
                <td>${u.email}</td>
                <td>${u.rol}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyUsuarios tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryId.value = u.id;
                entryNombre.value = u.email.split('@')[0];  // Parte del email como nombre
                entryCorreo.value = u.email;
                entryContrasena.value = "";  // No mostramos la contraseña por seguridad
                entryTipo.value = u.rol;

                idEditando = u.id;
                entryId.disabled = true;
            });

            tbodyUsuarios.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${usuarios.length} registro(s)`;

    } catch (error) {
        mostrarMensaje("❌ Error al cargar usuarios: " + error.message, "error");
        console.error(error);
    }
}

// ============================================
// REGISTRAR USUARIO EN LA API (POST)
// ============================================
async function registrarUsuario() {
    const correo = entryCorreo.value.trim();
    const contrasena = entryContrasena.value.trim();
    const tipo = entryTipo.value.trim();

    if (!validarCampos(correo, contrasena, tipo)) return;

    const usuario = {
        email: correo,
        password: contrasena,
        rol: tipo
    };

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje(`✅ Usuario '${datos.email}' registrado con ID ${datos.id}.`, "success");
            limpiarCampos();
            cargarTabla();  // Recargar la tabla desde la API
        } else {
            mostrarMensaje(`❌ Error: ${datos.detail || 'Error desconocido'}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error(error);
    }
}

// ============================================
// EDITAR USUARIO EN LA API (PUT)
// ============================================
async function editarUsuario() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un usuario de la tabla para editar.", "warning");
        return;
    }

    const correo = entryCorreo.value.trim();
    const contrasena = entryContrasena.value.trim();
    const tipo = entryTipo.value.trim();

    if (!validarCampos(correo, contrasena, tipo)) return;

    const usuario = {
        email: correo,
        password: contrasena,
        rol: tipo
    };

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje(`✅ Usuario '${datos.email}' actualizado.`, "success");
            limpiarCampos();
            cargarTabla();
        } else {
            mostrarMensaje(`❌ Error: ${datos.detail || 'Error desconocido'}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error(error);
    }
}

// ============================================
// ELIMINAR USUARIO EN LA API (DELETE)
// ============================================
async function eliminarUsuario() {
    const id = entryId.value.trim();

    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("✅ Registro eliminado.", "success");
            limpiarCampos();
            cargarTabla();
        } else {
            mostrarMensaje(`❌ Error: ${datos.detail || 'Error desconocido'}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error(error);
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
            if (idEditando) {
                editarUsuario();
            } else {
                registrarUsuario();
            }
        }
    });
});

// ============================================
// CARGAR AL INICIAR
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});