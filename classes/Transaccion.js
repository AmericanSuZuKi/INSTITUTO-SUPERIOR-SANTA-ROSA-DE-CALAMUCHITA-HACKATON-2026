export class Transaccion {
    // Array estático compartido para almacenar todo el historial de transacciones creadas
    static historial = [];

    // El constructor inicializa las propiedades de cada nueva transacción
    constructor(tipo, descripcion, monto, categoria) {
        this.id = Date.now(); // Genera un ID único numérico basado en la marca de tiempo actual
        this.tipo = tipo;     // Define si es 'ingreso' o 'gasto'
        this.descripcion = descripcion; // Texto descriptivo del movimiento
        this.monto = parseFloat(monto); // Convierte el monto ingresado a un número decimal
        this.categoria = categoria; // Categoría asignada (ej. Sueldo, Comida)
    }

    // Método estático para agregar una nueva instancia de transacción al array del historial
    static agregar(transaccion) {
        Transaccion.historial.push(transaccion);
    }

    // Método estático para eliminar una transacción específica filtrando por su ID único
    static eliminar(id) {
        Transaccion.historial = Transaccion.historial.filter(t => t.id !== id);
    }
}
