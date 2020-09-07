import React, {Component} from 'react';
import swal from 'sweetalert';

class VerProductos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buscarproducto: '',
            listaproductos: [],
            listaCategorias: [],

            nuevacategoria: '',
            nuevadescripcionitem: '',
            nuevoenoferta: null,
            nuevoidcatalogo: '',
            nuevonombreitem: "",
            nuevoprecioitem: "",
            nuevostockitem: "",

            editando: false,
            ideditar: '',

            nombreitem: '',
            descripcionitem: '',
            stockitem: '',
            precioitem: '',
            categoria: '',
            imagenitem: '',
            enoferta: false,

            datositemeditando: {},
        };

        this.fetchListaProductos = this.fetchListaProductos.bind(this);
        this.fetchObtenerCategorias = this.fetchObtenerCategorias.bind(this);
        this.fetchObtenerDatosProducto = this.fetchObtenerDatosProducto.bind(this);
        this.fetchActualizarDatosProductos = this.fetchActualizarDatosProductos.bind(this);

        this.inputChangeComponent = this.inputChangeComponent.bind(this);
        this.buscandoProducto = this.buscandoProducto.bind(this);
        this.editandoProducto = this.editandoProducto.bind(this);
        this.cancelarEditado = this.cancelarEditado.bind(this);
    }

    fetchListaProductos(){
        console.log("TRAENDO LISTA");
        fetch(
            "/api/items/tabla",{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(listaProductos => {
                if (listaProductos.status === "ok"){
                    this.setState({
                        listaproductos: listaProductos.data
                    })
                }
            });
    }

    fetchObtenerDatosProducto(){
        console.log("OBTENIENDO DATOS DE UN PRODUCTO: ", '/api/items/' + this.state.ideditar);
        fetch(
            '/api/items/datos/' + this.state.ideditar,{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(datosItem => {
                console.log(datosItem);
                if (datosItem.status === 'ok'){
                    this.setState({
                        nombreitem: datosItem.data.nombreitem,
                        descripcionitem: datosItem.data.descripcionitem,
                        stockitem: datosItem.data.stockitem,
                        precioitem: datosItem.data.precioitem,
                        categoria: datosItem.data.categoria,
                        antiguaimagenitem: "/images/productos/" + datosItem.data.imagenitem,
                        enoferta: datosItem.data.enoferta,
                    })
                }
            });
    }

    fetchActualizarDatosProductos(){
        swal( "Cambiando Estado", {
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: false,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Continuar",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            }
        })
            .then(rpta => {
                if (rpta){
                    let body = new FormData();

                    // SELECCIONADO IMAGEN DEL PRODUCTO PARA SUBIRLO
                    const imagenItem = document.getElementById('imagenitem');
                    body.append('imagenItem', imagenItem.files[0]);

                    body.append("iditem", this.state.ideditar);
                    body.append("nombreitem", this.state.nombreitem);
                    body.append("stockitem", this.state.stockitem);
                    body.append("precioitem", this.state.precioitem);
                    body.append("categoria", this.state.categoria);
                    body.append("enoferta", this.state.enoferta);
                    body.append("descripcionitem", this.state.descripcionitem);


                    fetch(
                        "/api/items",{
                            method: 'put',
                            body: body,
                            headers: {
                                'x-access-token': localStorage.getItem('tiendauth')
                            }
                        }
                    )
                        .then(res => res.json())
                        .then(actualizacion => {
                            if (actualizacion.status === 'ok'){
                                this.fetchListaProductos()
                                swal("ACTUALIZADO", "Los datos del producto fueron actualizados con éxito", "success");
                                this.cancelarEditado();
                            }else{
                                swal("¡¡ UPPS !!", "Al parecer tuvimos problemas para actualizar, intentelo nuevamente", "error");
                            }
                        });
                }else{
                    // EN EL CASO QUE NO HAYA QUERIDO ACTUALIZAR
                    swal("SIN CAMBIOS", "No se guardo ningun cambio hecho al producto", "warning");
                }
            });
    }

    fetchObtenerCategorias(){
        console.log("Traendo lista de categorias");
        fetch('/api/catalogos/2', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('tiendauth')
            }
        })
            .then(res => res.json())
            .then(listaCategorias => {
                this.setState({
                    listaCategorias: listaCategorias.data
                });
            });
    }

    buscandoProducto(evt){
        this.setState({
            buscarproducto: evt.target.value
        }, () => {
            fetch(
                '/api/items/buscar?nombre=' + this.state.buscarproducto,{
                    method: 'get',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('tiendauth')
                    }
                }
            )
                .then(res => res.json())
                .then(encontrados => {
                    if (encontrados.status === 'error'){
                        this.setState({
                            listaproductos: []
                        });
                    }else{
                        this.setState({
                            listaproductos: encontrados.data
                        })
                    }
                });
        });
    }

    editandoProducto(evt){
        let idItem = evt.target.id.split("editar")[0];
        console.log(idItem);
        this.setState({
            editando: true,
            ideditar: idItem
        }, () => {
            this.fetchObtenerDatosProducto();
        });
    }

    cancelarEditado(){
        this.setState({
            editando: false,
            ideditar: '',
            nombreitem: '',
            descripcionitem: '',
            stockitem: '',
            precioitem: '',
            categoria: '',
            imagenitem: '',
            enoferta: false,
        })
    }

    inputChangeComponent(evt){
        if (evt.target.type === "checkbox"){
            console.log("CEHCKBOX", evt.target.checked);
            this.setState({
                [evt.target.name]: evt.target.checked
            });
        }else{
            this.setState({
                [evt.target.name]: evt.target.value
            });
        }
    }

    componentDidMount() {
        this.fetchListaProductos();
        this.fetchObtenerCategorias();
    }

    render() {
        return (
            <div>
                <h3 className="text-center">LISTA DE PRODUCTOS</h3>
                <div className="form-group">
                    <div className="row justify-content-center">
                        <div className="col-5 col-sm-4 col-md-2">
                            <label htmlFor="buscar" className="col-form-label">NOMBRE PRODUCTO:</label>
                        </div>
                        <div className="col-7 col-sm-8 col-md-10">
                            <input type="text" className="form-control" name="buscar" id="buscar" placeholder="Nombre del producto" onChange={this.buscandoProducto} value={this.state.buscarproducto}/>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-10 text-center">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ITEM</th>
                                    <th scope="col">DESCRIPCION</th>
                                    <th scope="col">STOCK</th>
                                    <th scope="col">PRECIO</th>
                                    <th scope="col">CATEGORIA</th>
                                    <th scope="col">ESTADO</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.listaproductos.map((obj, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <th scope="row">{ obj.iditem }</th>
                                                <td>{
                                                    obj.nombreitem
                                                }</td>
                                                <td>{
                                                    obj.descripcionitem
                                                }</td>
                                                <td>{
                                                    obj.stockitem
                                                }</td>
                                                <td>{
                                                    obj.precioitem
                                                }</td>
                                                <td width="180px">{
                                                    obj.categoria
                                                }</td>
                                                <td>{
                                                    obj.enoferta? "En Oferta":"Sin Oferta" }</td>
                                                <td>
                                                    <button type="button"
                                                            className="btn btn-success btn-sm"
                                                            data-toggle="modal"
                                                            data-target="#listaRepartidores"
                                                            name={ obj.iditem + "editar" } id={ obj.iditem + "editar" }
                                                            onClick={this.editandoProducto}
                                                    >
                                                        <span className="fa fa-pencil-square-o" id={ obj.iditem + "editar" }></span>
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
                </div>

                <div className="modal fade" id="listaRepartidores" data-backdrop="static"
                     data-keyboard="false" tabIndex="-1" aria-labelledby="listaRepartidoresLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="listaRepartidoresLabel">EDITAR PRODUCTO</h5>
                                <button type="button" className="close" data-dismiss="modal" onClick={this.cancelarEditado}
                                        aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 text-center" style={{backgroundColor: this.state.imagenitem !== ""? "red":''}}>
                                        {
                                            this.state.imagenitem !== ""?
                                                <h5>Actualizara Imagen</h5>:
                                                <h5>Imagen Actual</h5>
                                        }
                                        <img src={this.state.antiguaimagenitem} alt="Imagen Producto" width="100%"/>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form">
                                            <div className="form-row">
                                                NOMBRE:
                                                <input type="text" className="form-control" name="nombreitem" value={this.state.nombreitem} onChange={this.inputChangeComponent}/>
                                            </div>
                                            <div className="form-row">
                                                DESCRIPCIÓN:
                                                <input type="text" className="form-control" name="descripcionitem" value={this.state.descripcionitem} onChange={this.inputChangeComponent}/>
                                            </div>
                                            <div className="form-row">
                                                STOCK:
                                                <input type="text" className="form-control" name="stockitem" value={this.state.stockitem} onChange={this.inputChangeComponent}/>
                                            </div>
                                            <div className="form-row">
                                                PRECIO:
                                                <input type="text" className="form-control" name="precioitem" value={this.state.precioitem} onChange={this.inputChangeComponent}/>
                                            </div>
                                            <div className="form-row">
                                                EN OFERA:
                                                <input type="checkbox" className="form-control" name="enoferta" checked={this.state.enoferta} onChange={this.inputChangeComponent}/>
                                            </div>
                                            <div className="form-row">
                                                CATEGORIA:
                                                <select id="categoria" name="categoria" className="form-control" onChange={this.inputChangeComponent}>
                                                    {
                                                        this.state.listaCategorias.map(ele => {
                                                            return (
                                                                <option key={ele.idcatalogo} value={ele.idcatalogo} selected={ele.idcatalogo === this.state.categoria}>{ele.valor}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-row">
                                                IMAGEN PRODUCTO:
                                                <input type="file" className="form-control" name="imagenitem" id="imagenitem" onChange={this.inputChangeComponent}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.cancelarEditado}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.fetchActualizarDatosProductos}>
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VerProductos;