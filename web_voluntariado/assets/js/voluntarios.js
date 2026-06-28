// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
const API_URL = 'http://127.0.0.1:8000';

// ============================================
// REFERENCIAS AL DOM
// ============================================
const entryId = document.getElementById("entry_id");
const entryNombre = document.getElementById("entry_nombre");
const entryTelefono = document.getElementById("entry_telefono");
const entryEdad = document.getElementById("entry_edad");
const entryCorreo = document.getElementById("entry_correo");
const entryOrganizacion = document.getElementById("entry_organizacion");
const tbodyVoluntarios = document.getElementById("tbodyVoluntarios");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");
const searchId = document.getElementById("searchId");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnSalir = document.getElementById("btnSalir");
const btnFiltros = document.getElementById("btnFiltros");

let idEditando = null;

// ============================================
// MENSAJES
// ============================================
function mostrarMensaje(texto, tipo = "success") {
    if (typeof texto !== 'string') texto = JSON.stringify(texto);
    messageBox.textContent = texto;
    messageBox.className = `message-box ${tipo}`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 4000);
}

// ============================================
// EXTRAER MENSAJE DE ERROR
// ============================================
function extraerMensajeError(datos) {
    if (!datos) return 'Error desconocido';
    if (typeof datos.detail === 'string') return datos.detail;
    if (Array.isArray(datos.detail)) {
        return datos.detail.map(e => e.msg || JSON.stringify(e)).join('; ');
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
    entryTelefono.value = "";
    entryEdad.value = "";
    entryCorreo.value = "";
    entryOrganizacion.value = "";
    idEditando = null;
    entryId.disabled = false;

    document.querySelectorAll("#tbodyVoluntarios tr").forEach(tr => {
        tr.classList.remove("seleccionada");
    });
}

// ============================================
// VALIDAR CAMPOS REGISTRO
// ============================================
function validarCamposRegistro(id, nombre, telefono, edad, correo, organizacion) {
    if (!id || !nombre || !telefono || !edad || !correo || !organizacion) {
        mostrarMensaje("Complete todos los campos.", "warning");
        return false;
    }

    if (!/^\d+$/.test(id)) {
        mostrarMensaje("El ID debe ser numérico.", "error");
        return false;
    }

    if (!correo.includes("@")) {
        mostrarMensaje("El correo no tiene formato válido.", "error");
        return false;
    }

    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 18) {
        mostrarMensaje("La edad debe ser mayor o igual a 18.", "error");
        return false;
    }

    return true;
}

// ============================================
// VALIDAR CAMPOS EDICIÓN
// ============================================
function validarCamposEdicion(nombre, telefono, edad, correo, organizacion) {
    if (!nombre || !telefono || !edad || !correo || !organizacion) {
        mostrarMensaje("Complete todos los campos.", "warning");
        return false;
    }

    if (!correo.includes("@")) {
        mostrarMensaje("El correo no tiene formato válido.", "error");
        return false;
    }

    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 18) {
        mostrarMensaje("La edad debe ser mayor o igual a 18.", "error");
        return false;
    }

    return true;
}

// ============================================
// CARGAR VOLUNTARIOS (GET)
// ============================================
async function cargarTabla() {
    try {
        const respuesta = await fetch(`${API_URL}/voluntarios/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const voluntarios = await respuesta.json();
        tbodyVoluntarios.innerHTML = "";

        if (!Array.isArray(voluntarios) || voluntarios.length === 0) {
            lblFooter.textContent = "Mostrando 0 registro(s)";
            return;
        }

        voluntarios.forEach((v) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.id}</td>
                <td>${v.nombre}</td>
                <td>${v.telefono}</td>
                <td>${v.edad}</td>
                <td>${v.correo || v.email}</td>
                <td>${v.organizacion || v.institucion}</td>
                <td>
                    <div class="acciones">
                        <button class="btn-ver" title="Ver" onclick="event.stopPropagation(); verVoluntario('${v.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-editar-row" title="Editar" onclick="event.stopPropagation(); cargarVoluntarioEnFormulario('${v.id}')">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn-eliminar-row" title="Eliminar" onclick="event.stopPropagation(); eliminarVoluntario('${v.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#tbodyVoluntarios tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");
                cargarVoluntarioEnFormulario(v.id);
            });

            tbodyVoluntarios.appendChild(tr);
        });

        lblFooter.textContent = `Mostrando ${voluntarios.length} registro(s)`;

    } catch (error) {
        mostrarMensaje("❌ Error al cargar voluntarios: " + error.message, "error");
        console.error("Error cargarTabla:", error);
    }
}

// ============================================
// CARGAR VOLUNTARIO EN FORMULARIO (para editar)
// ============================================
function cargarVoluntarioEnFormulario(id) {
    // Buscar en la tabla el voluntario y cargar sus datos
    // En una implementación real, harías un GET /voluntarios/{id}
    // Por ahora, buscamos en las filas visibles
    const filas = document.querySelectorAll("#tbodyVoluntarios tr");
    filas.forEach(tr => {
        if (tr.cells[0].textContent === id) {
            document.querySelectorAll("#tbodyVoluntarios tr").forEach(r => r.classList.remove("seleccionada"));
            tr.classList.add("seleccionada");

            entryId.value = tr.cells[0].textContent;
            entryNombre.value = tr.cells[1].textContent;
            entryTelefono.value = tr.cells[2].textContent;
            entryEdad.value = tr.cells[3].textContent;
            entryCorreo.value = tr.cells[4].textContent;
            entryOrganizacion.value = tr.cells[5].textContent;

            idEditando = tr.cells[0].textContent;
            entryId.disabled = true;
        }
    });
}

// ============================================
// VER VOLUNTARIO (placeholder)
// ============================================
function verVoluntario(id) {
    mostrarMensaje(`👁️ Ver detalle del voluntario ID: ${id}`, "success");
}

// ============================================
// REGISTRAR VOLUNTARIO (POST)
// ============================================
async function registrarVoluntario() {
    const id = entryId.value.trim();
    const nombre = entryNombre.value.trim();
    const telefono = entryTelefono.value.trim();
    const edad = entryEdad.value.trim();
    const correo = entryCorreo.value.trim();
    const organizacion = entryOrganizacion.value.trim();

    if (!validarCamposRegistro(id, nombre, telefono, edad, correo, organizacion)) return;

    const voluntario = {
        id: id,
        nombre: nombre,
        telefono: telefono,
        edad: parseInt(edad),
        email: correo,
        organizacion: organizacion
    };

    try {
        const respuesta = await fetch(`${API_URL}/voluntarios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(voluntario)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok || respuesta.status === 201) {
            mostrarMensaje(`✅ Voluntario '${nombre}' registrado correctamente.`, "success");
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
// EDITAR VOLUNTARIO (PUT)
// ============================================
async function editarVoluntario() {
    if (!idEditando) {
        mostrarMensaje("Seleccione un voluntario de la tabla para editar.", "warning");
        return;
    }

    const nombre = entryNombre.value.trim();
    const telefono = entryTelefono.value.trim();
    const edad = entryEdad.value.trim();
    const correo = entryCorreo.value.trim();
    const organizacion = entryOrganizacion.value.trim();

    if (!validarCamposEdicion(nombre, telefono, edad, correo, organizacion)) return;

    const voluntario = {
        nombre: nombre,
        telefono: telefono,
        edad: parseInt(edad),
        email: correo,
        organizacion: organizacion
    };

    try {
        const respuesta = await fetch(`${API_URL}/voluntarios/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(voluntario)
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje(`✅ Voluntario actualizado correctamente.`, "success");
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
// ELIMINAR VOLUNTARIO (DELETE)
// ============================================
async function eliminarVoluntario(id) {
    const idEliminar = id || entryId.value.trim();

    if (!idEliminar) {
        mostrarMensaje("Ingrese un ID para eliminar.", "warning");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el voluntario con ID '${idEliminar}'?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/voluntarios/${idEliminar}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        let datos = {};
        const textoRespuesta = await respuesta.text();
        if (textoRespuesta) {
            try { datos = JSON.parse(textoRespuesta); } catch (e) { datos = { raw: textoRespuesta }; }
        }

        if (respuesta.ok) {
            mostrarMensaje("✅ Voluntario eliminado.", "success");
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
// BUSCAR POR ID
// ============================================
function buscarPorId() {
    const idBuscar = searchId.value.trim();
    if (!idBuscar) {
        cargarTabla();
        return;
    }

    const filas = document.querySelectorAll("#tbodyVoluntarios tr");
    let encontrado = false;

    filas.forEach(tr => {
        if (tr.cells[0].textContent === idBuscar) {
            tr.style.display = "";
            encontrado = true;
        } else {
            tr.style.display = "none";
        }
    });

    if (encontrado) {
        lblFooter.textContent = `Mostrando 1 registro(s)`;
    } else {
        lblFooter.textContent = `No se encontraron registros`;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
btnRegistrar.addEventListener("click", registrarVoluntario);
btnEditar.addEventListener("click", editarVoluntario);
btnEliminar.addEventListener("click", () => eliminarVoluntario());
btnLimpiar.addEventListener("click", () => {
    limpiarCampos();
    mostrarMensaje("Campos limpiados.", "success");
});
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de voluntarios?")) {
        window.location.href = "../index.html";
    }
});
btnFiltros.addEventListener("click", () => {
    mostrarMensaje("🚧 Filtros aún no implementados.", "warning");
});

searchId.addEventListener("input", buscarPorId);

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            idEditando ? editarVoluntario() : registrarVoluntario();
        }
    });
});

// ============================================
// CARGAR AL INICIAR
// ============================================
document.addEventListener("DOMContentLoaded", cargarTabla);