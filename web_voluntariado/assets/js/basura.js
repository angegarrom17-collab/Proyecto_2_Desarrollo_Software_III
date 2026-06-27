
const entryTipo = document.getElementById("entry_tipo");
const entryPeso = document.getElementById("entry_peso");
const entryFecha = document.getElementById("entry_fecha");
const tbody = document.getElementById("tbodyBasura");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const STORAGE_KEY = "basura_monitoreo";
let idEditando = null;

const datosIniciales = [
    { idBasura: "c955f143", tipoResiduo: "vidrio", pesoKilos: 40.0, fecha: "31-05" },
    { idBasura: "9423d892", tipoResiduo: "plastico", pesoKilos: 80.0, fecha: "21-07" },
    { idBasura: "0742d4f3", tipoResiduo: "red", pesoKilos: 15.0, fecha: "25-12" }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerBasura() {
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

function guardarBasura(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function generarId() {
    return Math.random().toString(36).substring(2, 10);
}

function limpiarCampos() {
    entryTipo.value = "";
    entryPeso.value = "";
    entryFecha.value = "";
    idEditando = null;

    document.querySelectorAll("#tbodyBasura tr").forEach(tr => tr.classList.remove("seleccionada"));
}

function validar(tipo, peso, fecha) {
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

function cargarTabla() {
    const basura = obtenerBasura();
    tbody.innerHTML = "";

    basura.forEach((b) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `<td>${b.idBasura}</td><td>${b.tipoResiduo}</td><td>${b.pesoKilos}</td><td>${b.fecha}</td>`;

        tr.addEventListener("click", () => {
            document.querySelectorAll("#tbodyBasura tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");

            entryTipo.value = b.tipoResiduo;
            entryPeso.value = b.pesoKilos;
            entryFecha.value = b.fecha;
            idEditando = b.idBasura;
        });

        tbody.appendChild(tr);
    });

    lblFooter.textContent = `Mostrando ${basura.length} registro(s)`;
}

function registrar() {
    const tipo = entryTipo.value.trim();
    const peso = entryPeso.value.trim();
    const fecha = entryFecha.value.trim();

    const valid = validar(tipo, peso, fecha);
    if (!valid) return;

    const basura = obtenerBasura();
    const id = generarId();

    basura.push({ idBasura: id, tipoResiduo: tipo, pesoKilos: valid.pesoNum, fecha });

    guardarBasura(basura);
    mostrarMensaje(`Residuo '${tipo}' registrado (${valid.pesoNum} kg).`, "success");
    limpiarCampos();
    cargarTabla();
}

function editar() {
    const tipo = entryTipo.value.trim();
    const peso = entryPeso.value.trim();
    const fecha = entryFecha.value.trim();

    if (!idEditando) {
        mostrarMensaje("Seleccione un registro de la tabla para editar.", "warning");
        return;
    }

    const valid = validar(tipo, peso, fecha);
    if (!valid) return;

    const basura = obtenerBasura();
    const idx = basura.findIndex(b => b.idBasura === idEditando);

    if (idx === -1) {
        mostrarMensaje("Registro no encontrado.", "error");
        return;
    }

    basura[idx] = { idBasura: idEditando, tipoResiduo: tipo, pesoKilos: valid.pesoNum, fecha };

    guardarBasura(basura);
    mostrarMensaje(`Residuo '${tipo}' actualizado.`, "success");
    limpiarCampos();
    cargarTabla();
}

// Event Listeners
document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnLimpiar").addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Desea salir?")) window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});