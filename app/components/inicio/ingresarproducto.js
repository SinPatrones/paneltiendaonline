import React, {Component} from 'react';
import swal from 'sweetalert';

class IngresarProducto extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreitem: '',
            stockitem: '',
            precioitem: '',
            codigounidadmedida: 'UND',
            categoria: '0',
            almacenadoen: '1',
            enoferta: false,
            descripcion: '',

            listaCategorias: [],
            listaCodigosUnidades: [],
        };

        this.fetchCrearItem = this.fetchCrearItem.bind(this);
        this.fetchObtenerCategorias = this.fetchObtenerCategorias.bind(this);

        this.inputChangeComponent = this.inputChangeComponent.bind(this);
    }

    fetchCrearItem(evt){
        evt.preventDefault();
        const body = {
            nombreitem: this.state.nombreitem,
            stockitem: this.state.stockitem,
            precioitem: this.state.precioitem,
            codigounidadmedida: this.state.codigounidadmedida,
            categoria: this.state.categoria,
            almacenadoen: this.state.almacenadoen,
            enoferta: this.state.enoferta,
            descripcionitem: this.state.descripcion
        };
        console.log("BODY:", body);
        fetch('/api/items', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('tiendauth')
            }
        })
            .then(res => res.json())
            .then(data => {
               console.log(data);
               if (data.status === "ok"){
                   swal("REGISTRADO", data.msg, "success");
               }else{
                   swal("ERROR", data.msg, "error");
               }
            });


        this.setState({
            nombreitem: '',
            stockitem: '',
            precioitem: '',
            codigounidadmedida: 'UND',
            categoria: '0',
            almacenadoen: '1',
            enoferta: false,
            descripcion: ''
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

    fetchObtenerCodigosUnidad(){
        fetch('/api/catalogos/1', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('tiendauth')
            }
        })
            .then(res => res.json())
            .then(listaCodigosUnidad => {
                this.setState({
                    listaCodigosUnidades: listaCodigosUnidad.data
                });
            });
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
        this.fetchObtenerCategorias();
        this.fetchObtenerCodigosUnidad();
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-md-6">
                    <h3 className="text-center">REGISTRAR PRODUCTO</h3>
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nombreitem">Nombre Producto</label>
                                <input type="text" className="form-control" id="nombreitem" name="nombreitem" placeholder="nombre producto" value={this.state.nombreitem} onChange={this.inputChangeComponent}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="stockitem">Stock</label>
                                <input type="number" className="form-control" id="stockitem" name="stockitem" value={this.state.stockitem} onChange={this.inputChangeComponent}/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="descripcion">Descripción</label>
                                <input type="text" className="form-control" id="descripcion" name="descripcion" value={this.state.descripcion} onChange={this.inputChangeComponent}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="enoferta" id="enoferta" checked={this.state.enoferta} onChange={this.inputChangeComponent} required/>
                                <label className="form-check-label" htmlFor="enoferta">
                                    Produto en promoción
                                </label>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="precioitem">Precio</label>
                                <input type="number" className="form-control" id="precioitem" name="precioitem" value={this.state.precioitem} onChange={this.inputChangeComponent}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="categoria">Categoria</label>
                                <select id="categoria" name="categoria" className="form-control" value={this.state.categoria} onChange={this.inputChangeComponent}>
                                    <option value="0">Seleccione...</option>
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

                        <div className="form-row justify-content-center">
                            <div className="col-4">
                                <button type="button" className="btn btn-primary" onClick={this.fetchCrearItem}>CREAR PRODUCTO</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default IngresarProducto;