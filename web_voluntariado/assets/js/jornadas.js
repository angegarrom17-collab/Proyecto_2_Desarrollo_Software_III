
const entryId = document.getElementById("entry_id");
const entryFecha = document.getElementById("entry_fecha");
const entryDesc = document.getElementById("entry_descripcion");
const entryBasura = document.getElementById("entry_basura");
const entryObs = document.getElementById("entry_obs");
const entryZona = document.getElementById("entry_zona");
const entryVoluntarios = document.getElementById("entry_voluntarios");
const tbody = document.getElementById("tbodyJornadas");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const STORAGE_KEY = "jornadas_monitoreo";
let idEditando = null;

const datosIniciales = [
    {
        id_jornada: "111",
        fecha: "21-05",
        descripcion: "recoger botellas",
        cantidad_basura_total: 40,
        observaciones: "mucha basura",
        voluntarios: Array(15).fill("Voluntario Inicial")
    }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerJornadas() {
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

function guardarJornadas(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

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

    document.querySelectorAll("#tbodyJornadas tr").forEach(tr => tr.classList.remove("seleccionada"));
}

function validar(id, fecha, desc, basura, obs, zona, vols) {
    if (!id || !fecha || !desc || !basura || !obs || !zona) {
        mostrarMensaje("Complete todos los campos obligatorios.", "warning");
        return false;
    }

    const cantidad = parseInt(basura);
    const voluntarios = parseInt(vols || "0");

    if (isNaN(cantidad) || cantidad <= 0) {
        mostrarMensaje("La basura debe ser un número mayor a cero.", "error");
        return false;
    }

    if (isNaN(voluntarios) || voluntarios < 0) {
        mostrarMensaje("Los voluntarios deben ser un número entero.", "error");
        return false;
    }

    return { cantidad, voluntarios };
}

function cargarTabla() {
    const jornadas = obtenerJornadas();
    tbody.innerHTML = "";

    jornadas.forEach((j) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `<td>${j.id_jornada}</td><td>${j.fecha}</td><td>${j.descripcion}</td><td>${j.cantidad_basura_total}</td><td>${(j.voluntarios || []).length}</td>`;

        tr.addEventListener("click", () => {
            document.querySelectorAll("#tbodyJornadas tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");

            entryId.value = j.id_jornada;
            entryFecha.value = j.fecha;
            entryDesc.value = j.descripcion;
            entryBasura.value = j.cantidad_basura_total;
            entryObs.value = j.observaciones;
            entryZona.value = "";
            entryVoluntarios.value = (j.voluntarios || []).length;

            idEditando = j.id_jornada;
            entryId.disabled = true;
        });

        tbody.appendChild(tr);
    });

    lblFooter.textContent = `Mostrando ${jornadas.length} registro(s)`;
}

function registrar() {
    const id = entryId.value.trim();
    const fecha = entryFecha.value.trim();
    const desc = entryDesc.value.trim();
    const basura = entryBasura.value.trim();
    const obs = entryObs.value.trim();
    const zona = entryZona.value.trim();
    const vols = entryVoluntarios.value.trim();

    const valid = validar(id, fecha, desc, basura, obs, zona, vols);
    if (!valid) return;

    const jornadas = obtenerJornadas();

    if (jornadas.some(j => j.id_jornada === id)) {
        mostrarMensaje(`Ya existe jornada con ID ${id}.`, "error");
        return;
    }

    const voluntariosArr = Array(valid.voluntarios).fill("Voluntario Inicial");

    jornadas.push({
        id_jornada: id,
        fecha,
        descripcion: desc,
        cantidad_basura_total: valid.cantidad,
        observaciones: obs,
        voluntarios: voluntariosArr
    });

    guardarJornadas(jornadas);
    mostrarMensaje(`Jornada '${id}' registrada.`, "success");
    limpiarCampos();
    cargarTabla();
}

function editar() {
    const id = entryId.value.trim();
    const fecha = entryFecha.value.trim();
    const desc = entryDesc.value.trim();
    const basura = entryBasura.value.trim();
    const obs = entryObs.value.trim();
    const zona = entryZona.value.trim();
    const vols = entryVoluntarios.value.trim();

    if (!idEditando) {
        mostrarMensaje("Seleccione una jornada de la tabla para editar.", "warning");
        return;
    }

    const valid = validar(id, fecha, desc, basura, obs, zona, vols);
    if (!valid) return;

    const jornadas = obtenerJornadas();
    const idx = jornadas.findIndex(j => j.id_jornada === idEditando);

    if (idx === -1) {
        mostrarMensaje(`No se encontró jornada con ID ${id}.`, "error");
        return;
    }

    const voluntariosArr = Array(valid.voluntarios).fill("Voluntario Inicial");

    jornadas[idx] = {
        id_jornada: id,
        fecha,
        descripcion: desc,
        cantidad_basura_total: valid.cantidad,
        observaciones: obs,
        voluntarios: voluntariosArr
    };

    guardarJornadas(jornadas);
    mostrarMensaje(`Jornada '${id}' actualizada.`, "success");
    limpiarCampos();
    cargarTabla();
}

function eliminar() {
    const id = entryId.value.trim();

    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar la jornada con ID '${id}'?`)) return;

    const jornadas = obtenerJornadas().filter(j => j.id_jornada !== id);

    guardarJornadas(jornadas);
    mostrarMensaje("Registro eliminado.", "success");
    limpiarCampos();
    cargarTabla();
}

function verReporte() {
    const jornadas = obtenerJornadas();

    let html = `<h2>Reporte de Jornadas</h2>
                <table border="1" style="border-collapse:collapse;width:100%;font-family:Segoe UI">
                    <thead>
                        <tr style="background:#1F3A52;color:white">
                            <th>ID</th><th>Fecha</th><th>Descripción</th><th>Basura (kg)</th><th>Voluntarios</th>
                        </tr>
                    </thead>
                    <tbody>`;

    jornadas.forEach(j => {
        html += `<tr>
                    <td>${j.id_jornada}</td>
                    <td>${j.fecha}</td>
                    <td>${j.descripcion}</td>
                    <td>${j.cantidad_basura_total}</td>
                    <td>${(j.voluntarios || []).length}</td>
                 </tr>`;
    });

    html += `</tbody></table>`;

    const win = window.open("", "Reporte", "width=800,height=500");
    win.document.write(`<html><head><title>Reporte Jornadas</title></head>
                        <body style="padding:20px;font-family:Segoe UI;background:#BEEED9">${html}</body></html>`);
}

// Event Listeners
document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnLimpiar").addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Desea salir?")) window.location.href = "principal.html";
});
document.getElementById("btnBorrar").addEventListener("click", eliminar);
document.getElementById("btnReporte").addEventListener("click", verReporte);

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});