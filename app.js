import { Transaccion } from './classes/Transaccion.js';

// Aca Estan Los elementos clave del DOM para interactuar con ellos
const form = document.getElementById('form-transaccion');
const tablaMovimientos = document.getElementById('tabla-movimientos');
const totalIngresosElem = document.getElementById('total-ingresos');
const totalGastosElem = document.getElementById('total-gastos');
const balanceNetoElem = document.getElementById('balance-neto');

// Interceptor del el evento 'submit' del formulario para procesar los datos sin recargar la página
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const nuevaTransaccion = new Transaccion(tipo, descripcion, monto, categoria);
    Transaccion.agregar(nuevaTransaccion);

    actualizarInterfaz();
    form.reset();
});

// Aca Estan La Función encargada de recalcular los totales y renderizar el historial en el DOM
function actualizarInterfaz() {
    tablaMovimientos.innerHTML = '';

    let ingresosTotales = 0;
    let gastosTotales = 0;

    // el array de transacciones para acumular totales y armar la tabla
    Transaccion.historial.forEach((t) => {
        if (t.tipo === 'ingreso') {
            ingresosTotales += t.monto;
        } else {
            gastosTotales += t.monto;
        }

        const fila = document.createElement('tr');

        // Inyector Al HTML
        fila.innerHTML = `
            <td>${t.descripcion}</td>
            <td>${t.categoria}</td>
            <td>${t.tipo}</td>
            <td>$${t.monto.toFixed(2)}</td>
            <td><button onclick="window.eliminarRegistro(${t.id})">Eliminar</button></td>
        `;

        tablaMovimientos.appendChild(fila);
    });

    // Calculam el balance neto restando los gastos a los ingresos totales
    const balanceNeto = ingresosTotales - gastosTotales;

    // Actualiza los textos informativos en el Panel de Balance Global
    totalIngresosElem.textContent = `$${ingresosTotales.toFixed(2)}`;
    totalGastosElem.textContent = `$${gastosTotales.toFixed(2)}`;
    balanceNetoElem.textContent = `$${balanceNeto.toFixed(2)}`;
}

// Declara la función de eliminación en el ámbito global (window) para que el HTML la reconozca (Mejor no tocarlo)
window.eliminarRegistro = function(id) {
    Transaccion.eliminar(id); 
    actualizarInterfaz(); 
};
