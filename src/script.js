document.addEventListener('DOMContentLoaded',function(){
	addEvents();
	footer();

})

//variables
const section=document.querySelector("main .grid_cursos");
const tbody=document.querySelector("tbody");
const agregarTotal=document.querySelector("#agregar-total");
const listaCarrito=document.querySelector("#lista-carrito");
const emptyCart=document.querySelector("#vaciar-carrito");
const footerCart=document.querySelector(".footer");
const carrito=document.querySelector(".carrito");
const btnsAgregarCarrito=document.querySelectorAll(".agregar_carrito");
// const addToCart=document.querySelector('.add-to-cart');
// const addedToCart=document.querySelector('.added-to-cart');
// const cart=document.querySelector('.fa-cart-shopping');
// const bag=document.querySelector('.fa-bag-shopping');
let arrayCart=[];
//console.log(section)

//eventos
function addEvents(){
	section.addEventListener("click",findButtonCart);
	listaCarrito.addEventListener("click",deleteCourse);
	emptyCart.addEventListener("click",emptyCartTotal)
	arrayCart=JSON.parse(localStorage.getItem("course")) || [];
	addCart(arrayCart)

	const carrito = document.querySelector(".carrito");
    const carritoContenedor = document.querySelector(".carrito-contenedor");

    // Detectar clic en el carrito solo para dispositivos móviles
    if (window.innerWidth < 768) {
        carrito.addEventListener("click", (e) => {
			e.preventDefault();
            carritoContenedor.classList.toggle("mostrar");
			// console.log('diste click en el carrito');
			// console.log('Clase mostrar:', carritoContenedor.classList.contains('mostrar'));
			
        });

    }
	btnsAgregarCarrito.forEach(boton => {
		boton.addEventListener('click',()=>{
		boton.disabled=true; //desabilita el botton mientras la animacion se hace

		const addToCart = boton.querySelector('.add-to-cart'); //se le pone la referencia a cada boton
		const addedToCart = boton.querySelector('.added-to-cart');
		const cart = boton.querySelector('.fa-cart-shopping');
		const bag = boton.querySelector('.fa-bag-shopping');
		addedToCart.style.visibility = 'visible';
		addToCart.classList.add('add-to-cart-animation');
		addedToCart.classList.add('added-to-cart-animation');
		addedToCart.style.delay='1600ms';
		cart.style.animation='cart 2000ms ease-in-out forwards';
		bag.style.animation='bag 2000ms 700ms ease-in-out forwards';

		setTimeout(()=>{
			addToCart.classList.remove('add-to-cart-animation');
			addedToCart.classList.remove('added-to-cart-animation');
			addedToCart.style.visibility = 'hidden'; 
			// addedToCart.style.transition='1s';
			cart.style.animation='';
			bag.style.animation='';
		},2000);

		setTimeout(()=>{
			boton.disabled=false; //habilita el boton de nuevo
		},3000)
		})
	})
}

// funciones
function findButtonCart(e){
	e.preventDefault();
	const findClassCart=e.target.classList.contains("agregar_carrito");
	if (findClassCart) {
		const reference=e.target.parentElement.parentElement.parentElement;
		addDatesCart(reference);

	}
	
}

function deleteCourse(e){
	const deleteButton=e.target.classList.contains("eliminar-carrito")
	if(deleteButton){
		const id=e.target.dataset.id;
		// const deleteButton=arrayCart.map(cart=>{
		// 	if(cart.id !== id.toString()){
		// 		return `son diferentes`
		// 	}else{
		// 		return `no lo son`
		// 	}
		// })
		const deleteCarrito=arrayCart.filter(course=>course.id !== id.toString())
		arrayCart=[...deleteCarrito]; //lo agregamos para que no repita lo pasado por eso va asi
		revisarTotal(arrayCart);
		addCart(arrayCart);
	}
}

function emptyCartTotal(e){
	//console.log("diste click en el carrito");
	Swal.fire({
		title:"Advertencia",
		html:"Desea eliminar este paciente",
		icon:"warning",
		showCancelButton:true,
		confirmButtonColor:"rgba(30, 144, 255, 1)",
		confirmButtonText:"Aceptar",
		cancelButtonText:"Cancelar",
		width:"500px",
		//height:"500px",
		customClass:{
			popup:'custom-popup',
			title:'custom-title',
			confirmButton:'custom-button',
			content: 'custom-content'
		},
	  }).then(response=>{
		if(response.isConfirmed){
		  //eliminarPaciente(id); //si dices aceptar entonces hace esta funcion
		  arrayCart=[];
		  revisarTotal(arrayCart);
		  addCart(arrayCart)
		  Swal.fire({
			title:"Exito",
			html:"Se eliminaron los objetos agregados al carrito con exito",
			icon:"success",
			confirmButtonColor:"rgba(30, 144, 255, 1)",
			confirmButtonText:"OK",
			width:"500px",
		//height:"500px",
			customClass:{
			popup:'custom-popup',
			title:'custom-title',
			confirmButton:'custom-button',
			content: 'custom-content'
		},
		  })
		}
	  })
	//const isConfirm=confirm("Estas seguro que quieres vaciar el carrito");
	//console.log(isConfirm)
	//if(isConfirm){
	// 	arrayCart=[];
	// 	revisarTotal(arrayCart);
	// 	addCart(arrayCart)
	// }
}

function addDatesCart(reference){
	//console.log(reference)
	const objectCart={
		//id:Date.now(),
		img:reference.querySelector("img").src,
		title:reference.querySelector("h3").textContent,
		price:reference.querySelector(".precio .precio-original").textContent,
		quantity:1,
		id:reference.querySelector("a").getAttribute("data-id")
	}

	const existCart=arrayCart.findIndex(cart=>cart.id===objectCart.id);
	if(existCart >= 0){
		const addQuantity=arrayCart.map(curso=>{
			if(curso.id===objectCart.id && curso.quantity < 5){ //ahora revisa que coincidan esos id para incrementar y revisa que no agregue mas de 5 elementos
				curso.quantity++;
				return curso; //retorna el curso con el incremento
			}else{
				return curso; //returna el curso como esta de los otros lados
			}
		})
		arrayCart=[...addQuantity]
		//revisarTotal(arrayCart); //aqui si existe lo incremente
	
	}else{
		arrayCart=[...arrayCart,objectCart];
		//revisarTotal(arrayCart); //solo lo agrega de 
	}

	revisarTotal(arrayCart); //lo agrege ya sea nuevo o ya sea editado para incrementar
	addCart(arrayCart);
}

function addCart(array){
	// console.log(array)
	limpiarHTML();
	array.forEach(cart=>{
		const {id,img,title,price,quantity}=cart;
		const tr=document.createElement("tr");
		tr.innerHTML=` 
			<td><img src=${img} class="carrito-img" alt="imagen-carrito"></td>
	        <td>
	        	<p class="titulo-carrito">${title}</p>
	        </td>
	        <td>
	        <p class="precio-carrito" >$${price}</p>
	        </td>
	        <td>
	         <span class="decrease" onclick=dicrease(${id})> - </span>
	        	<span class="quantity">${quantity}</span> 	
	        <span class="increase" onclick=increase(${id})> + </span>
	       
	        </td>

	        <td>
	        	<p class="eliminar-carrito" data-id=${id}>X</p>
	        </td>
		`;
		tbody.appendChild(tr);
	})

	localStorageCourse();
}

function localStorageCourse(){
	localStorage.setItem("course",JSON.stringify(arrayCart))
}

function increase(id){
	id=id.toString()
	//const existe=arrayCart.some(item=>item.id===id)
	const increaseQuantity=arrayCart.map(item=>{
		if (item.id===id && item.quantity < 5) {
			item.quantity ++;
			return item;
		}else{
			return item; //retorna los demas objetos como estan sin modificar sin este marca error
		}
	})
	
	arrayCart=[...increaseQuantity];
	revisarTotal(increaseQuantity) //lo agregue para que en tiempo real lo incremente
	// console.log(increaseQuantity)
	addCart(increaseQuantity) //por ultimo lo hacemos que agrege cada vez mas el valor al html
}

function dicrease(id){
	id=id.toString()
	//const existe=arrayCart.some(item=>item.id===id)
	const increaseQuantity=arrayCart.map(item=>{
		if (item.id===id && item.quantity > 1) {
			item.quantity --;
			return item;
		}else{
			return item;
		}
	})
	
	arrayCart=[...increaseQuantity];
	revisarTotal(increaseQuantity) //igual aqui lo agregue para que lo decremente
	// console.log(increaseQuantity)
	addCart(increaseQuantity) //por ultimo lo hacemos que agrege cada vez mas el valor al html
}


function revisarTotal(array){
	//console.log(arrayCart)
	const existeParrafo=document.querySelector('.precio-curso');
	existeParrafo?.remove(); //si ya existe que elimine el anterior

	//const dato=array.map(curso=>curso.quantity);
	//console.log(dato)

	//const totalCart=arrayCart.reduce((total,curso)=>total + parseInt(curso.price),0)
	const totalCart=array.reduce((total,curso)=>total + (parseInt(curso.price)*curso.quantity),0)
	console.log(totalCart)
	const p=document.createElement("P")
	p.innerHTML=`Precio total de Los cursos:$ <span class="total">${totalCart}</span>`;
	p.classList.add("precio-curso");
	if(totalCart>0){
		agregarTotal.appendChild(p);
	}else{
		p.remove();
	}
}

function fecha(){
	return fech=new Date().getFullYear();
}


function footer(){
	const p=document.createElement("P");
	p.innerHTML=`Todos los derechos reservados &#169 ${fecha()}. Luis Alberto Lozano Rodriguez`;
	p.classList.add("footer-derechos");
	footerCart.appendChild(p)
}



function limpiarHTML(){
	while(tbody.firstChild){ //va en el tbody donde se agregan los datos
		tbody.removeChild(tbody.firstChild);
	}
}


// <p class="precio-curso">Precio total de Los cursos:</p>

/* animacion del boton*/
