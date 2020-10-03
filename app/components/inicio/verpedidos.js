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

            estadopedido: '0',
            filtro: 'nombres',
            valorfiltro: '',

            nombresclientebuscar: '',
            idpedidobuscar: '',

            montodelivery: '',
        };

        this.fetchFiltroCombo = this.fetchFiltroCombo.bind(this);

        this.fetchObtenerPedidos = this.fetchObtenerPedidos.bind(this);
        this.fetchAsignarRepartidor = this.fetchAsignarRepartidor.bind(this);
        this.fetchObtenerRepartidores = this.fetchObtenerRepartidores.bind(this);
        this.fetchAsignarMontoDelivery = this.fetchAsignarMontoDelivery.bind(this);
        this.fetchLimpiaryObtenerPedidos = this.fetchLimpiaryObtenerPedidos.bind(this);

        this.verPedido = this.verPedido.bind(this);
        this.menuPrincipal = this.menuPrincipal.bind(this);
        this.seleccionarRepartidor = this.seleccionarRepartidor.bind(this);
        this.cancelarRepartidor = this.cancelarRepartidor.bind(this);
        this.actualizarPedidos = this.actualizarPedidos.bind(this);

        this.verPorFiltro = this.verPorFiltro.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    fetchFiltroCombo(){
        fetch(
            '/api/pedido/filtrocombo',{
                method: 'post',
                body: JSON.stringify({
                    filtro: this.state.filtro,
                    valor: this.state.valorfiltro,
                    estadopedido: this.state.estadopedido
                }),
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

    fetchObtenerPedidos(){
        fetch(
            '/api/pedido/lista/' + this.state.estadopedido + '?nombres=' + this.state.nombresclientebuscar + '&idpedido=' + this.state.idpedidobuscar,{
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

    fetchLimpiaryObtenerPedidos(){
        console.log("LIMPIANDO FILTROS APLICADOS");
        this.setState({
            nombresclientebuscar: '',
            idpedidobuscar: '',
            filtro: 'nombres',
            valorfiltro: '',
            estadopedido: '0'
        }, () => {
            this.fetchObtenerPedidos();
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

    fetchAsignarMontoDelivery(){
        fetch(
            '/api/pedido/asignarmontodelivery',{
                method: 'put',
                body: JSON.stringify({
                    idpedido: this.state.idpedido,
                    montodelivery: this.state.montodelivery
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(montoasignado => {
                if (montoasignado.status === "ok"){
                    swal("OPERACIÓN ÉXITOS", "Monto asignado con éxito", "success").then(r => console.log("RPTA:", r));
                    this.fetchObtenerPedidos();
                }else{
                    swal(montoasignado.idstatus === 202?"NO AUTORIZADO":"ERROR", montoasignado.msg, "error").then(r => console.log("RPTA:", r));
                }
            });
    }

    verPorFiltro(evt){
        this.setState({
            estadopedido: evt.target.name.split(":")[0]
        }, () => {
            this.fetchObtenerPedidos();
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
            idrepartidor: 0,
            montodelivery: '',
        }, () => { // PARA PODER RESETEAR VALORES ANTERIORES
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

    inputChange(evt){
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    actualizarPedidos(){
        this.fetchObtenerPedidos();
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
                    <React.Fragment>
                        <div className="row">
                            <h3 className="text-center">VER PEDIDOS</h3>
                        </div>
                        <hr/>
                        <div className="row justify-content-center">
                            <div className="col-12 col-sm-12 col-md-4">
                                <div className=" d-flex justify-items-center">
                                    <button disabled={this.state.estadopedido === '0'} onClick={this.verPorFiltro} name="0:filtro" className="btn ml-1" style={{backgroundColor: '#356dff'}}>TODO</button>
                                    <button disabled={this.state.estadopedido === '1'} onClick={this.verPorFiltro} name="1:filtro" className="btn ml-1" style={{backgroundColor: '#ace7ff'}}>EN ESPERA</button>
                                    <button disabled={this.state.estadopedido === '2'} onClick={this.verPorFiltro} name="2:filtro" className="btn ml-1" style={{backgroundColor: '#93e9be'}}>ENTREGADO</button>
                                    <button disabled={this.state.estadopedido === '3'} onClick={this.verPorFiltro} name="3:filtro" className="btn ml-1" style={{backgroundColor: '#ef5350'}}>ANULADO</button>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 text-center">
                                <select name="filtro" id="filtro" className="form-control" onChange={this.inputChange}>
                                    <option value="nombres" selected={this.state.filtro === "nombres"}>Nombres</option>
                                    <option value="apellidos" selected={this.state.filtro === "apellidos"}>Apellidos</option>
                                    <option value="direccion" selected={this.state.filtro === "direccion"}>Dirección</option>
                                    <option value="telefono" selected={this.state.filtro === "telefono"}>Telefono</option>
                                </select>
                                <input type="text" name="valorfiltro" value={this.state.valorfiltro} onChange={this.inputChange} className="form-control mt-2" placeholder="INGRESE VALOR DE LA BUSQUEDA"/>
                                <button className="btn btn-warning mt-2" onClick={this.fetchFiltroCombo}>APLICAR</button>
                                <button className="btn btn-primary mt-2" onClick={this.fetchLimpiaryObtenerPedidos}>LIMPIAR</button>
                            </div>
                        </div>
                        <hr/>
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">FECHA - HORA</th>
                                            <th scope="col" className="text-center">MONTO PEDIDO</th>
                                            <th scope="col" className="text-center">CLIENTE</th>
                                            <th scope="col" className="text-center">DIRECCIÓN</th>
                                            <th scope="col" className="text-center">TELEFONO</th>
                                            <th scope="col" className="text-center">MET. PAGO</th>
                                            <th scope="col">REPARTIDOR</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.listaPedidos.map((obj, idx) => {
                                                return (
                                                    <tr key={obj.idpedido}>
                                                        <th scope="row"
                                                            style={{backgroundColor: obj.estadopedido === '3' ? "#ef5350" : obj.estadopedido === '2' ? "#93e9be" : "#ace7ff"}}>{obj.idpedido}</th>
                                                        <td>{formatoFecha(obj.tsfechapedido) + " - " + formatoHora(obj.tsfechapedido)}</td>
                                                        <td className="text-center">
                                                            {parseFloat(obj.montototal).toFixed(2)} <strong>{(obj.montodelivery? " (Envio S/." + obj.montodelivery + ")": " (No hay precio de envio)")}</strong>
                                                            {
                                                                obj.estadopedido === '1' &&
                                                                    <React.Fragment>
                                                                        <br/>
                                                                        <button className="btn btn-success btn-sm" data-toggle="modal"
                                                                                data-target="#montodelivery" name={obj.idpedido + ":montodelivery"}
                                                                                onClick={this.cancelarRepartidor}
                                                                        >
                                                                            Asignar
                                                                        </button>
                                                                    </React.Fragment>
                                                            }
                                                        </td>
                                                        <td align="center">{obj.nombrescliente + " " + obj.apellidoscliente}</td>
                                                        <td align="center">{obj.direccioncliente}</td>
                                                        <td align="center">{obj.telefonocliente}</td>
                                                        <td align="center">{obj.tipodepago.toUpperCase()}</td>
                                                        <td>{
                                                            obj.idrepartidor ?
                                                                <div>
                                                                    {obj.nombres + " " + obj.apellidos}
                                                                    {
                                                                        obj.estadopedido !== '2' &&
                                                                            <React.Fragment>
                                                                                <br/>
                                                                                <button hidden={obj.estadopedido !== '1'} type="button"
                                                                                        className="btn btn-warning btn-sm"
                                                                                        data-toggle="modal"
                                                                                        data-target="#listaRepartidores"
                                                                                        name={obj.idpedido + ":asignar"}
                                                                                        onClick={this.cancelarRepartidor}>
                                                                                    Cambiar
                                                                                </button>
                                                                            </React.Fragment>
                                                                    }
                                                                </div> :
                                                                <div>
                                                                    Sin Asignar <br/>
                                                                    <button hidden={obj.estadopedido !== '1'} type="button"
                                                                            className="btn btn-danger btn-sm"
                                                                            data-toggle="modal"
                                                                            data-target="#listaRepartidores"
                                                                            name={obj.idpedido + ":asignar"}
                                                                            onClick={this.cancelarRepartidor}>
                                                                        Sin Asignar
                                                                    </button>
                                                                </div>
                                                        }</td>
                                                        <td>
                                                            <button className="btn btn-success"
                                                                    name={obj.idpedido + ":pedido"}
                                                                    onClick={this.verPedido}>VER
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="modal fade" id="listaRepartidores" data-backdrop="static"
                                 data-keyboard="false" tabIndex="-1" aria-labelledby="listaRepartidoresLabel"
                                 aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="listaRepartidoresLabel">Seleccione
                                                Repartidor</h5>
                                            <button type="button" className="close" data-dismiss="modal"
                                                    aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body text-center">
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
                                                            <tr className={this.state.idrepartidor.toString() === obj.idadministrador.toString() ? "bg-success" : ""}>
                                                                <th scope="row">{obj.idadministrador}</th>
                                                                <td>{obj.nombres}</td>
                                                                <td>{obj.apellidos}</td>
                                                                <td>
                                                                    <button className="btn btn-success"
                                                                            name={obj.idadministrador + ":repartidor"}
                                                                            onClick={this.seleccionarRepartidor}>SELECCIONAR
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" data-dismiss="modal" data-dismiss="modal"
                                                    oncancel={this.cancelarRepartidor}>
                                                Cerrar
                                            </button>
                                            <button className="btn btn-primary" onClick={this.fetchAsignarRepartidor} data-dismiss="modal"
                                                    disabled={this.state.idrepartidor === 0}>
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal fade" id="montodelivery" tabIndex="-1"
                                 aria-labelledby="montodeliveryLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="montodeliveryLabel">MONTO DE ENVIO</h5>
                                            <button type="button" className="close" data-dismiss="modal"
                                                    aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label htmlFor="montodelivery">Monto Delivery</label>
                                                <input type="text" className="form-control" name="montodelivery" onChange={this.inputChange} value={this.state.montodelivery}/>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-warning" data-dismiss="modal" onClick={this.cancelarRepartidor}>Cancelar</button>
                                            <button className="btn btn-danger" disabled={this.state.montodelivery === ''} onClick={this.fetchAsignarMontoDelivery} data-dismiss="modal">Asignar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }

                {
                    this.state.menu === 2 &&
                        <DetallePedido
                            idpedido={this.state.idpedido}
                            menuPrincipal={this.menuPrincipal}
                            actualizarPedidos={this.actualizarPedidos}
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
