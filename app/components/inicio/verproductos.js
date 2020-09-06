import React, {Component} from 'react';

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
        };

        this.fetchListaProdutos = this.fetchListaProdutos.bind(this);
        this.fetchObtenerCategorias = this.fetchObtenerCategorias.bind(this);
        this.inputChangeComponent = this.inputChangeComponent.bind(this);
        this.buscandoProducto = this.buscandoProducto.bind(this);
        this.editandoProducto = this.editandoProducto.bind(this);
        this.cancelarEditado = this.cancelarEditado.bind(this);
    }

    fetchListaProdutos(){
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

    fetchObtenerCategorias(){
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
        });
    }

    cancelarEditado(){
        this.setState({
            editando: false,
            ideditar: ''
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
        this.fetchListaProdutos();
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
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="listaRepartidoresLabel">EDITAR PRODUCTO</h5>
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <div className="form">
                                    <div className="form-row">
                                        NOMBRE:
                                        <input type="text" className="form-control"/>
                                    </div>
                                    <div className="form-row">
                                        DESCRIPCIÓN:
                                        <input type="text" className="form-control"/>
                                    </div>
                                    <div className="form-row">
                                        STOCK:
                                        <input type="text" className="form-control"/>
                                    </div>
                                    <div className="form-row">
                                        PRECIO:
                                        <input type="text" className="form-control"/>
                                    </div>
                                    <div className="form-row">
                                        CATEGORIA:
                                        <select id="nuevacategoria" name="nuevacategoria" className="form-control" onChange={this.inputChangeComponent}>
                                            {
                                                this.state.listaCategorias.map(ele => {
                                                    return (
                                                        <option key={ele.idcatalogo} value={ele.idcatalogo}>{ele.valor}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar
                                </button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Guardar
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