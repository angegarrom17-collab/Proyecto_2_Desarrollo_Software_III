// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
const API_URL = 'http://127.0.0.1:8000';

// ============================================
// REFERENCIAS AL DOM
// ============================================
const entryId = document.getElementById("entry_id");
const entryFecha = document.getElementById("entry_fecha");
const entryDesc = document.getElementById("entry_descripcion");
const entryBasura = document.getElementById("entry_basura");
const entryObs = document.getElementById("entry_obs");
const entryZona = document.getElementById("entry_zona");
const entryVoluntarios = document.getElementById("entry_voluntarios");
const tbodyJornadas = document.getElementById("tbodyJornadas");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnEditar = document.getElementById("btnEditar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnSalir = document.getElementById("btnSalir");
const btnBorrar = document.getElementById("btnBorrar");
const btnReporte = document.getElementById("btnReporte");

let idEditando = null;

// ============================================
// MENSAJES
// ============================================
function mostrarMensaje(texto, tipo = "success") {
    if (typeof texto !== 'string') {
        texto = JSON.stringify(texto);
    }
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 4000);
}

// ============================================
// EXTRAER MENSAJE DE ERROR DEL BACKEND
// ============================================
function extraerMensajeError(datos) {
    if (!datos) return 'Error desconocido';

    if (datos.detail) {
        if (typeof datos.detail === 'string') {
            return datos.detail;
        }
        if (Array.isArray(datos.detail)) {
            return datos.detail.map(err => {
                if (typeof err === 'string') return err;
                if (err.msg) return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
                return JSON.stringify(err);
            }).join('; ');
        }
        if (typeof datos.detail === 'object') {
            return JSON.stringify(datos.detail);
        }
        return String(datos.detail);
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
    entryFecha.value = "";
    entryDesc.value = "";
    entryBasura.value = "";
    entryObs.value = "";
    entryZona.value = "";
    entryVoluntarios.value = "";

    idEditando = null;
    entryId.disabled = false;

    document.querySelectorAll("#tbodyJornadas tr").forEach(tr => {
        tr.classList.remove("seleccionada");
    });
}

// ============================================
// VALIDAR CAMPOS
// ============================================
function validarCampos(id, fecha, desc, basura, obs, zona, vols) {
    if (!id || !fecha || !desc || !basura || !obs || !zona) {
        mostrarMensaje("Complete todos los campos obligatorios.", "warning");
        return false;
    }

    const cantidad = parseInt(basura);
    const idZona = parseInt(zona);
    const voluntarios = parseInt(vols || "0");

    if (isNaN(cantidad) || cantidad <= 0) {
        mostrarMensaje("La basura debe ser un número mayor a cero.", "error");
        return false;
    }

    if (isNaN(idZona) || idZona <= 0) {
        mostrarMensaje("El ID de zona debe ser un número entero válido.", "error");
        return false;
    }

    if (isNaN(voluntarios) || voluntarios < 0) {
        mostrarMensaje("Los voluntarios deben ser un número entero.", "error");
        return false;
    }

    return { cantidad, idZona, voluntarios };
}

// ============================================
// CARGAR JORNADAS DESDE LA API (GET)
// ============================================
async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/jornadas/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const jornadas = await respuesta.json();
        tbodyJornadas.innerHTML = "";

        if (!Array.isArray(jornadas) || jornadas.length === 0) {
            lblFooter.textContent = "Mostrando 0 registro(s)";
            return;
        }

        jornadas.forEach((j) => {
            const tr = document.createElement("tr");
            // Usar el campo cantidad_voluntarios del backend
            const numVoluntarios = j.cantidad_voluntarios !== undefined ? j.cantidad_voluntarios : 0;

            tr.innerHTML = `
                <td>${j.id_jornada}</td>
                <td>${j.fecha}</td>
                <td>${j.descripcion}</td>
                <td>${j.cantidad_basura_total}</td>
                <td>${numVoluntarios}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyJornadas tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryId.value = j.id_jornada;
                entryFecha.value = j.fecha;
                entryDesc.value = j.descripcion;
                entryBasura.value = j.cantidad_basura_total;
                entryObs.value = j.observaciones;
                entryZona.value = j.id_zona;
                entryVoluntarios.value = j.cantidad_voluntarios !== undefined ? j.cantidad_voluntarios : 0;

                idEditando = j.id_jornada;
                entryId.disabled = true;
            });

            tbodyJornadas.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${jornadas.length} registro(s)`;

    } catch (error) {
        mostrarMensaje("❌ Error al cargar jornadas: " + error.message, "error");
        console.error("Error cargarTabla:", error);
    }
}

// ============================================
// REGISTRAR JORNADA EN LA API (POST)
// ============================================
async function registrarJornada() {
    const id = entryId.value.trim();
    const fecha = entryFecha.value.trim();
    const desc = entryDesc.value.trim();
    const basura = entryBasura.value.trim();
    const obs = entryObs.value.trim();
    const zona = entryZona.value.trim();
    const vols = entryVoluntarios.value.trim();

    const valid = validarCampos(id, fecha, desc, basura, obs, zona, vols);
    if (!valid) return;

    const jornada = {
        id_jornada: id,
        fecha: fecha,
        descripcion: desc,
        cantidad_basura_total: valid.cantidad,
        observaciones: obs,
        id_zona: valid.idZona,
        cantidad_voluntarios: valid.voluntarios
    };

    try {
        const respuesta = await fetch(`${API_URL}/jornadas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jornada)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok || respuesta.status === 201) {
            mostrarMensaje(`✅ Jornada '${id}' registrada.`, "success");
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
// EDITAR JORNADA EN LA API (PUT)
// ============================================
async function editarJornada() {
    if (!idEditando) {
        mostrarMensaje("Seleccione una jornada de la tabla para editar.", "warning");
        return;
    }

    const fecha = entryFecha.value.trim();
    const desc = entryDesc.value.trim();
    const basura = entryBasura.value.trim();
    const obs = entryObs.value.trim();
    const zona = entryZona.value.trim();
    const vols = entryVoluntarios.value.trim();

    const valid = validarCampos(idEditando, fecha, desc, basura, obs, zona, vols);
    if (!valid) return;

    const jornada = {
        id_jornada: idEditando,
        fecha: fecha,
        descripcion: desc,
        cantidad_basura_total: valid.cantidad,
        observaciones: obs,
        id_zona: valid.idZona,
        cantidad_voluntarios: valid.voluntarios
    };

    try {
        const respuesta = await fetch(`${API_URL}/jornadas/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jornada)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Jornada '${idEditando}' actualizada.`, "success");
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
// ELIMINAR JORNADA EN LA API (DELETE)
// ============================================
async function eliminarJornada() {
    if (!idEditando) {
        mostrarMensaje("Seleccione una jornada de la tabla para eliminar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar la jornada con ID '${idEditando}'?`)) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/jornadas/${idEditando}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje("✅ Jornada eliminada.", "success");
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
// VER REPORTE DE JORNADAS DESDE LA API
// ============================================
async function verReporte() {
    try {
        const respuesta = await fetch(`${API_URL}/jornadas/report/jornadas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const jornadas = await respuesta.json();

        let html = `<h2>Reporte de Jornadas</h2>
                    <table border="1" style="border-collapse:collapse;width:100%;font-family:Segoe UI">
                        <thead>
                            <tr style="background:#1F3A52;color:white">
                                <th>ID</th><th>Fecha</th><th>Descripción</th><th>Basura (kg)</th><th>Voluntarios</th><th>Zona</th>
                            </tr>
                        </thead>
                        <tbody>`;

        jornadas.forEach(j => {
            html += `<tr>
                        <td>${j.ID || j.id_jornada}</td>
                        <td>${j.Fecha || j.fecha}</td>
                        <td>${j.Descripcion || j.descripcion}</td>
                        <td>${j["Basura (kg)"] || j.cantidad_basura_total}</td>
                        <td>${j.Voluntarios !== undefined ? j.Voluntarios : (j.cantidad_voluntarios !== undefined ? j.cantidad_voluntarios : 0)}</td>
                        <td>${j.Zona || (j.zona ? j.zona.nombre_zona : 'N/A')}</td>
                     </tr>`;
        });

        html += `</tbody></table>`;

        const win = window.open("", "Reporte", "width=900,height=500");
        win.document.write(`<html><head><title>Reporte Jornadas</title></head>
                            <body style="padding:20px;font-family:Segoe UI;background:#BEEED9">${html}</body></html>`);

    } catch (error) {
        mostrarMensaje("❌ Error al cargar reporte: " + error.message, "error");
        console.error("Error reporte:", error);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
btnRegistrar.addEventListener("click", registrarJornada);
btnEditar.addEventListener("click", editarJornada);
btnLimpiar.addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de jornadas?")) {
        window.location.href = "../index.html";
    }
});
btnBorrar.addEventListener("click", eliminarJornada);
btnReporte.addEventListener("click", verReporte);

// CARGAR AL INICIAR
document.addEventListener("DOMContentLoaded", cargarTabla);