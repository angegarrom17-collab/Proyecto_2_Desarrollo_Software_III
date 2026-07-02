
const API_URL = 'http://127.0.0.1:8000';


const lblTotal = document.getElementById("lblTotal");
const lblPromedio = document.getElementById("lblPromedio");
const lblAnimales = document.getElementById("lblAnimales");
const tbodyReporte = document.getElementById("tbodyReporte");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

const btnGenerar = document.getElementById("btnGenerar");
const btnSalir = document.getElementById("btnSalir");


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

async function generar() {
    try {
        const respuesta = await fetch(`${API_URL}/reportes/resumen-ambiental`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json().catch(() => ({}));
            throw new Error(extraerMensajeError(datos) || `Error HTTP ${respuesta.status}`);
        }

        const reporte = await respuesta.json();


        lblTotal.textContent = `${reporte.total_basura_kg.toFixed(2)} kg`;
        lblPromedio.textContent = `${reporte.promedio_basura_kg.toFixed(2)} kg`;
        lblAnimales.textContent = String(reporte.total_animales_afectados);

        tbodyReporte.innerHTML = "";

        const porTipo = reporte.residuos_por_tipo || {};

        if (Object.keys(porTipo).length === 0) {
            lblFooter.textContent = "No hay datos de residuos para mostrar.";
        } else {
            Object.entries(porTipo).forEach(([tipo, peso]) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${tipo}</td>
                    <td>${parseFloat(peso).toFixed(2)}</td>
                `;
                tbodyReporte.appendChild(tr);
            });

            lblFooter.textContent = `Reporte generado · ${Object.keys(porTipo).length} tipo(s) de residuo · ${reporte.total_jornadas} jornada(s)`;
        }

        mostrarMensaje("✅ Reporte generado correctamente.", "success");

    } catch (error) {
        mostrarMensaje("❌ Error al generar reporte: " + error.message, "error");
        console.error("Error generar:", error);

        tbodyReporte.innerHTML = `
            <tr>
                <td colspan="2" style="text-align:center;color:#888;padding:20px;">
                    Error al cargar datos. Verifique que la API esté funcionando.
                </td>
            </tr>
        `;
    }
}



btnGenerar.addEventListener("click", generar);

btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea salir del módulo de reportes?")) {
        window.location.href = "../index.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    generar();
});
