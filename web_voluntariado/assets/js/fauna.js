
const entryId = document.getElementById("entry_id");
const entryEspecie = document.getElementById("entry_especie");
const entryEstado = document.getElementById("entry_estado");
const entryDescripcion = document.getElementById("entry_descripcion");
const tbody = document.getElementById("tbodyFauna");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const STORAGE_KEY = "fauna_monitoreo";
let idEditando = null;

const datosIniciales = [
    { idAnimal: "45", especie: "tortu", estado: "herido", descripcion: "pata mala" },
    { idAnimal: "22", especie: "pez", estado: "herido", descripcion: "Sin aleta" }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerAnimales() {
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

function guardarAnimales(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
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
        mostrarMensaje("Complete los campos obligatorios: ID, Especie y Estado.", "warning");
        return false;
    }

    const estadoNorm = estado.trim().toLowerCase();

    if (!["vivo", "herido", "muerto"].includes(estadoNorm)) {
        mostrarMensaje("El estado debe ser: vivo, herido o muerto.", "error");
        return false;
    }

    return { estadoNorm };
}

function cargarTabla() {
    const animales = obtenerAnimales();
    tbody.innerHTML = "";

    animales.forEach((a) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `<td>${a.idAnimal}</td><td>${a.especie}</td><td>${a.estado}</td><td>${a.descripcion}</td>`;

        tr.addEventListener("click", () => {
            document.querySelectorAll("#tbodyFauna tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");

            entryId.value = a.idAnimal;
            entryEspecie.value = a.especie;
            entryEstado.value = a.estado;
            entryDescripcion.value = a.descripcion;

            idEditando = a.idAnimal;
            entryId.disabled = true;
        });

        tbody.appendChild(tr);
    });

    lblFooter.textContent = `Mostrando ${animales.length} animal(es) registrado(s)`;
}

function registrar() {
    const id = entryId.value.trim();
    const especie = entryEspecie.value.trim();
    const estado = entryEstado.value.trim();
    const desc = entryDescripcion.value.trim();

    const valid = validar(id, especie, estado);
    if (!valid) return;

    const animales = obtenerAnimales();

    if (animales.some(a => a.idAnimal === id)) {
        mostrarMensaje(`Ya existe un animal con ID ${id}.`, "error");
        return;
    }

    animales.push({ idAnimal: id, especie, estado: valid.estadoNorm, descripcion: desc });

    guardarAnimales(animales);
    mostrarMensaje(`Animal '${especie}' registrado correctamente.`, "success");
    limpiarCampos();
    cargarTabla();
}

function editar() {
    const id = entryId.value.trim();
    const especie = entryEspecie.value.trim();
    const estado = entryEstado.value.trim();
    const desc = entryDescripcion.value.trim();

    if (!idEditando) {
        mostrarMensaje("Seleccione un animal de la tabla para editar.", "warning");
        return;
    }

    const valid = validar(id, especie, estado);
    if (!valid) return;

    const animales = obtenerAnimales();
    const idx = animales.findIndex(a => a.idAnimal === idEditando);

    if (idx === -1) {
        mostrarMensaje(`No existe animal con ID ${id}.`, "error");
        return;
    }

    animales[idx] = { idAnimal: id, especie, estado: valid.estadoNorm, descripcion: desc };

    guardarAnimales(animales);
    mostrarMensaje(`Animal '${especie}' actualizado correctamente.`, "success");
    limpiarCampos();
    cargarTabla();
}

function buscar() {
    const id = entryId.value.trim();

    if (!id) {
        mostrarMensaje("Ingrese un ID para buscar.", "warning");
        return;
    }

    const animales = obtenerAnimales();
    const animal = animales.find(a => a.idAnimal === id);

    if (animal) {
        entryEspecie.value = animal.especie;
        entryEstado.value = animal.estado;
        entryDescripcion.value = animal.descripcion;
        mostrarMensaje("Animal encontrado.", "success");
    } else {
        mostrarMensaje(`No se encontró animal con ID '${id}'.`, "warning");
    }
}

function eliminar() {
    const id = entryId.value.trim();

    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) return;

    const animales = obtenerAnimales().filter(a => a.idAnimal !== id);

    guardarAnimales(animales);
    mostrarMensaje("Registro eliminado.", "success");
    limpiarCampos();
    cargarTabla();
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
    if (confirm("¿Desea salir?")) window.location.href = "principal.html";
});
document.getElementById("btnBorrar").addEventListener("click", eliminar);

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});