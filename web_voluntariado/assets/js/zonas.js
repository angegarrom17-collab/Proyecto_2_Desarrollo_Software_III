const API_URL = 'http://127.0.0.1:8000';

const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryUbicacion = document.getElementById("entry_ubicacion");
const entryNivel = document.getElementById("entry_nivel");
const entryDescripcion = document.getElementById("entry_descripcion");
const tbody = document.getElementById("tbodyZonas");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

let idEditando = null;

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 4000);
}

function extraerMensajeError(datos) {
    if (!datos) return 'Error desconocido';
    if (datos.detail) {
        if (typeof datos.detail === 'string') return datos.detail;
        if (Array.isArray(datos.detail)) {
            return datos.detail.map(err => {
                if (typeof err === 'string') return err;
                if (err.msg) return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
                return JSON.stringify(err);
            }).join('; ');
        }
        return JSON.stringify(datos.detail);
    }
    if (datos.message) return datos.message;
    if (datos.error) return datos.error;
    return JSON.stringify(datos);
}

function limpiarCampos() {
    entryId.value = "";
    entryNombre.value = "";
    entryUbicacion.value = "";
    entryNivel.value = "";
    entryDescripcion.value = "";
    idEditando = null;
    entryId.disabled = false;
    document.querySelectorAll("#tbodyZonas tr").forEach(tr => tr.classList.remove("seleccionada"));
}

function validarCampos(id, nombre, ubicacion, nivel) {
    if (!id || !nombre || !ubicacion || !nivel) {
        mostrarMensaje("Complete todos los campos obligatorios.", "warning");
        return false;
    }
    if (!/^\d+$/.test(id)) {
        mostrarMensaje("El ID debe ser numérico.", "error");
        return false;
    }
    const niveles = ["bajo", "medio", "alto", "critico"];
    if (!niveles.includes(nivel.toLowerCase())) {
        mostrarMensaje(`Nivel inválido. Use: ${niveles.join(", ")}`, "error");
        return false;
    }
    return true;
}

async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/zonas/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }
        const zonas = await respuesta.json();
        tbody.innerHTML = "";
        if (!Array.isArray(zonas) || zonas.length === 0) {
            lblFooter.textContent = "Mostrando 0 registro(s)";
            return;
        }
        zonas.forEach((z) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${z.id_zona}</td><td>${z.nombre_zona}</td><td>${z.ubicacion}</td><td>${z.nivel_contaminacion}</td>`;
            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyZonas tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");
                entryId.value = z.id_zona;
                entryNombre.value = z.nombre_zona;
                entryUbicacion.value = z.ubicacion;
                entryNivel.value = z.nivel_contaminacion;
                entryDescripcion.value = z.descripcion || "";
                idEditando = z.id_zona;
                entryId.disabled = true;
            });
            tbody.appendChild(tr);
        });
        lblFooter.textContent = `Mostrando ${zonas.length} zona(s) registrada(s)`;
    } catch (error) {
        mostrarMensaje("❌ Error al cargar zonas: " + error.message, "error");
        console.error("Error cargarTabla:", error);
    }
}

async function registrar() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const ubicacion = entryUbicacion.value.trim();
    const nivel = entryNivel.value.trim().toLowerCase();
    const descripcion = entryDescripcion.value.trim();

    if (!validarCampos(id, nombre, ubicacion, nivel)) return;

    const zona = {
        id_zona: parseInt(id),
        nombre_zona: nombre,
        ubicacion: ubicacion,
        nivel_contaminacion: nivel,
        descripcion: descripcion
    };

    try {
        const respuesta = await fetch(`${API_URL}/zonas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(zona)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok || respuesta.status === 201) {
            mostrarMensaje(`✅ Zona '${nombre}' registrada correctamente.`, "success");
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

async function editar() {
    if (!idEditando) {
        mostrarMensaje("Seleccione una zona de la tabla para editar.", "warning");
        return;
    }

    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const ubicacion = entryUbicacion.value.trim();
    const nivel = entryNivel.value.trim().toLowerCase();
    const descripcion = entryDescripcion.value.trim();

    if (!validarCampos(id, nombre, ubicacion, nivel)) return;

    const zona = {
        nombre_zona: nombre,
        ubicacion: ubicacion,
        nivel_contaminacion: nivel,
        descripcion: descripcion
    };

    try {
        const respuesta = await fetch(`${API_URL}/zonas/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(zona)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Zona actualizada correctamente.`, "success");
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

async function eliminar() {
    const id = entryId.value.trim();
    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }
    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/zonas/${id}`, {
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

document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnLimpiar").addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Desea salir?")) window.location.href = "../index.html";
});
document.getElementById("btnBorrar").addEventListener("click", eliminar);

document.addEventListener("DOMContentLoaded", cargarTabla);