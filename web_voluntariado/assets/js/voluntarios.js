const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryTelefono = document.getElementById("entry_telefono");
const entryEdad = document.getElementById("entry_edad");
const entryCorreo = document.getElementById("entry_correo");
const entryOrganizacion = document.getElementById("entry_organizacion");
const tbody = document.getElementById("tbodyVoluntarios");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const STORAGE_KEY = "voluntarios_monitoreo";
let idEditando = null;

const datosIniciales = [
    { id_voluntario: "11937", nombre: "britney", telefono: "5016", edad: 21, correo: "angelica@gmail", organizacion: "pz" },
    { id_voluntario: "85099", nombre: "daniel rojas", telefono: "61016035", edad: 21, correo: "daniel@ucr.com", organizacion: "UCR" }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerVoluntarios() {
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

function guardarVoluntarios(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function limpiarCampos() {
    entryId.value = "";
    entryNombre.value = "";
    entryTelefono.value = "";
    entryEdad.value = "";
    entryCorreo.value = "";
    entryOrganizacion.value = "";
    
    idEditando = null;
    entryId.disabled = false;
    
    document.querySelectorAll("#tbodyVoluntarios tr").forEach(tr => tr.classList.remove("seleccionada"));
}

function validar(id, nombre, telefono, edad, correo, org) {
    if (!id || !nombre || !telefono || !correo || !org) {
        mostrarMensaje("Complete todos los campos obligatorios.", "warning");
        return false;
    }
    
    const edadNum = parseInt(edad);
    
    if (isNaN(edadNum) || edadNum <= 0) {
        mostrarMensaje("La edad debe ser mayor a cero.", "error");
        return false;
    }
    
    if (edadNum < 18) {
        mostrarMensaje("El voluntario debe ser mayor de 18 años.", "error");
        return false;
    }
    
    if (!correo.includes("@")) {
        mostrarMensaje("El correo no tiene formato válido.", "error");
        return false;
    }
    
    return { edadNum };
}

function cargarTabla() {
    const voluntarios = obtenerVoluntarios();
    tbody.innerHTML = "";
    
    voluntarios.forEach((v) => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `<td>${v.id_voluntario}</td><td>${v.nombre}</td><td>${v.telefono}</td><td>${v.edad}</td><td>${v.correo}</td><td>${v.organizacion}</td>`;
        
        tr.addEventListener("click", () => {
            document.querySelectorAll("#tbodyVoluntarios tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");
            
            entryId.value = v.id_voluntario;
            entryNombre.value = v.nombre;
            entryTelefono.value = v.telefono;
            entryEdad.value = v.edad;
            entryCorreo.value = v.correo;
            entryOrganizacion.value = v.organizacion;
            
            idEditando = v.id_voluntario;
            entryId.disabled = true;
        });
        
        tbody.appendChild(tr);
    });
    
    lblFooter.textContent = `Mostrando ${voluntarios.length} registro(s)`;
}

function registrar() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const telefono = entryTelefono.value.trim();
    const edad = entryEdad.value.trim();
    const correo = entryCorreo.value.trim();
    const org = entryOrganizacion.value.trim();
    
    const valid = validar(id, nombre, telefono, edad, correo, org);
    if (!valid) return;
    
    const voluntarios = obtenerVoluntarios();
    
    if (voluntarios.some(v => v.id_voluntario === id)) {
        mostrarMensaje(`Ya existe un voluntario con ID ${id}.`, "error");
        return;
    }
    
    voluntarios.push({ id_voluntario: id, nombre, telefono, edad: valid.edadNum, correo, organizacion: org });
    
    guardarVoluntarios(voluntarios);
    mostrarMensaje(`Voluntario '${nombre}' registrado.`, "success");
    limpiarCampos();
    cargarTabla();
}

function editar() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const telefono = entryTelefono.value.trim();
    const edad = entryEdad.value.trim();
    const correo = entryCorreo.value.trim();
    const org = entryOrganizacion.value.trim();
    
    if (!idEditando) {
        mostrarMensaje("Seleccione un voluntario de la tabla para editar.", "warning");
        return;
    }
    
    const valid = validar(id, nombre, telefono, edad, correo, org);
    if (!valid) return;
    
    const voluntarios = obtenerVoluntarios();
    const idx = voluntarios.findIndex(v => v.id_voluntario === idEditando);
    
    if (idx === -1) {
        mostrarMensaje(`No se encontró voluntario con ID ${id}.`, "error");
        return;
    }
    
    voluntarios[idx] = { id_voluntario: id, nombre, telefono, edad: valid.edadNum, correo, organizacion: org };
    
    guardarVoluntarios(voluntarios);
    mostrarMensaje(`Voluntario '${nombre}' actualizado.`, "success");
    limpiarCampos();
    cargarTabla();
}

function eliminar() {
    const id = entryId.value.trim();
    
    if (!id) {
        mostrarMensaje("Ingrese un ID para eliminar.", "warning");
        return;
    }
    
    if (!confirm(`¿Eliminar al voluntario con ID '${id}'?`)) return;
    
    const voluntarios = obtenerVoluntarios().filter(v => v.id_voluntario !== id);
    
    guardarVoluntarios(voluntarios);
    mostrarMensaje("Registro eliminado.", "success");
    limpiarCampos();
    cargarTabla();
}

document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnEliminar").addEventListener("click", eliminar);
document.getElementById("btnLimpiar").addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Desea salir?")) window.location.href = "principal.html";
});

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});