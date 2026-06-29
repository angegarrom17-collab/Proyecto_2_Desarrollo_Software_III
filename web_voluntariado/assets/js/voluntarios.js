const API_URL = "http://127.0.0.1:8000/voluntarios/";

const tableBody = document.getElementById("voluntariosTable");
const messageBox = document.getElementById("messageBox");
const errorAlert = document.getElementById("errorAlert");
const errorText = document.getElementById("errorText");
const contador = document.getElementById("contador");

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

function obtenerDatosFormulario() {
    return {
        id: document.getElementById("id").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        edad: document.getElementById("edad").value.trim(),
        email: document.getElementById("email").value.trim(),
        organizacion: document.getElementById("organizacion").value.trim()
    };
}

function llenarFormulario(v) {
    document.getElementById("id").value = v.id;
    document.getElementById("nombre").value = v.nombre;
    document.getElementById("telefono").value = v.telefono;
    document.getElementById("edad").value = v.edad;
    document.getElementById("email").value = v.email;
    document.getElementById("organizacion").value = v.organizacion;
}

function limpiarFormulario() {
    document.getElementById("voluntarioForm").reset();
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
            const row = `
                <tr>
                    <td>${v.id}</td>
                    <td>${v.nombre}</td>
                    <td>${v.telefono}</td>
                    <td>${v.edad}</td>
                    <td>${v.email}</td>
                    <td>${v.organizacion}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
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
    const id = document.getElementById("id").value.trim();
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
        llenarFormulario(v);
        showMessage("Voluntario cargado en el formulario");
    } catch (error) {
        showError("Voluntario no encontrado");
    }
}

async function registrarVoluntario() {
    const data = obtenerDatosFormulario();

    if (!validarCampos(data)) return;

    try {
        const checkRes = await fetch(API_URL + data.id);
        if (checkRes.ok) {
            showMessage("Ya existe un voluntario con ese ID. Use otro ID o use Editar.", "error");
            return;
        }
    } catch (e) {

    }

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
            document.getElementById("voluntarioForm").reset();
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
    const data = obtenerDatosFormulario();

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
            document.getElementById("voluntarioForm").reset();
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
    const id = document.getElementById("id").value.trim();

    if (!id) {
        showMessage("Ingrese el ID del voluntario a eliminar", "error");
        return;
    }
    if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
        showMessage("El ID debe ser un numero valido", "error");
        return;
    }

    if (!confirm("¿Esta seguro de eliminar el voluntario con ID " + id + "?")) return;

    try {
        const res = await fetch(API_URL + id, { method: "DELETE" });
        if (res.ok) {
            showMessage("Voluntario eliminado correctamente");
            document.getElementById("voluntarioForm").reset();
            cargarVoluntarios();
        } else {
            const err = await res.json();
            showMessage("Error al eliminar: " + (err.detail || "Voluntario no encontrado"), "error");
        }
    } catch (error) {
        showMessage("Error de conexion. Asegurese de que el servidor este corriendo en http://127.0.0.1:8000", "error");
    }
}

cargarVoluntarios();