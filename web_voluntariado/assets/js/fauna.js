const API_URL = "http://localhost:8000/fauna";

const entryId = document.getElementById("entry_id");
const entryEspecie = document.getElementById("entry_especie");
const entryEstado = document.getElementById("entry_estado");
const entryDescripcion = document.getElementById("entry_descripcion");
const tbody = document.getElementById("tbodyFauna");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

let idEditando = null;

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function limpiarCampos() {
    entryId.value = "";
    entryEspecie.value = "";
    entryEstado.value = "";
    entryDescripcion.value = "";
    idEditando = null;
    entryId.disabled = false;
    document.querySelectorAll("#tbodyFauna tr").forEach(tr => tr.classList.remove("seleccionada"));
}

function validar(id, especie, estado) {
    if (!id || !especie || !estado) {
        mostrarMensaje("Complete ID, Especie y Estado.", "warning");
        return false;
    }
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        mostrarMensaje("El ID debe ser un número entero positivo.", "error");
        return false;
    }
    const estadoNorm = estado.trim().toLowerCase();
    if (!["vivo", "herido", "muerto"].includes(estadoNorm)) {
        mostrarMensaje("El estado debe ser: vivo, herido o muerto.", "error");
        return false;
    }
    return { idNum, estadoNorm };
}

async function cargarTabla() {
    try {
        const res = await fetch(API_URL + "/");
        if (!res.ok) {
            mostrarMensaje("Error al obtener datos del servidor.", "error");
            return;
        }
        const animales = await res.json();
        tbody.innerHTML = "";

        animales.forEach((a) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${a.id}</td><td>${a.especie}</td><td>${a.estado}</td><td>${a.descripcion}</td>`;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyFauna tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryId.value = a.id;
                entryEspecie.value = a.especie;
                entryEstado.value = a.estado;
                entryDescripcion.value = a.descripcion;

                idEditando = a.id;
                entryId.disabled = true;
            });

            tbody.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${animales.length} animal(es)`;
    } catch (e) {
        mostrarMensaje("Error al cargar datos del servidor.", "error");
    }
}

async function registrar() {
    const id = entryId.value.trim();
    const especie = entryEspecie.value.trim();
    const estado = entryEstado.value.trim();
    const desc = entryDescripcion.value.trim();

    const valid = validar(id, especie, estado);
    if (!valid) return;

    try {
        const res = await fetch(API_URL + "/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: valid.idNum,
                especie: especie,
                estado: valid.estadoNorm,
                descripcion: desc
            })
        });

        if (!res.ok) {
            const err = await res.json();
            mostrarMensaje(err.detail || "Error al registrar", "error");
            return;
        }

        mostrarMensaje("Animal registrado correctamente.", "success");
        limpiarCampos();
        cargarTabla();
    } catch (e) {
        mostrarMensaje("No se pudo conectar con el servidor.", "error");
    }
}

async function editar() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un animal de la tabla para editar.", "warning");
        return;
    }

    const id = entryId.value.trim();
    const especie = entryEspecie.value.trim();
    const estado = entryEstado.value.trim();
    const desc = entryDescripcion.value.trim();

    const valid = validar(id, especie, estado);
    if (!valid) return;

    try {
        const res = await fetch(`${API_URL}/${idEditando}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: valid.idNum,
                especie: especie,
                estado: valid.estadoNorm,
                descripcion: desc
            })
        });

        if (!res.ok) {
            const err = await res.json();
            mostrarMensaje(err.detail || "Error al actualizar", "error");
            return;
        }

        mostrarMensaje("Animal actualizado correctamente.", "success");
        limpiarCampos();
        cargarTabla();
    } catch (e) {
        mostrarMensaje("No se pudo conectar con el servidor.", "error");
    }
}

async function buscar() {
    const id = entryId.value.trim();
    if (!id) {
        mostrarMensaje("Ingrese un ID para buscar.", "warning");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            mostrarMensaje("Animal no encontrado.", "warning");
            return;
        }
        const animal = await res.json();
        entryEspecie.value = animal.especie;
        entryEstado.value = animal.estado;
        entryDescripcion.value = animal.descripcion;
        mostrarMensaje("Animal encontrado.", "success");
    } catch (e) {
        mostrarMensaje("No se pudo conectar con el servidor.", "error");
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
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const err = await res.json();
            mostrarMensaje(err.detail || "Error al eliminar", "error");
            return;
        }
        mostrarMensaje("Registro eliminado.", "success");
        limpiarCampos();
        cargarTabla();
    } catch (e) {
        mostrarMensaje("No se pudo conectar con el servidor.", "error");
    }
}

// Event Listeners
document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnBuscar").addEventListener("click", buscar);
document.getElementById("btnLimpiar").addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Desea salir?")) window.location.href = "../index.html";
});
document.getElementById("btnBorrar").addEventListener("click", eliminar);

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});