const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryUnidad = document.getElementById("entry_unidad");
const entryCantidad = document.getElementById("entry_cantidad");
const tbody = document.getElementById("tbodyMateriales");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const STORAGE_KEY = "materiales_monitoreo";
let idEditando = null;

const datosIniciales = [
    { 
        idMaterial: "2", 
        nombre: "vidrio", 
        unidadMedida: "p", 
        cantidadDisponible: 25 
    }
];

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto; 
    messageBox.className = `message-box ${tipo}`;
    
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerMateriales() {
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

function guardarMateriales(lista) { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista)); 
}

function limpiarCampos() {
    entryId.value = ""; 
    entryNombre.value = ""; 
    entryUnidad.value = ""; 
    entryCantidad.value = "";
    
    idEditando = null; 
    entryId.disabled = false;
    
    document.querySelectorAll("#tbodyMateriales tr").forEach(tr => tr.classList.remove("seleccionada"));
}

function validar(id, nombre, unidad, cantidad) {
    if (!id || !nombre || !unidad || !cantidad) { 
        mostrarMensaje("Complete todos los campos.", "warning"); 
        return false; 
    }
    
    const cant = parseInt(cantidad);
    
    if (isNaN(cant) || cant < 0) { 
        mostrarMensaje("La cantidad debe ser un número entero no negativo.", "error"); 
        return false; 
    }
    
    return { cant };
}

function cargarTabla() {
    const materiales = obtenerMateriales();
    tbody.innerHTML = "";
    
    materiales.forEach((m) => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `<td>${m.idMaterial}</td><td>${m.nombre}</td><td>${m.unidadMedida}</td><td>${m.cantidadDisponible}</td>`;
        
        tr.addEventListener("click", () => {
            document.querySelectorAll("#tbodyMateriales tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");
            
            entryId.value = m.idMaterial; 
            entryNombre.value = m.nombre; 
            entryUnidad.value = m.unidadMedida; 
            entryCantidad.value = m.cantidadDisponible;
            
            idEditando = m.idMaterial; 
            entryId.disabled = true;
        });
        
        tbody.appendChild(tr);
    });
    
    lblFooter.textContent = `Mostrando ${materiales.length} material(es) en inventario`;
}

function registrar() {
    const id = entryId.value.trim(); 
    const nombre = entryNombre.value.trim(); 
    const unidad = entryUnidad.value.trim(); 
    const cantidad = entryCantidad.value.trim();
    
    const valid = validar(id, nombre, unidad, cantidad);
    if (!valid) return;
    
    const materiales = obtenerMateriales();
    
    if (materiales.some(m => m.idMaterial === id)) { 
        mostrarMensaje(`Ya existe un material con ID ${id}.`, "error"); 
        return; 
    }
    
    materiales.push({ 
        idMaterial: id, 
        nombre, 
        unidadMedida: unidad, 
        cantidadDisponible: valid.cant 
    });
    
    guardarMateriales(materiales);
    mostrarMensaje(`Material '${nombre}' registrado.`, "success"); 
    limpiarCampos(); 
    cargarTabla();
}

function editar() {
    const id = entryId.value.trim(); 
    const nombre = entryNombre.value.trim(); 
    const unidad = entryUnidad.value.trim(); 
    const cantidad = entryCantidad.value.trim();
    
    if (!idEditando) { 
        mostrarMensaje("Seleccione un material de la tabla para editar.", "warning"); 
        return; 
    }
    
    const valid = validar(id, nombre, unidad, cantidad);
    if (!valid) return;
    
    const materiales = obtenerMateriales();
    const idx = materiales.findIndex(m => m.idMaterial === idEditando);
    
    if (idx === -1) { 
        mostrarMensaje(`No existe material con ID ${id}.`, "error"); 
        return; 
    }
    
    materiales[idx] = { 
        idMaterial: id, 
        nombre, 
        unidadMedida: unidad, 
        cantidadDisponible: valid.cant 
    };
    
    guardarMateriales(materiales);
    mostrarMensaje(`Material '${nombre}' actualizado.`, "success"); 
    limpiarCampos(); 
    cargarTabla();
}

function usarMaterial() {
    const id = entryId.value.trim(); 
    const cantidad = entryCantidad.value.trim();
    
    if (!id || !cantidad) { 
        mostrarMensaje("Ingrese ID y cantidad a usar.", "warning"); 
        return; 
    }
    
    const cant = parseInt(cantidad);
    
    if (isNaN(cant) || cant <= 0) { 
        mostrarMensaje("La cantidad debe ser un número entero positivo.", "error"); 
        return; 
    }
    
    const materiales = obtenerMateriales();
    const idx = materiales.findIndex(m => m.idMaterial === id);
    
    if (idx === -1) { 
        mostrarMensaje("Material no encontrado.", "error"); 
        return; 
    }
    
    if (materiales[idx].cantidadDisponible < cant) { 
        mostrarMensaje("No hay suficiente stock.", "error"); 
        return; 
    }
    
    materiales[idx].cantidadDisponible -= cant;
    
    guardarMateriales(materiales);
    mostrarMensaje(`Se usaron ${cant} unidades del material '${id}'.`, "success"); 
    cargarTabla();
}

function eliminar() {
    const id = entryId.value.trim();
    
    if (!id) { 
        mostrarMensaje("Ingrese un ID para borrar.", "warning"); 
        return; 
    }
    
    if (!confirm(`¿Está seguro de eliminar el registro con ID '${id}'?`)) return;
    
    const materiales = obtenerMateriales().filter(m => m.idMaterial !== id);
    
    guardarMateriales(materiales);
    mostrarMensaje("Registro eliminado.", "success"); 
    limpiarCampos(); 
    cargarTabla();
}

document.getElementById("btnRegistrar").addEventListener("click", registrar);
document.getElementById("btnEditar").addEventListener("click", editar);
document.getElementById("btnUsar").addEventListener("click", usarMaterial);
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