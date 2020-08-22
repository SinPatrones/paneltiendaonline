import React, {Component} from 'react';
import Navbar from "./navbar";
import Sidebar from "./sidebar";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nivelusuario: null
        };

        this.fetchNivelUsuario = this.fetchNivelUsuario.bind(this);
    }

    fetchNivelUsuario(){
        fetch(
            '/api/administrador/nivel',{
                method: 'get',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('tiendauth')
                }
            }
        )
            .then(res => res.json())
            .then(datos => {
                this.setState({
                    nivelusuario: datos.data.role
                });
            });
    }

    componentDidMount() {
        this.fetchNivelUsuario();
    }

    render() {
        return (
            <React.Fragment>
                <Navbar nivelusuario={this.state.nivelusuario} elegirOpcion={this.props.elegirOpcionG} />

                <Sidebar nivelusuario={this.state.nivelusuario} contenido={this.props.children} elegirOpcion={this.props.elegirOpcionG}/>

            </React.Fragment>
        );
    }
}

export default Index;