import React, {Component} from 'react';
import DetallePedido from "./detallepedido";
import swal from 'sweetalert';

class VerPedidos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaPedidos: [],
            listaRepartidores: [],
            menu: 1,
            idpedido: null,
            idrepartidor: 0,
        };

        this.fetchObtenerPedidos = this.fetchObtenerPedidos.bind(this);
        this.fetchAsignarRepartidor = this.fetchAsignarRepartidor.bind(this);
        this.fetchObtenerRepartidores = this.fetchObtenerRepartidores.bind(this);

        this.verPedido = this.verPedido.bind(this);
        this.menuPrincipal = this.menuPrincipal.bind(this);
        this.seleccionarRepartidor = this.seleccionarRepartidor.bind(this);
        this.cancelarRepartidor = this.cancelarRepartidor.bind(this);
    }

    fetchObtenerPedidos(){
        fetch(
            '/api/pedido/lista/0',{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(listaPedidos => {
                this.setState({
                    listaPedidos: listaPedidos.data
                });
            });
    }

    fetchObtenerRepartidores(){
        fetch(
            '/api/administrador/tipo/repartidores?token='+localStorage.getItem('tiendauth')
        )
            .then(res => res.json())
            .then(listaRepartidores => {
                this.setState({
                    listaRepartidores: listaRepartidores.data
                })
            })
        ;
    }

    fetchAsignarRepartidor(evt){
        let datos = {
            idadministrador: this.state.idrepartidor,
            idpedido: this.state.idpedido
        };
        fetch(
            '/api/pedido/registrarrepartidor',{
                method: 'post',
                body: JSON.stringify(datos),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(datos => {
                if (datos.status === "ok"){
                    this.fetchObtenerPedidos();
                    swal("REGISTRO CORRECTO", "Repartidor asignado", "success").then(r => console.log("RPTA:", r));
                }else{
                    swal("ERROR AL REGISTRAR", "Error al registrar repartidor", "error").then(r => console.log("RPTA:", r));
                }
            });
    }

    verPedido(evt){
        const nombre = evt.target.name.split(':');
        this.setState({
            idpedido: nombre[0]
        }, () => {
            this.setState({
                menu: 2
            })
        });
    }

    cancelarRepartidor(evt){
        const idpedido = evt.target.name.split(":")[0];
        this.setState({
            idpedido: null,
            idrepartidor: 0
        }, () => {
            this.setState({
                idpedido: idpedido
            });
        });
    }

    seleccionarRepartidor(evt){
        const idRepartidor = parseInt(evt.target.name.split(":")[0]);
        this.setState({
            idrepartidor: idRepartidor
        });
    }

    menuPrincipal(){
        this.setState({
            menu: 1
        });
    }

    componentDidMount() {
        this.fetchObtenerPedidos();
        this.fetchObtenerRepartidores();
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.menu === 1 &&
                    <div className="row justify-content-center">
                        <h3 className="text-center">VER PEDIDOS</h3>
                        <div className="col-12">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">FECHA - HORA</th>
                                    <th scope="col">MONTO PEDIDO</th>
                                    <th scope="col" className="text-center">ESTADO PEDIDO</th>
                                    <th scope="col">REPARTIDOR</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.listaPedidos.map((obj, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <th scope="row">{ obj.idpedido }</th>
                                                <td>{ formatoFecha(obj.tsfechapedido) + " - " + formatoHora(obj.tsfechapedido) }</td>
                                                <td>{ parseFloat(obj.montototal).toFixed(2) }</td>
                                                <td align="center" className={ obj.estadopedido === '3'? "bg-danger": obj.estadopedido === '2'? "bg-success": obj.estadopedido === '1'? "bg-warning":"bg-dark" }>{ obj.estadopedido === '3'? "ANULADO": obj.estadopedido === '2'? "ENTREGADO": obj.estadopedido === '1'? "EN ESPERA":"DESCONOCIDO" }</td>
                                                <td>{
                                                    obj.idrepartidor?
                                                        <div>
                                                            {obj.nombres + " " + obj.apellidos}
                                                            <br/>
                                                            <button type="button" className="btn btn-warning btn-sm" data-toggle="modal" data-target="#listaRepartidores" name={obj.idpedido + ":asignar"} onClick={this.cancelarRepartidor}>
                                                                Cambiar
                                                            </button>
                                                        </div>:
                                                        <div>
                                                            Sin Asignar <br/>
                                                            <button type="button" className="btn btn-danger btn-sm" data-toggle="modal" data-target="#listaRepartidores" name={obj.idpedido + ":asignar"} onClick={this.cancelarRepartidor}>
                                                                Sin Asignar
                                                            </button>
                                                        </div>
                                                }</td>
                                                <td>
                                                    <button className="btn btn-success" name={obj.idpedido + ":pedido"} onClick={this.verPedido}>VER</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </div>

                        <div class="modal fade" id="listaRepartidores" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="listaRepartidoresLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="listaRepartidoresLabel">Seleccione Repartidor</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body text-center">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">NOMBRES</th>
                                                <th scope="col">APELLIDOS</th>
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.listaRepartidores.map((obj, idx) => {
                                                    return (
                                                        <tr className={this.state.idrepartidor.toString() === obj.idadministrador.toString()? "bg-success": ""}>
                                                            <th scope="row">{ obj.idadministrador}</th>
                                                            <td>{ obj.nombres }</td>
                                                            <td>{ obj.apellidos }</td>
                                                            <td>
                                                                <button className="btn btn-success" name={obj.idadministrador + ":repartidor"} onClick={this.seleccionarRepartidor}>SELECCIONAR</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal" oncancel={this.cancelarRepartidor}>Cerrar</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.fetchAsignarRepartidor} disabled={this.state.idrepartidor === 0}>Guardar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    this.state.menu === 2 &&
                        <DetallePedido
                            idpedido={this.state.idpedido}
                            menuPrincipal={this.menuPrincipal}
                        />
                }
            </React.Fragment>
        );
    }
}

const formatoFecha = (fechanueva) => {
    const formateado = new Date(fechanueva);
    let anio = formateado.getFullYear();
    let mes = formateado.getMonth() + 1;
    mes = mes < 10? "0" + mes.toString():mes.toString();
    let dia = formateado.getDate() < 10? '0' + formateado.getDate(): formateado.getDate();

    return dia + "/" + mes + "/" + anio;
};

const formatoHora = (horanueva) => {
    const formato = new Date(horanueva);
    return formato.getHours() + ":" + formato.getMinutes() + ":" + formato.getSeconds();
};

export default VerPedidos;