// models/Reserva.js
class Reserva {
    constructor(data, horaEntrada, horaSaida, carroId, usuarioId) {
        this.data = data;
        this.horaEntrada = horaEntrada;
        this.horaSaida = horaSaida;
        this.carroId = carroId;
        this.usuarioId = usuarioId;
    }
}

export default Reserva;
