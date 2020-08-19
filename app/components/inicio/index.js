import React, {Component} from 'react';
import Layout from '../layout';
import IngresarProducto from "./ingresarproducto";
import VerProductos from "./verproductos";
import RegistrarRepartidor from "./registrarrepartidor";
import VerRepartidores from "./verrepartidores";
import VerPedidos from "./verpedidos";
import Cookie from 'js-cookie';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opcionElegida: 0,

        };

        this.elegirOpcion = this.elegirOpcion.bind(this);
    }

    elegirOpcion(evt){
        const [id, nombre] = evt.target.name.split(':');
        this.setState({
            opcionElegida: id
        });
    }

    componentDidMount() {
        console.log("COOKIE", Cookie.get('tiendaauth'));
        localStorage.setItem('tiendauth', Cookie.get('tiendaauth'));
    }

    render() {
        return (
            <Layout elegirOpcionG={this.elegirOpcion}>
                {
                    this.state.opcionElegida === "1" && <IngresarProducto/>
                }

                {
                    this.state.opcionElegida === "2" && <VerProductos/>
                }

                {
                    this.state.opcionElegida === "3" && <RegistrarRepartidor/>
                }

                {
                    this.state.opcionElegida === "4" && <VerRepartidores/>
                }

                {
                    this.state.opcionElegida === "5" && <VerPedidos/>
                }
            </Layout>
        );
    }
}

export default Index;