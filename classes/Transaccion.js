export class Transaccion {
    constructor(id, monto, tipo, descripcion, categoria) {
        this.id = id;
        this.tipo = tipo; // "ingreso" | "gasto"
        this.descripcion = descripcion;
        this.monto = Number(monto);
        this.categoria = categoria;
    }
}
