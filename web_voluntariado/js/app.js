const API_URL = "http://127.0.0.1:8000/voluntarios/";

const form = document.getElementById("voluntarioForm");
const tableBody = document.getElementById("voluntariosTable");
const messageBox = document.getElementById("messageBox");
const btnLoad = document.getElementById("btnLoad");
const btnSearch = document.getElementById("btnSearch");

let cedulaEditando = null;


function showMessage(text, type = "success") {
    messageBox.textContent = text;
    messageBox.classList.remove("hidden");
    messageBox.style.background = type === "success" ? "#5cb85c" : "#d9534f";
    messageBox.style.color = "white";

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}


async function loadVoluntarios() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error("Error al consultar la API de voluntarios");
        }

        const data = await res.json();
        tableBody.innerHTML = "";

        data.forEach(voluntario => {
            const row = `
                <tr>
                    <td>${voluntario.cedula}</td>
                    <td>${voluntario.nombre}</td>
                    <td>${voluntario.email}</td>
                    <td>${voluntario.edad}</td>
                    <td>${voluntario.organizacion}</td>
                    <td>
                        <button 
                            class="action-btn edit-btn" 
                            onclick="editVoluntario('${voluntario.cedula}', '${voluntario.nombre}', '${voluntario.email}', ${voluntario.edad}, '${voluntario.organizacion}')">
                            Editar
                        </button>
                        <button 
                            class="action-btn delete-btn" 
                            onclick="deleteVoluntario('${voluntario.cedula}')">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
        showMessage("No se pudieron cargar los registros de voluntarios", "error");
    }
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cedula = document.getElementById("cedula").value;
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const edad = parseInt(document.getElementById("edad").value);
    const organizacion = document.getElementById("organizacion").value;

    const voluntarioData = { cedula, nombre, email, edad, organizacion };

    let url = API_URL;
    let method = "POST";

    if (cedulaEditando === null) {
        url = API_URL;
        method = "POST";
    } else {
        url = API_URL + cedulaEditando;
        method = "PUT";
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(voluntarioData)
        });

        if (res.ok) {
            if (method === "POST") {
                showMessage("Voluntario registrado con éxito");
            } else {
                showMessage("Registro de voluntario actualizado con éxito");
            }

            activarModoAgregar();
            loadVoluntarios();
        } else {
            const errorData = await res.json();
            console.error(errorData);
            showMessage("Error al procesar la solicitud en el servidor", "error");
        }

    } catch (error) {
        console.error(error);
        showMessage("Error de comunicación con la API", "error");
    }
});


function activarModoAgregar() {
    cedulaEditando = null;
    document.getElementById("cedula").disabled = false;
    form.reset();
}


function editVoluntario(cedula, nombre, email, edad, organizacion) {
    cedulaEditando = cedula;

    document.getElementById("cedula").value = cedula;
    document.getElementById("nombre").value = nombre;
    document.getElementById("email").value = email;
    document.getElementById("edad").value = edad;
    document.getElementById("organizacion").value = organizacion;

    document.getElementById("cedula").disabled = true;

    showMessage("Modo edición activado");
}


async function searchVoluntario() {
    const cedula = document.getElementById("searchCedula").value.trim();

    if (!cedula) {
        showMessage("Por favor, ingrese un número de cédula", "error");
        return;
    }

    try {
        const res = await fetch(API_URL + cedula);

        if (!res.ok) {
            throw new Error("Registro no localizado");
        }

        const voluntario = await res.json();
        tableBody.innerHTML = `
            <tr>
                <td>${voluntario.cedula}</td>
                <td>${voluntario.nombre}</td>
                <td>${voluntario.email}</td>
                <td>${voluntario.edad}</td>
                <td>${voluntario.organizacion}</td>
                <td>
                    <button 
                        class="action-btn edit-btn" 
                        onclick="editVoluntario('${voluntario.cedula}', '${voluntario.nombre}', '${voluntario.email}', ${voluntario.edad}, '${voluntario.organizacion}')">
                        Editar
                    </button>
                    <button 
                        class="action-btn delete-btn" 
                        onclick="deleteVoluntario('${voluntario.cedula}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;

    } catch (error) {
        showMessage("Voluntario no encontrado en el sistema", "error");
        tableBody.innerHTML = "";
    }
}


async function deleteVoluntario(cedula) {
    try {
        const res = await fetch(API_URL + cedula, {
            method: "DELETE"
        });

        if (res.ok) {
            showMessage("Registro de voluntario eliminado del sistema");
            loadVoluntarios();

            if (cedulaEditando === cedula) {
                activarModoAgregar();
            }
        } else {
            showMessage("No se pudo eliminar el registro", "error");
        }

    } catch (error) {
        console.error(error);
        showMessage("Error de conexión con la API", "error");
    }
}

btnLoad.addEventListener("click", loadVoluntarios);
btnSearch.addEventListener("click", searchVoluntario);

loadVoluntarios();