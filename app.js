import { Transaccion } from './classes/Transaccion.js';

const form = document.getElementById('form-transaccion');
const tablaMovimientos = document.getElementById('tabla-movimientos');
const totalIngresosElem = document.getElementById('total-ingresos');
const totalGastosElem = document.getElementById('total-gastos');
const balanceNetoElem = document.getElementById('balance-neto');

// Variable global temporal para saber si estamos editando un ID específico
let idTransaccionEnEdicion = null;

// Función al cargar la página para pintar las transacciones de localStorage
actualizarInterfaz();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;

    if (idTransaccionEnEdicion !== null) {
        Transaccion.actualizar(idTransaccionEnEdicion, { descripcion, monto, tipo, categoria });
        idTransaccionEnEdicion = null; 
        
        const btnSubmit = form.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Registrar Transacción';
    } else {
        const nuevaTransaccion = new Transaccion(tipo, descripcion, monto, categoria);
        Transaccion.agregar(nuevaTransaccion);
    }

    actualizarInterfaz();
    form.reset();
});

function actualizarInterfaz() {
    tablaMovimientos.innerHTML = '';

    let ingresosTotales = 0;
    let gastosTotales = 0;

    if (Transaccion.historial.length === 0) {
        tablaMovimientos.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    No hay carga financiera registrada.
                </td>
            </tr>
        `;
    }

    Transaccion.historial.forEach((t) => {
        if (t.tipo === 'ingreso') {
            ingresosTotales += t.monto;
        } else {
            gastosTotales += t.monto;
        }

        const fila = document.createElement('tr');

        // Botón de Editar como el de Eliminar en la columna de acciones
        fila.innerHTML = `
            <td class="p-4 pl-1 font-mono text-xs text-gray-500">${t.id}</td>
            <td class="p-4">${t.descripcion}</td>
            <td class="p-4">${t.categoria}</td>
            <td class="p-4 capitalize">${t.tipo}</td>
            <td class="p-4 font-semibold ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-rose-400'}">$${t.monto.toFixed(2)}</td>
            <td class="p-4 pr-1 text-right space-x-2">
                <button onclick="window.prepararEdicion(${t.id})" class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-sm transition cursor-pointer">Editar</button>
                <button onclick="window.eliminarRegistro(${t.id})" class="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg text-sm transition cursor-pointer">Eliminar</button>
            </td>
        `;

        tablaMovimientos.appendChild(fila);
    });

    const balanceNeto = ingresosTotales - gastosTotales;

    totalIngresosElem.textContent = `$${ingresosTotales.toFixed(2)}`;
    totalGastosElem.textContent = `$${gastosTotales.toFixed(2)}`;
    balanceNetoElem.textContent = `$${balanceNeto.toFixed(2)}`;
}

// Función global para cargar los datos en el formulario y activar el modo edición
window.prepararEdicion = function(id) {
    const transaccion = Transaccion.historial.find(t => t.id === Number(id));
    if (!transaccion) return;

    // los inputs con los datos actuales de la transacción  
    document.getElementById('descripcion').value = transaccion.descripcion;
    document.getElementById('monto').value = transaccion.monto;
    document.getElementById('tipo').value = transaccion.tipo;
    document.getElementById('categoria').value = transaccion.categoria;

    // ID que estamos editando temporalmente
    idTransaccionEnEdicion = transaccion.id;

    // texto del botón de envío para darle feedback visual al usuario
    const btnSubmit = form.querySelector('button[type="submit"]');
    btnSubmit.textContent = 'Actualizar Transacción';
    form.scrollIntoView({ behavior: 'smooth' });
};

window.eliminarRegistro = function(id) {
    // eliminan el registro que se estaba editando hace que se limpie el formulario y resetea el estado
    if (idTransaccionEnEdicion === Number(id)) {
        idTransaccionEnEdicion = null;
        form.reset();
        const btnSubmit = form.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Registrar Transacción';
    }

    Transaccion.eliminar(id);
    actualizarInterfaz();
};
