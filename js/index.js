const contenedorProductos = document.getElementById("contenedor-productos");

const contenedorCarrito = document.getElementById("carrito-contenedor");

const botonVaciar = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotal = document.getElementById("precioTotal");
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
	if (localStorage.getItem("carrito")) {
		carrito = JSON.parse(localStorage.getItem("carrito"));
		actualizarCarrito();
	}
});

botonVaciar.addEventListener("click", () => {
	carrito.length = 0;
	Swal.fire({
		position: "center",
		icon: "error",
		title: "Carrito vacio",
		showConfirmButton: false,
		timer: 1500,
		timerProgressBar: 3000,
		allowOutsideClick: true,
		allowEscapeKey: true,
		allowEnterKey: true,
		stopKeydownPropagation: false,
	});
	actualizarCarrito();
});

// generar el DOM de todos los productos

fetch("../js/stock.json")
	.then((resp) => resp.json())
	.then((data) => {
		stock = data;

		data.forEach((card) => {
			const div = document.createElement("div");
			div.classList.add("card");
			div.innerHTML = `
						<div class="card-content">
						<img src=${card.img} alt="">
							<div class="card-body">
								<h3 class="card-title">$ ${card.precio}</h3>
								<h3>${card.nombre}</h3>
								<p class="card-text">${card.desc}</p>
								<a href="#" id="agregar${card.id}" class="boton btn-agregar">Agregar <i class="fas      fa-shopping-cart"></i></a>
								<a href="#" class="boton btn-detalles">Detalles</a>
							</div>
						</div>
						`;

			contenedorProductos.appendChild(div);

			const boton = document.getElementById(`agregar${card.id}`);

			boton.addEventListener("click", () => {
				agregarAlCarrito(card.id);
			});
		});
	});

const agregarAlCarrito = (cardId) => {
	const existe = carrito.some((card) => card.id === cardId);

	if (existe) {
		const card = carrito.map((card) => {
			if (card.id === cardId) {
				card.cantidad++;
			}
		});
	} else {
		const item = stockProductos.find((card) => card.id === cardId);
		carrito.push(item);
	}
	Swal.fire({
		position: "center",
		icon: "success",
		title: "Producto agregado al carrito",
		showConfirmButton: false,
		timer: 2000,
		timerProgressBar: 3000,
		allowOutsideClick: true,
		allowEscapeKey: true,
		allowEnterKey: true,
		stopKeydownPropagation: false,
	});
	actualizarCarrito();
};

const eliminarDelCarrito = (cardId) => {
	const item = carrito.find((card) => card.id === cardId);
	const indice = carrito.indexOf(item);
	carrito.splice(indice, 1);
	actualizarCarrito();
};

const actualizarCarrito = () => {
	contenedorCarrito.innerHTML = "";
	carrito.forEach((card) => {
		const div = document.createElement("div");
		div.className = "productoEnCarrito";
		div.innerHTML = `
        <p>${card.nombre}</p>
        <p>Precio: ${card.precio}</p>
        <p>Cantidad: <span id="cantidad">${card.cantidad}</span></p>
         <button onclick = "eliminarDelCarrito(${card.id})" class="boton-eliminar"><i class="fas fa-trash-alt"</button>
        `;

		contenedorCarrito.appendChild(div);

		localStorage.setItem("carrito", JSON.stringify(carrito));
	});
	contadorCarrito.innerText = carrito.length;
	precioTotal.innerText = carrito.reduce(
		(acc, card) => acc + card.cantidad * card.precio,
		0
	);
};
