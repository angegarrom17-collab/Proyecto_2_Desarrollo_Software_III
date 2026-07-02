
const API_URL = 'http://127.0.0.1:8000';


const entryTipo = document.getElementById("entry_tipo");
const entryPeso = document.getElementById("entry_peso");
const entryFecha = document.getElementById("entry_fecha");
const tbodyBasura = document.getElementById("tbodyBasura");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnEditar = document.getElementById("btnEditar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnSalir = document.getElementById("btnSalir");
const btnBorrar = document.getElementById("btnBorrar");

let idEditando = null;


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


function limpiarCampos() {
    entryTipo.value = "";
    entryPeso.value = "";
    entryFecha.value = "";
    idEditando = null;

    document.querySelectorAll("#tbodyBasura tr").forEach(tr => {
        tr.classList.remove("seleccionada");
    });
}


function validarCampos(tipo, peso, fecha) {
    if (!tipo || !peso || !fecha) {
        mostrarMensaje("Complete todos los campos.", "warning");
        return false;
    }

    const pesoNum = parseFloat(peso);
    if (isNaN(pesoNum) || pesoNum < 0) {
        mostrarMensaje("El peso debe ser un número válido no negativo.", "error");
        return false;
    }

    return { pesoNum };
}


async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/basura/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const basura = await respuesta.json();
        tbodyBasura.innerHTML = "";

        if (!Array.isArray(basura) || basura.length === 0) {
            lblFooter.textContent = "Mostrando 0 registro(s)";
            return;
        }

        basura.forEach((b) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${b.idBasura}</td>
                <td>${b.tipoResiduo}</td>
                <td>${b.pesoKilos}</td>
                <td>${b.fecha}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyBasura tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryTipo.value = b.tipoResiduo;
                entryPeso.value = b.pesoKilos;
                entryFecha.value = b.fecha;

                idEditando = b.idBasura;
            });

            tbodyBasura.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${basura.length} registro(s)`;

    } catch (error) {
        mostrarMensaje("❌ Error al cargar basura: " + error.message, "error");
        console.error("Error cargarTabla:", error);
    }
}


async function registrarBasura() {
    const tipo = entryTipo.value.trim();
    const peso = entryPeso.value.trim();
    const fecha = entryFecha.value.trim();

    const valid = validarCampos(tipo, peso, fecha);
    if (!valid) return;

    const basura = {
        tipoResiduo: tipo,
        pesoKilos: valid.pesoNum,
        fecha: fecha
    };

    try {
        const respuesta = await fetch(`${API_URL}/basura/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(basura)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok || respuesta.status === 201) {
            mostrarMensaje(`✅ Residuo '${tipo}' registrado (${valid.pesoNum} kg).`, "success");
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


async function editarBasura() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un registro de la tabla para editar.", "warning");
        return;
    }

    const tipo = entryTipo.value.trim();
    const peso = entryPeso.value.trim();
    const fecha = entryFecha.value.trim();

    const valid = validarCampos(tipo, peso, fecha);
    if (!valid) return;

    const basura = {
        tipoResiduo: tipo,
        pesoKilos: valid.pesoNum,
        fecha: fecha
    };

    try {
        const respuesta = await fetch(`${API_URL}/basura/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(basura)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Residuo '${tipo}' actualizado.`, "success");
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


async function eliminarBasura() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un registro de la tabla para eliminar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el registro con ID '${idEditando}'?`)) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/basura/${idEditando}`, {
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


btnRegistrar.addEventListener("click", registrarBasura);
btnEditar.addEventListener("click", editarBasura);
btnLimpiar.addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de basura?")) {
        window.location.href = "../index.html";
    }
});

if (btnBorrar) {
    btnBorrar.addEventListener("click", eliminarBasura);
}


document.addEventListener("DOMContentLoaded", cargarTabla);