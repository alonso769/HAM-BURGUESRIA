function cargarYMostrarOrden() {
    document.addEventListener('DOMContentLoaded', () => {
        const botonesOrdenar = document.querySelectorAll('.btn-ordenar');
        const ordenarContainer = document.getElementById('ordenar-container');
        const ordenarBackground = document.getElementById('ordenar-background');

        botonesOrdenar.forEach(boton => {
            boton.addEventListener('click', async (event) => {
                event.preventDefault(); // Evita la navegación predeterminada del enlace

                try {
                    const response = await fetch('ordenar.html');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const htmlOrden = await response.text();
                    ordenarContainer.innerHTML = htmlOrden;
                    ordenarContainer.classList.add('mostrar-ordenar');
                    ordenarBackground.classList.add('mostrar-ordenar');

                    // Agregar funcionalidad para cerrar la ventana de ordenar
                    const botonCerrar = ordenarContainer.querySelector('.cerrar-orden');
                    if (botonCerrar) {
                        botonCerrar.addEventListener('click', () => {
                            ordenarContainer.classList.remove('mostrar-ordenar');
                            ordenarBackground.classList.remove('mostrar-ordenar');
                            ordenarContainer.innerHTML = ''; // Limpiar el contenido al cerrar
                        });
                    } else {
                        // Si no hay botón de cerrar, podrías hacer que al hacer clic fuera se cierre
                        ordenarBackground.addEventListener('click', () => {
                            ordenarContainer.classList.remove('mostrar-ordenar');
                            ordenarBackground.classList.remove('mostrar-ordenar');
                            ordenarContainer.innerHTML = '';
                        });
                        // Evitar que el clic dentro del contenedor cierre la ventana inmediatamente
                        ordenarContainer.addEventListener('click', (e) => {
                            e.stopPropagation();
                        });
                    }

                    // Aquí podrías agregar más lógica si necesitas pasar información del producto
                    const productoSeleccionado = boton.dataset.producto;
                    console.log(`Producto seleccionado: ${productoSeleccionado}`);
                    // Puedes usar 'productoSeleccionado' para modificar el contenido de 'ordenar.html' dinámicamente si es necesario

                    // Funcionalidad para los botones de "más", "menos" y "agregar"
                    const botonesCantidad = ordenarContainer.querySelectorAll('.cantidad-btn');
                    const cantidadInput = ordenarContainer.querySelector('.cantidad-input');
                    const agregarBtn = ordenarContainer.querySelector('.agregar-btn');
                    const precioUnitario = 15.00; // El precio base de la hamburguesa doble

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

                    // Aquí podrías agregar la lógica para enviar el pedido
                    agregarBtn.addEventListener('click', () => {
                        const cantidad = parseInt(cantidadInput.value);
                        const opcionesSeleccionadas = Array.from(ordenarContainer.querySelectorAll('input[name="opcion"]:checked'))
                            .map(checkbox => checkbox.value);

                        console.log('Cantidad:', cantidad);
                        console.log('Opciones:', opcionesSeleccionadas);
                        alert('Pedido agregado al carrito (funcionalidad de envío no implementada).');
                        // Aquí iría tu código para enviar los datos del pedido al servidor
                    });

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

// Llama a la función para que se ejecute
cargarYMostrarOrden();
