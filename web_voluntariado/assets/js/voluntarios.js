const API_URL = "http://127.0.0.1:8000/voluntarios/";

const tableBody = document.getElementById("voluntariosTable");
const messageBox = document.getElementById("messageBox");
const errorAlert = document.getElementById("errorAlert");
const errorText = document.getElementById("errorText");
const contador = document.getElementById("contador");

const entryId = document.getElementById("id");
const entryNombre = document.getElementById("nombre");
const entryTelefono = document.getElementById("telefono");
const entryEdad = document.getElementById("edad");
const entryEmail = document.getElementById("email");
const entryOrganizacion = document.getElementById("organizacion");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnSalir = document.getElementById("btnSalir");
const btnBuscar = document.getElementById("btnBuscar");

let idEditando = null;

function showMessage(text, type = "success") {
    messageBox.textContent = text;
    messageBox.classList.remove("hidden");
    messageBox.style.background = type === "success" ? "#5cb85c" : "#d9534f";
    messageBox.style.color = "white";
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function showError(text) {
    errorText.textContent = text;
    errorAlert.classList.remove("hidden");
    setTimeout(() => {
        errorAlert.classList.add("hidden");
    }, 5000);
}

function limpiarFormulario() {
    entryId.value = "";
    entryNombre.value = "";
    entryTelefono.value = "";
    entryEdad.value = "";
    entryEmail.value = "";
    entryOrganizacion.value = "";
    idEditando = null;
    entryId.disabled = false;
    document.querySelectorAll("#voluntariosTable tr").forEach(tr => tr.classList.remove("seleccionada"));
    showMessage("Formulario limpiado");
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    return /^[0-9]{8,15}$/.test(telefono);
}

function validarCampos(data) {
    if (!data.id || !data.nombre || !data.telefono || !data.edad || !data.email || !data.organizacion) {
        showMessage("Todos los campos son obligatorios", "error");
        return false;
    }
    if (isNaN(parseInt(data.id)) || parseInt(data.id) <= 0) {
        showMessage("El ID debe ser un numero mayor a 0", "error");
        return false;
    }
    if (parseInt(data.edad) < 18) {
        showMessage("La edad debe ser mayor o igual a 18", "error");
        return false;
    }
    if (!validarEmail(data.email)) {
        showMessage("Ingrese un correo electronico valido", "error");
        return false;
    }
    if (!validarTelefono(data.telefono)) {
        showMessage("El telefono debe contener solo numeros (8-15 digitos)", "error");
        return false;
    }
    return true;
}

async function cargarVoluntarios() {
    errorAlert.classList.add("hidden");
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al consultar la API");
        const data = await res.json();

        tableBody.innerHTML = "";
        data.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.id}</td>
                <td>${v.nombre}</td>
                <td>${v.telefono}</td>
                <td>${v.edad}</td>
                <td>${v.email}</td>
                <td>${v.organizacion}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll("#voluntariosTable tr").forEach(r => r.classList.remove("seleccionada"));
                tr.classList.add("seleccionada");

                entryId.value = v.id;
                entryNombre.value = v.nombre;
                entryTelefono.value = v.telefono;
                entryEdad.value = v.edad;
                entryEmail.value = v.email;
                entryOrganizacion.value = v.organizacion;

                idEditando = v.id;
                entryId.disabled = true;
            });

            tableBody.appendChild(tr);
        });
        contador.textContent = data.length;
        return data;
    } catch (error) {
        console.error(error);
        showError("Error al cargar voluntarios: " + error.message);
        return [];
    }
}

async function buscarVoluntario() {
    const id = entryId.value.trim();
    if (!id) {
        showMessage("Ingrese el ID en el campo de arriba para buscar", "error");
        return;
    }
    if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
        showMessage("El ID debe ser un numero valido", "error");
        return;
    }
    try {
        const res = await fetch(API_URL + id);
        if (!res.ok) throw new Error("No encontrado");
        const v = await res.json();
        entryId.value = v.id;
        entryNombre.value = v.nombre;
        entryTelefono.value = v.telefono;
        entryEdad.value = v.edad;
        entryEmail.value = v.email;
        entryOrganizacion.value = v.organizacion;
        idEditando = v.id;
        entryId.disabled = true;
        showMessage("Voluntario cargado en el formulario");
    } catch (error) {
        showError("Voluntario no encontrado");
    }
}

async function registrarVoluntario() {
    const data = {
        id: entryId.value.trim(),
        nombre: entryNombre.value.trim(),
        telefono: entryTelefono.value.trim(),
        edad: entryEdad.value.trim(),
        email: entryEmail.value.trim(),
        organizacion: entryOrganizacion.value.trim()
    };

    if (!validarCampos(data)) return;

    try {
        const checkRes = await fetch(API_URL + data.id);
        if (checkRes.ok) {
            showMessage("Ya existe un voluntario con ese ID. Use otro ID o use Editar.", "error");
            return;
        }
    } catch (e) { /* ignorar error 404 */ }

    const payload = {
        id: parseInt(data.id),
        nombre: data.nombre,
        telefono: data.telefono,
        edad: parseInt(data.edad),
        email: data.email,
        organizacion: data.organizacion
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            showMessage("Voluntario registrado correctamente");
            limpiarFormulario();
            cargarVoluntarios();
        } else {
            const err = await res.json();
            showMessage("Error al registrar: " + (err.detail || "Error del servidor"), "error");
        }
    } catch (error) {
        showMessage("Error de conexion. Asegurese de que el servidor este corriendo en http://127.0.0.1:8000", "error");
    }
}

async function editarVoluntario() {
    if (!idEditando) {
        showMessage("Seleccione un voluntario de la tabla para editar.", "error");
        return;
    }

    const data = {
        id: entryId.value.trim(),
        nombre: entryNombre.value.trim(),
        telefono: entryTelefono.value.trim(),
        edad: entryEdad.value.trim(),
        email: entryEmail.value.trim(),
        organizacion: entryOrganizacion.value.trim()
    };

    if (!validarCampos(data)) return;

    const id = parseInt(data.id);
    const payload = {
        id: id,
        nombre: data.nombre,
        telefono: data.telefono,
        edad: parseInt(data.edad),
        email: data.email,
        organizacion: data.organizacion
    };

    try {
        const res = await fetch(API_URL + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            showMessage("Voluntario actualizado correctamente");
            limpiarFormulario();
            cargarVoluntarios();
        } else {
            const err = await res.json();
            showMessage("Error al actualizar: " + (err.detail || "Error del servidor"), "error");
        }
    } catch (error) {
        showMessage("Error de conexion. Asegurese de que el servidor este corriendo en http://127.0.0.1:8000", "error");
    }
}

async function eliminarVoluntario() {
    if (!idEditando) {
        showMessage("Seleccione un voluntario de la tabla para eliminar.", "error");
        return;
    }

    if (!confirm("¿Esta seguro de eliminar el voluntario con ID " + idEditando + "?")) return;

    try {
        const res = await fetch(API_URL + idEditando, { method: "DELETE" });
        if (res.ok) {
            showMessage("Voluntario eliminado correctamente");
            limpiarFormulario();
            cargarVoluntarios();
        } else {
            const err = await res.json();
            showMessage("Error al eliminar: " + (err.detail || "Voluntario no encontrado"), "error");
        }
    } catch (error) {
        showMessage("Error de conexion. Asegurese de que el servidor este corriendo en http://127.0.0.1:8000", "error");
    }
}

btnRegistrar.addEventListener("click", registrarVoluntario);
btnEditar.addEventListener("click", editarVoluntario);
btnEliminar.addEventListener("click", eliminarVoluntario);
btnLimpiar.addEventListener("click", limpiarFormulario);
btnBuscar.addEventListener("click", buscarVoluntario);
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de voluntarios?")) {
        window.location.href = "../index.html";
    }
});

cargarVoluntarios();