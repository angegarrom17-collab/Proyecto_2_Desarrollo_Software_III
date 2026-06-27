const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryUbicacion = document.getElementById("entry_ubicacion");
const entryNivel = document.getElementById("entry_nivel");
const entryDescripcion = document.getElementById("entry_descripcion");
const tbody = document.getElementById("tbodyZonas");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const STORAGE_KEY = "zonas_monitoreo";
let idEditando = null;

const datosIniciales = [
    { id_zona: 1, nombre_zona: "playa", ubicacion: "pz", nivel_contaminacion: "medio", descripcion: "mucha basura" },
    { id_zona: 3, nombre_zona: "oceano", ubicacion: "puntarenas", nivel_contaminacion: "alto", descripcion: "sucia" }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerZonas() {
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

function guardarZonas(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
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

function validar(id, nombre, ubicacion, nivel) {
    if (!id || !nombre || !ubicacion || !nivel) {
        mostrarMensaje("Complete todos los campos obligatorios.", "warning");
        return false;
    }
    
    const idNum = parseInt(id);
    
    if (isNaN(idNum)) {
        mostrarMensaje("El ID debe ser un número entero.", "error");
        return false;
    }
    
    const niveles = ["bajo", "medio", "alto", "critico"];
    
    if (!niveles.includes(nivel.toLowerCase())) {
        mostrarMensaje(`Nivel inválido. Use: ${niveles.join(", ")}`, "error");
        return false;
    }
    
    return { idNum };
}

function cargarTabla() {
    const zonas = obtenerZonas();
    tbody.innerHTML = "";
    
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
}

function registrar() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const ubicacion = entryUbicacion.value.trim();
    const nivel = entryNivel.value.trim().toLowerCase();
    const desc = entryDescripcion.value.trim();
    
    const valid = validar(id, nombre, ubicacion, nivel);
    if (!valid) return;
    
    const zonas = obtenerZonas();
    
    if (zonas.some(z => z.id_zona === valid.idNum)) {
        mostrarMensaje(`Ya existe una zona con ID ${valid.idNum}.`, "error");
        return;
    }
    
    zonas.push({ 
        id_zona: valid.idNum, 
        nombre_zona: nombre, 
        ubicacion, 
        nivel_contaminacion: nivel, 
        descripcion: desc 
    });
    
    guardarZonas(zonas);
    mostrarMensaje(`Zona '${nombre}' registrada correctamente.`, "success");
    limpiarCampos();
    cargarTabla();
}

function editar() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const ubicacion = entryUbicacion.value.trim();
    const nivel = entryNivel.value.trim().toLowerCase();
    const desc = entryDescripcion.value.trim();
    
    if (!idEditando) {
        mostrarMensaje("Seleccione una zona de la tabla para editar.", "warning");
        return;
    }
    
    const valid = validar(id, nombre, ubicacion, nivel);
    if (!valid) return;
    
    const zonas = obtenerZonas();
    const idx = zonas.findIndex(z => z.id_zona === idEditando);
    
    if (idx === -1) {
        mostrarMensaje(`No existe zona con ID ${valid.idNum}.`, "error");
        return;
    }
    
    zonas[idx] = { 
        id_zona: valid.idNum, 
        nombre_zona: nombre, 
        ubicacion, 
        nivel_contaminacion: nivel, 
        descripcion: desc 
    };
    
    guardarZonas(zonas);
    mostrarMensaje(`Zona '${nombre}' actualizada correctamente.`, "success");
    limpiarCampos();
    cargarTabla();
}

function eliminar() {
    const id = entryId.value.trim();
    
    if (!id) {
        mostrarMensaje("Ingrese un ID para borrar.", "warning");
        return;
    }
    
    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) return;
    
    const zonas = obtenerZonas().filter(z => String(z.id_zona) !== id);
    
    guardarZonas(zonas);
    mostrarMensaje("Registro eliminado.", "success");
    limpiarCampos();
    cargarTabla();
}

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

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});