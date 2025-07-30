function cargarYMostrarOrden() {
    document.addEventListener('DOMContentLoaded', () => {
        const botonesOrdenar = document.querySelectorAll('.btn-ordenar');
        const ordenarContainer = document.getElementById('ordenar-container');
        const ordenarBackground = document.getElementById('ordenar-background');

        botonesOrdenar.forEach(boton => {
            boton.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                    const responseOrdenar = await fetch('ordenar.html');
                    if (!responseOrdenar.ok) {
                        throw new Error(`HTTP error! status: ${responseOrdenar.status}`);
                    }
                    const htmlOrden = await responseOrdenar.text();
                    ordenarContainer.innerHTML = htmlOrden;
                    ordenarContainer.classList.add('mostrar-ordenar');
                    ordenarBackground.classList.add('mostrar-ordenar');

                    // Agregar funcionalidad para cerrar la ventana de ordenar
                    const botonCerrarOrden = ordenarContainer.querySelector('.cerrar-orden');
                    const cerrarBackgroundOrden = () => {
                        ordenarContainer.classList.remove('mostrar-ordenar');
                        ordenarBackground.classList.remove('mostrar-ordenar');
                        ordenarContainer.innerHTML = '';
                    };

                    if (botonCerrarOrden) {
                        botonCerrarOrden.addEventListener('click', cerrarBackgroundOrden);
                    } else {
                        ordenarBackground.addEventListener('click', cerrarBackgroundOrden);
                        ordenarContainer.addEventListener('click', (e) => {
                            e.stopPropagation();
                        });
                    }

                    // Lógica para el botón "Agregar" DENTRO de ordenar.html (cargado dinámicamente)
                    const agregarBtn = ordenarContainer.querySelector('.agregar-btn');
                    const cantidadInput = ordenarContainer.querySelector('.cantidad-input');
                    const botonesCantidad = ordenarContainer.querySelectorAll('.cantidad-btn');
                    const precioUnitario = 15.00;

                    if (agregarBtn && cantidadInput && botonesCantidad.length > 0) {
                        botonesCantidad.forEach(boton => {
                            boton.addEventListener('click', () => {
                                let cantidad = parseInt(cantidadInput.value);
                                if (boton.dataset.action === 'decrement' && cantidad > 1) {
                                    cantidad--;
                                } else if (boton.dataset.action === 'increment') {
                                    cantidad++;
                                }
                                cantidadInput.value = cantidad;
                                actualizarPrecio(cantidad);
                            });
                        });

                        cantidadInput.addEventListener('change', () => {
                            let cantidad = parseInt(cantidadInput.value);
                            if (isNaN(cantidad) || cantidad < 1) {
                                cantidad = 1;
                            }
                            cantidadInput.value = cantidad;
                            actualizarPrecio(cantidad);
                        });

                        function actualizarPrecio(cantidad) {
                            const precioTotal = precioUnitario * cantidad;
                            agregarBtn.textContent = `Agregar S/. ${precioTotal.toFixed(2)}`;
                        }

                        agregarBtn.addEventListener('click', () => {
                            const cantidad = parseInt(cantidadInput.value);
                            const opcionesSeleccionadas = Array.from(ordenarContainer.querySelectorAll('input[name="opcion"]:checked'))
                                .map(checkbox => checkbox.value);

                            console.log('Cantidad:', cantidad);
                            console.log('Opciones:', opcionesSeleccionadas);

                            // Ocultar la ventana de ordenar temporalmente
                            ordenarContainer.style.display = 'none';

                            // Crear el cuadro de confirmación dinámicamente
                            const confirmacionDiv = document.createElement('div');
                            confirmacionDiv.classList.add('confirmacion-pedido');
                            confirmacionDiv.innerHTML = `
                                <h3>Confirmación de Pedido</h3>
                                <p>Cantidad: ${cantidad}</p>
                                <p>Opciones: ${opcionesSeleccionadas.join(', ')}</p>
                                <button id="confirmar-pedido-btn">Confirmar Pedido</button>
                                <button id="cancelar-pedido-btn">Cancelar</button>
                            `;
                            ordenarContainer.appendChild(confirmacionDiv);

                            const confirmarPedidoBtn = document.getElementById('confirmar-pedido-btn');
                            const cancelarPedidoBtn = document.getElementById('cancelar-pedido-btn');

                            cancelarPedidoBtn.addEventListener('click', () => {
                                ordenarContainer.removeChild(confirmacionDiv);
                                ordenarContainer.style.display = 'block'; // Mostrar de nuevo la ventana de ordenar
                            });

                            confirmarPedidoBtn.addEventListener('click', () => {
                                ordenarContainer.removeChild(confirmacionDiv);

                                // Crear el cuadro de selección de medio de pago
                                const pagoDiv = document.createElement('div');
                                pagoDiv.classList.add('seleccion-pago');
                                pagoDiv.innerHTML = `
                                    <h3>Escoge tu medio de pago</h3>
                                    <button>Tarjeta de Crédito</button>
                                    <button>Tarjeta de Débito</button>
                                    <button>Efectivo</button>
                                    <button id="cancelar-pago-btn">Cancelar</button>
                                `;
                                ordenarContainer.appendChild(pagoDiv);

                                const cancelarPagoBtn = document.getElementById('cancelar-pago-btn');
                                cancelarPagoBtn.addEventListener('click', () => {
                                    ordenarContainer.removeChild(pagoDiv);
                                    ordenarContainer.style.display = 'block'; // Mostrar de nuevo la ventana de ordenar
                                });
                            });
                        });
                    }

                } catch (error) {
                    console.error('No se pudo cargar ordenar.html:', error);
                    ordenarContainer.innerHTML = '<p>Error al cargar la página de pedido.</p>';
                    ordenarContainer.classList.add('mostrar-ordenar');
                    ordenarBackground.classList.add('mostrar-ordenar');
                }
            });
        });
    });
}

cargarYMostrarOrden();