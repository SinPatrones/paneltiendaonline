import React, {Component} from 'react';

class DetallePedido extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabecera: {},
            descripcion: [],
        };

        this.fetchListaProductos = this.fetchListaProductos.bind(this);

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
                                        <tr key={idx}>
                                            <th scope="row">{ idx + 1 }</th>
                                            <td>{ obj.nombreitem }</td>
                                            <td>{ obj.cantidaditem }</td>
                                            <td>{ parseFloat(obj.preciounitario).toFixed(2) }</td>
                                            <td>{ parseFloat(obj.preciototal).toFixed(2) }</td>
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