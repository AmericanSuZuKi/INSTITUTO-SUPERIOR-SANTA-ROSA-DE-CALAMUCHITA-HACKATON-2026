export class Transaccion {
    static historial = JSON.parse(localStorage.getItem('historial')) || [];

    constructor(tipo, descripcion, monto, categoria) {
        this.id = Date.now();
        this.tipo = tipo;     
        this.descripcion = descripcion;
        this.monto = parseFloat(monto);
        this.categoria = categoria;
    }

    static guardarEnStorage() {
        localStorage.setItem('historial', JSON.stringify(Transaccion.historial));
    }

    static agregar(transaccion) {
        Transaccion.historial.push(transaccion);
        Transaccion.guardarEnStorage();
    }

    static eliminar(id) {
        Transaccion.historial = Transaccion.historial.filter(t => t.id !== id);
        Transaccion.guardarEnStorage();
    }

    // Método estático para actualizar una transacción existente buscando por su ID
    static actualizar(id, nuevosDatos) {
        const index = Transaccion.historial.findIndex(t => t.id === Number(id));
        if (index !== -1) {
            Transaccion.historial[index].descripcion = nuevosDatos.descripcion;
            Transaccion.historial[index].monto = parseFloat(nuevosDatos.monto);
            Transaccion.historial[index].tipo = nuevosDatos.tipo;
            Transaccion.historial[index].categoria = nuevosDatos.categoria;
            Transaccion.guardarEnStorage();
        }
    }
}
