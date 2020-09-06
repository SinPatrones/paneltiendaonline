import React, {Component} from 'react';
import swal from 'sweetalert';

class Categorias extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lista: [],

            valor: '',

            nuevovalor: '',
            ideditar: '',

        };

        this.fetchListaCategorias = this.fetchListaCategorias.bind(this);
        this.fetchCrearCategoria = this.fetchCrearCategoria.bind(this);
        this.fetchGuardarEdicion = this.fetchGuardarEdicion.bind(this);

        this.onInputChange = this.onInputChange.bind(this);
        this.activarEdicion = this.activarEdicion.bind(this);
        this.cancelarEdicion = this.cancelarEdicion.bind(this);
    }

    fetchListaCategorias(){
        fetch(
            '/api/catalogos/2',{
                method: 'get'
            }
        )
            .then(res => res.json())
            .then(categorias => {
                if (categorias.status === "ok"){
                    this.setState({
                        lista: categorias.data
                    });
                }else{
                    swal("ERROR REGISTRAR", categorias.msg, "error").then(r => console.log("RPTA:", r));
                }
            });
    }

    activarEdicion(valor, idcatalogo){
        console.log(valor, idcatalogo);
        this.setState({
            ideditar: idcatalogo,
            nuevovalor: valor
        });
    }

    cancelarEdicion(){
        this.setState({
            nuevovalor: '',
            ideditar: '',
        });
    }

    onInputChange(evt){
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    fetchCrearCategoria(){
        fetch(
            '/api/catalogos',{
                method: 'post',
                body: JSON.stringify({
                    valor: this.state.valor,
                    codigo: 2,
                    nombrecodigo: 'categorias',
                    idpadre: 0,
                    valorcorto: this.state.valor.slice(0,4).toLowerCase(),
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(creado => {
                console.log("CREADO:", creado);
                if (creado.status === "ok"){
                    swal("REGISTRO ÉXITOSO", "Nueva Categría registrada.", "success").then(r => console.log("RPTA:", r));
                    this.setState({
                        valor: '',
                    });
                    this.fetchListaCategorias();
                }else{
                    swal("ERROR REGISTRAR", creado.msg, "error").then(r => console.log("RPTA:", r));
                }
            });
    }

    fetchGuardarEdicion(){
        fetch(
            '/api/catalogos',{
                method: 'put',
                body: JSON.stringify({
                    valor: this.state.nuevovalor,
                    idcatalogo: this.state.ideditar
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
                if (actualizado.status === "ok"){
                    swal("REGISTRO ÉXITOSO", "Categría actualizada.", "success").then(r => console.log("RPTA:", r));
                    this.fetchListaCategorias();
                    this.cancelarEdicion();
                }else{
                    swal("ERROR REGISTRAR", actualizado.msg, "error").then(r => console.log("RPTA:", r));
                }
            });
    }

    componentDidMount() {
        this.fetchListaCategorias();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-md-6">
                        <h3 className="text-center">REGISTRAR NUEVA CATEGORIA</h3>
                        <div>
                            <div className="form-row">
                                <div className="form-group col-12 text-center">
                                    <label htmlFor="valor">Nueva Categoria</label>
                                    <input type="text" className="form-control" id="valor" name="valor" value={this.state.valor} onChange={this.onInputChange}/>
                                </div>
                            </div>

                            <div className="form-row justify-content-center">
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary" disabled={this.state.valor.length < 3} onClick={this.fetchCrearCategoria}>REGISTRAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 text-center">
                        <h3>Categorias Registradas</h3>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">ID CATEGORIA</th>
                                    <th scope="col">DESCRIPCIÓN</th>
                                    <th scope="col"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.lista.map(obj => {
                                        return (
                                            <tr key={obj.idcatalogo}>
                                                <th scope="row">{ obj.idcatalogo }</th>
                                                <td>
                                                    {
                                                        this.state.ideditar === obj.idcatalogo?
                                                            <input type="text" className="form-control" name="nuevovalor" onChange={this.onInputChange} value={this.state.nuevovalor}/>
                                                            :
                                                            obj.valor
                                                    }
                                                </td>
                                                <td>
                                                    <button className="btn btn-warning"
                                                            name={obj.idcatalogo + ":editar"}
                                                            onClick={this.activarEdicion.bind(this, obj.valor, obj.idcatalogo)}
                                                            hidden={this.state.ideditar === obj.idcatalogo}
                                                    >EDITAR</button>
                                                    <button className="btn btn-success ml-1" hidden={this.state.ideditar !== obj.idcatalogo} onClick={this.fetchGuardarEdicion.bind(this)}>GUARDAR</button>
                                                    <button className="btn btn-danger ml-1" hidden={this.state.ideditar !== obj.idcatalogo} onClick={this.cancelarEdicion.bind(this)}>CANCELAR</button>
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
            </React.Fragment>
        );
    }
}

export default Categorias;