import React, {Component} from 'react';
import swal from 'sweetalert';

class DetallePedido extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabecera: {},
            descripcion: [],

            editando: false,
            iddetallepedido: '',
            idpedidomaster: '',

            preciounitario: '',
            cantidaditems: '',
            preciototalantiguo: '',
        };

        this.fetchListaProductos = this.fetchListaProductos.bind(this);
        this.fetchActualizarPrecio = this.fetchActualizarPrecio.bind(this);

        this.activarEdicion = this.activarEdicion.bind(this);
        this.cancelarEdicion = this.cancelarEdicion.bind(this);

        this.onInputChange = this.onInputChange.bind(this);

    }

    fetchListaProductos(){
        fetch(
            '/api/pedido/' + this.props.idpedido + "?token="+localStorage.getItem('tiendauth')
        )
            .then(res => res.json())
            .then(pedidoDatos => {
                console.log(pedidoDatos);
                this.setState({
                    cabecera: pedidoDatos.data.cabecera,
                    descripcion: pedidoDatos.data.descripcion
                })
            });
    }

    fetchActualizarPrecio(){
        fetch(
            '/api/detallepedido/',{
                method: 'put',
                body: JSON.stringify({
                    idpedidomaster: this.state.idpedidomaster,
                    iddetallepedido: this.state.iddetallepedido,
                    cantidaditems: this.state.cantidaditems,
                    preciounitario: this.state.preciounitario
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(actualizado => {
                if (actualizado.status === 'ok'){
                    swal("ACTUALIZACIÓN EXITOSA", "Nuevo monto actualizado", "success").then(r => console.log("RPTA:", r));
                    this.cancelarEdicion();
                    this.fetchListaProductos();
                    this.props.actualizarPedidos();
                }else{
                    swal("ERROR EN ACTUALIZAR", actualizado.msg, "error").then(r => console.log("RPTA:", r));
                }
            });
    }

    activarEdicion(evt){
        const PARTES = evt.target.name.split(":");
        this.setState({
            editando: true,
            iddetallepedido: parseInt(PARTES[0]),
            idpedidomaster: parseInt(PARTES[3]),
            preciounitario: parseFloat(document.getElementById(PARTES[0] + ":preciounitario").innerText),
            cantidaditems: parseFloat(PARTES[2]),
            preciototalantiguo: parseFloat(document.getElementById(PARTES[0] + ":preciounitario").innerText) * parseFloat(PARTES[2])
        });
    }

    cancelarEdicion(){
        document.getElementById(this.state.iddetallepedido + ":preciototal").innerText = this.state.preciototalantiguo;
        this.setState({
            editando: false,
            iddetallepedido: '',
            preciounitario: '',
            cantidaditems: '',
            preciototalantiguo: '',
            idpedidomaster: '',
        });
    }

    onInputChange(evt){
        this.setState({
            [evt.target.name]: evt.target.value
        }, () => {
            document.getElementById(this.state.iddetallepedido + ":preciototal").innerText = (this.state.preciounitario * this.state.cantidaditems).toFixed(2);
        });
    }

    componentDidMount() {
        this.fetchListaProductos();
    }

    render() {
        return (
            <div className="row justify-content-center">
                <button className="btn btn-warning float-left" onClick={this.props.menuPrincipal}>
                    ATRAS
                </button>
                <div className="col-12 col-sm-10 col-md-8">
                    <h3 className="text-center">DATOS</h3>
                    <strong>MONTO TOTAL:</strong> S/ { parseFloat(this.state.cabecera.montototal).toFixed(2)}
                    <br/>
                    <strong>CALIFICACIÓN:</strong> { this.state.cabecera.calificacion? this.state.cabecera.calificacion + " estrellas": "Sin Calificar" }
                    <br/>
                    <strong>COMENTARIOS:</strong> { this.state.cabecera.comentarios? this.state.cabecera.comentarios: "Sin Comentarios" }
                </div>
                <div className="col-12 col-sm-10 col-md-8 mt-3">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">DESCRIPCIÓN</th>
                                <th scope="col">CANTIDAD</th>
                                <th scope="col">PRECIO UNITARIO</th>
                                <th scope="col">PRECIO TOTAL</th>
                                <th scope="col">ESTADO</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.descripcion.map((obj, idx) => {
                                    return (
                                        <tr key={obj.iddetallepedido}>
                                            <th scope="row">{ idx + 1 }</th>
                                            <td>{ obj.nombreitem }</td>
                                            <td className="text-center">
                                                {
                                                    (this.state.cabecera.estadopedido !== "1")?obj.cantidaditems:''
                                                }
                                                {
                                                    (this.state.cabecera.estadopedido === "1" && !this.state.editando)  &&
                                                        <React.Fragment>
                                                            { obj.cantidaditems }
                                                            <br/>
                                                            <button className="btn btn-success btn-sm" name={obj.iddetallepedido + ":editar:" + obj.cantidaditems + ":" + obj.idpedidomaster} onClick={this.activarEdicion}>CAMBIAR</button>
                                                        </React.Fragment>
                                                }
                                                {
                                                    (this.state.editando && obj.iddetallepedido === this.state.iddetallepedido) &&
                                                        <React.Fragment>
                                                            <input type="text" className="form-control" name="cantidaditems" value={this.state.cantidaditems} onChange={this.onInputChange}/>
                                                            <br/>
                                                            <button className="btn btn-warning btn-sm" onClick={this.cancelarEdicion}>CANCELAR</button>
                                                            <button className="btn btn-success btn-sm ml-2" onClick={this.fetchActualizarPrecio}>GUARDAR</button>
                                                        </React.Fragment>
                                                }
                                            </td>
                                            <td id={obj.iddetallepedido + ":preciounitario"}>{ parseFloat(obj.preciounitario).toFixed(2) }</td>
                                            <td id={obj.iddetallepedido + ":preciototal"}>{ parseFloat(obj.preciototal).toFixed(2) }</td>
                                            {
                                                !obj.entregado  && (this.state.cabecera.estadopedido === "3" || this.state.cabecera.estadopedido === "2")?
                                                    <td className="bg-danger">RECHAZADO</td>:
                                                    obj.entregado?
                                                        <td className="bg-danger">ENTREGADO</td>
                                                        :
                                                        <td className="bg-warning">EN ESPERA</td>
                                            }
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetallePedido;
