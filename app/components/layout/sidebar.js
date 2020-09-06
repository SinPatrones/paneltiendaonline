import React, {Component} from 'react';

class Sidebar extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="row izquierda">
                <div className="col-md-2 bg-light menus">
                    {
                        this.props.nivelusuario === 1 &&
                        <div className="list-group">
                            <a href="#" className="list-group-item list-group-item-action active">
                                Panel
                            </a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="1:ingresarproducto">Ingresar Producto</a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="2:verproducto">Ver Productos</a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="6:categorias">Categorías</a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="3:registrarrepartidor">Registrar Personal</a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="4:verrepartidores">Ver Personal</a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="5:verpedidos">Ver Pedidos</a>
                        </div>
                    }

                    {
                        this.props.nivelusuario === 0 &&
                        <div className="list-group">
                            <a href="#" className="list-group-item list-group-item-action active">
                                Panel
                            </a>
                            <a className="list-group-item list-group-item-action" onClick={this.props.elegirOpcion} name="101:mispedidos">Mis Pedidos</a>
                        </div>
                    }


                    <div style={{display: 'none'}}>
                        <hr/>
                        <div className="list-group">
                            <a href="#" className="list-group-item list-group-item-action active">
                                Soporte
                            </a>
                            <a href="#" className="list-group-item list-group-item-action"><img
                                src="/images/phone.png"/> 959 370 922</a>
                            <a href="#" className="list-group-item list-group-item-action"><img src="/images/mail.png"/>contacto@dolarsol.com</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-10 contenido">

                    {this.props.contenido}

                </div>
            </div>
        );
    }
}

export default Sidebar;