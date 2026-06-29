// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
const API_URL = 'http://127.0.0.1:8000';

// ============================================
// REFERENCIAS AL DOM
// ============================================
const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryUnidad = document.getElementById("entry_unidad");
const entryCantidad = document.getElementById("entry_cantidad");
const tbody = document.getElementById("tbodyMateriales");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

let idEditando = null;

// ============================================
// MENSAJES
// ============================================
function mostrarMensaje(texto, tipo = "success") {
    if (typeof texto !== 'string') texto = JSON.stringify(texto);
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");
    setTimeout(() => messageBox.classList.add("hidden"), 4000);
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

// ============================================
// LIMPIAR CAMPOS
// ============================================
function limpiarCampos() {
    entryId.value = "";
    entryNombre.value = "";
    entryUnidad.value = "";
    entryCantidad.value = "";
    idEditando = null;
    entryId.disabled = false;
    document.querySelectorAll("#tbodyMateriales tr").forEach(tr => tr.classList.remove("seleccionada"));
}

// ============================================
// VALIDAR CAMPOS
// ============================================
function validarCampos(id, nombre, cantidad) {
    if (!id || !nombre || cantidad === "") {
        mostrarMensaje("Complete todos los campos obligatorios.", "warning");
        return false;
    }
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        mostrarMensaje("El ID debe ser un número entero positivo.", "error");
        return false;
    }
    const cant = parseInt(cantidad);
    if (isNaN(cant) || cant < 0) {
        mostrarMensaje("La cantidad debe ser un número entero no negativo.", "error");
        return false;
    }
    return { id: idNum, cant };
}

// ============================================
// CARGAR MATERIALES (GET)
// ============================================
async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/materiales/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const materiales = await respuesta.json();
        tbody.innerHTML = "";

        if (!Array.isArray(materiales) || materiales.length === 0) {
            lblFooter.textContent = "Mostrando 0 material(es)";
            return;
        }

        materiales.forEach((m) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${m.id}</td>
                <td>${m.nombre}</td>
                <td>${m.descripcion || ''}</td>
                <td>${m.cantidad}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyMateriales tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryId.value = m.id;
                entryNombre.value = m.nombre;
                entryUnidad.value = m.descripcion || '';
                entryCantidad.value = m.cantidad;

                idEditando = m.id;
                entryId.disabled = true;
            });

            tbody.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${materiales.length} material(es) en inventario`;

    } catch (error) {
        mostrarMensaje("❌ Error al cargar materiales: " + error.message, "error");
        console.error("Error cargarTabla:", error);
    }
}

// ============================================
// REGISTRAR MATERIAL (POST)
// ============================================
async function registrar() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const descripcion = entryUnidad.value.trim();
    const cantidad = entryCantidad.value.trim();

    const valid = validarCampos(id, nombre, cantidad);
    if (!valid) return;

    const material = {
        id: valid.id,
        nombre: nombre,
        descripcion: descripcion,
        cantidad: valid.cant
    };

    try {
        const respuesta = await fetch(`${API_URL}/materiales/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(material)
        });

        let datos = {};
        const texto = await respuesta.text();
        if (texto) { try { datos = JSON.parse(texto); } catch (e) { datos = { raw: texto }; } }

        if (respuesta.ok || respuesta.status === 201) {
            mostrarMensaje(`✅ Material '${nombre}' registrado.`, "success");
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
// EDITAR MATERIAL (PUT)
// ============================================
async function editar() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un material de la tabla para editar.", "warning");
        return;
    }

    const nombre = entryNombre.value.trim();
    const descripcion = entryUnidad.value.trim();
    const cantidad = entryCantidad.value.trim();

    const valid = validarCampos(entryId.value, nombre, cantidad);
    if (!valid) return;

    const material = {
        id: valid.id,
        nombre: nombre,
        descripcion: descripcion,
        cantidad: valid.cant
    };

    try {
        const respuesta = await fetch(`${API_URL}/materiales/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(material)
        });

        let datos = {};
        const texto = await respuesta.text();
        if (texto) { try { datos = JSON.parse(texto); } catch (e) { datos = { raw: texto }; } }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Material '${nombre}' actualizado.`, "success");
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
// USAR MATERIAL (POST /usar/{id})
// ============================================
async function usarMaterial() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un material de la tabla para usar.", "warning");
        return;
    }

    const cantidad = entryCantidad.value.trim();
    if (!cantidad) {
        mostrarMensaje("Ingrese la cantidad a usar.", "warning");
        return;
    }

    const cant = parseInt(cantidad);
    if (isNaN(cant) || cant <= 0) {
        mostrarMensaje("La cantidad debe ser un número entero positivo.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/materiales/usar/${idEditando}?cantidad=${cant}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' }
        });

        let datos = {};
        const texto = await respuesta.text();
        if (texto) { try { datos = JSON.parse(texto); } catch (e) { datos = { raw: texto }; } }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Se usaron ${cant} unidades.`, "success");
            limpiarCampos();
            setTimeout(cargarTabla, 300);
        } else {
            mostrarMensaje(`❌ Error: ${extraerMensajeError(datos)}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión: " + error.message, "error");
        console.error("Error usarMaterial:", error);
    }
}

// ============================================
// ELIMINAR MATERIAL (DELETE)
// ============================================
async function eliminar() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un material de la tabla para eliminar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el material con ID '${idEditando}'?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/materiales/${idEditando}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        let datos = {};
        const texto = await respuesta.text();
        if (texto) { try { datos = JSON.parse(texto); } catch (e) { datos = { raw: texto }; } }

        if (respuesta.ok) {
            mostrarMensaje("✅ Material eliminado.", "success");
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
document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnUsar").addEventListener("click", usarMaterial);
document.getElementById("btnLimpiar").addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Desea salir?")) window.location.href = "../index.html";
});
document.getElementById("btnBorrar").addEventListener("click", eliminar);

// CARGAR AL INICIAR
document.addEventListener("DOMContentLoaded", cargarTabla);