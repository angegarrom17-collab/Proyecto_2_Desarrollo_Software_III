const lblTotal = document.getElementById("lblTotal");
const lblPromedio = document.getElementById("lblPromedio");
const lblAnimales = document.getElementById("lblAnimales");
const tbody = document.getElementById("tbodyReporte");
const lblFooter = document.getElementById("lblFooter");
const messageBox = document.getElementById("messageBox");

function mostrarMensaje(texto, tipo = "success") {
    messageBox.textContent = texto; 
    messageBox.className = `message-box ${tipo}`;
    
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

function obtenerBasura() {
    const data = localStorage.getItem("basura_monitoreo");
    
    if (!data) return [];
    
    try { 
        return JSON.parse(data); 
    } catch { 
        return []; 
    }
}

function obtenerAnimales() {
    const data = localStorage.getItem("fauna_monitoreo");
    
    if (!data) return [];
    
    try { 
        return JSON.parse(data); 
    } catch { 
        return []; 
    }
}

function generar() {
    const basura = obtenerBasura();
    const animales = obtenerAnimales();

    const total = basura.reduce((sum, b) => sum + (parseFloat(b.pesoKilos) || 0), 0);
    const conPeso = basura.filter(b => (parseFloat(b.pesoKilos) || 0) > 0);
    const promedio = conPeso.length > 0 ? total / conPeso.length : 0;

    lblTotal.textContent = `${total.toFixed(2)} kg`;
    lblPromedio.textContent = `${promedio.toFixed(2)} kg`;
    lblAnimales.textContent = String(animales.length);

    const porTipo = {};
    
    basura.forEach(b => {
        const tipo = b.tipoResiduo || "Desconocido";
        porTipo[tipo] = (porTipo[tipo] || 0) + (parseFloat(b.pesoKilos) || 0);
    });

    tbody.innerHTML = "";
    
    Object.entries(porTipo).forEach(([tipo, peso]) => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `<td>${tipo}</td><td>${peso.toFixed(2)}</td>`;
        tbody.appendChild(tr);
    });

    lblFooter.textContent = `Reporte generado · ${Object.keys(porTipo).length} tipo(s) de residuo`;
    mostrarMensaje("Reporte generado correctamente.", "success");
}

function limpiar() {
    lblTotal.textContent = "0.00 kg";
    lblPromedio.textContent = "0.00 kg";
    lblAnimales.textContent = "0";
    tbody.innerHTML = "";
    lblFooter.textContent = "Presione 'Generar Reporte' para cargar los datos.";
}

document.getElementById("btnGenerar").addEventListener("click", generar);
document.getElementById("btnLimpiar").addEventListener("click", limpiar);
document.getElementById("btnSalir").addEventListener("click", () => { 
    if (confirm("¿Desea salir?")) window.location.href = "principal.html"; 
});

document.addEventListener("DOMContentLoaded", () => { 
    generar(); 
});