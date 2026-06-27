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

const STORAGE_KEY = "usuarios_monitoreo";
let idEditando = null;

const datosIniciales = [
    { id_usuario: "11937", nombre: "angelica", correo: "angeee@gmail.com", contrasena: "angelica123", tipo: "encargado" },
    { id_usuario: "0062", nombre: "britney", correo: "britney@gmail.com", contrasena: "britney123", tipo: "encargado" },
    { id_usuario: "11938", nombre: "daniel", correo: "dannn@gmail.com", contrasena: "daniel123", tipo: "encargado" },
    { id_usuario: "12", nombre: "root", correo: "root@root", contrasena: "root123", tipo: "encargado" }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerUsuarios() {
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosIniciales));
        return [...datosIniciales];
    }
    
    try {
        return JSON.parse(data);
    } catch {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosIniciales));
        return [...datosIniciales];
    }
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

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

function validarCampos(id, nombre, correo, contrasena, tipo) {
    if (!id || !nombre || !correo || !contrasena || !tipo) {
        mostrarMensaje("Complete todos los campos.", "warning");
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

function cargarTabla() {
    const usuarios = obtenerUsuarios();
    tbodyUsuarios.innerHTML = "";

    usuarios.forEach((u) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.id_usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>${u.tipo}</td>
        `;

        tr.addEventListener("click", () => {
            document.querySelectorAll("#tbodyUsuarios tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");

            entryId.value = u.id_usuario;
            entryNombre.value = u.nombre;
            entryCorreo.value = u.correo;
            entryContrasena.value = u.contrasena;
            entryTipo.value = u.tipo;
            
            idEditando = u.id_usuario;
            entryId.disabled = true;
        });

        tbodyUsuarios.appendChild(tr);
    });

    lblFooter.textContent = `Mostrando ${usuarios.length} registro(s)`;
}

function registrarUsuario() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const correo = entryCorreo.value.trim();
    const contrasena = entryContrasena.value.trim();
    const tipo = entryTipo.value.trim();

    if (!validarCampos(id, nombre, correo, contrasena, tipo)) return;

    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.id_usuario === id)) {
        mostrarMensaje(`Ya existe un usuario con ID ${id}.`, "error");
        return;
    }

    usuarios.push({ id_usuario: id, nombre, correo, contrasena, tipo });
    guardarUsuarios(usuarios);

    mostrarMensaje(`Usuario '${nombre}' registrado.`, "success");
    limpiarCampos();
    cargarTabla();
}

function editarUsuario() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const correo = entryCorreo.value.trim();
    const contrasena = entryContrasena.value.trim();
    const tipo = entryTipo.value.trim();

    if (!validarCampos(id, nombre, correo, contrasena, tipo)) return;

    if (!idEditando) {
        mostrarMensaje("Seleccione un usuario de la tabla para editar.", "warning");
        return;
    }

    const usuarios = obtenerUsuarios();
    const index = usuarios.findIndex(u => u.id_usuario === idEditando);

    if (index === -1) {
        mostrarMensaje(`No existe usuario con ID ${id}.`, "error");
        return;
    }

    usuarios[index] = { id_usuario: id, nombre, correo, contrasena, tipo };
    guardarUsuarios(usuarios);

    mostrarMensaje(`Usuario '${nombre}' actualizado.`, "success");
    limpiarCampos();
    cargarTabla();
}

function eliminarUsuario() {
    const id = entryId.value.trim();

    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) {
        return;
    }

    const usuarios = obtenerUsuarios();
    const filtrados = usuarios.filter(u => u.id_usuario !== id);

    if (filtrados.length === usuarios.length) {
        mostrarMensaje(`No existe usuario con ID ${id}.`, "error");
        return;
    }

    guardarUsuarios(filtrados);
    mostrarMensaje("Registro eliminado.", "success");
    limpiarCampos();
    cargarTabla();
}

btnRegistrar.addEventListener("click", registrarUsuario);
btnEditar.addEventListener("click", editarUsuario);
btnLimpiar.addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de usuarios?")) {
        window.location.href = "principal.html";
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

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});