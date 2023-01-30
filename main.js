const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('#menu-icon');
const productosSeccion = document.querySelector('#productos');
const cartIcon = document.querySelector('#cart-icon');
const favIcon = document.querySelector('#fav-icon');
const favSeccion = document.querySelector('.fav-content');
const cartVSeccion = document.querySelector('.cart-v-content');
const cartVFooter = document.querySelector('.cart-v-footer');
const favFooter = document.querySelector('.fav-footer');

window.onscroll = () => {
    if(window.scrollY > 0){
        document.querySelector('nav').classList.add('active');
    } else {
        document.querySelector('nav').classList.remove('active');
    }
}
console.log(cartIcon);


cartIcon.addEventListener('click', () => {
    document.querySelector('.cart-view').classList.add('active-view');
});

favIcon.addEventListener('click', () => {
    document.querySelector('.fav').classList.add('active-fav');
});

document.querySelector('.close-cart').addEventListener('click', () => {
    document.querySelector('.cart-view').classList.remove('active-view');

})

document.querySelector('.close-fav').addEventListener('click', () => {
    document.querySelector('.fav').classList.remove('active-fav');

})

document.addEventListener('DOMContentLoaded', function(){
    productosJSON();
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        crearCarrito();
    }

    if(localStorage.getItem('favorito')){
        favorito = JSON.parse(localStorage.getItem('favorito'));
        crearFavorito();
    }

    crearFooter();

})

async function productosJSON(){
    const response = await fetch('../data/productos.json');
    const names = await response.json();
    let productos = names.productos;
    console.log(names.productos);

    for(const producto of productos){
                    productosSeccion.innerHTML += `<div class="producto">
                                                    <div class="prod-icons">
                                                        <i class="fa-solid fa-heart btnfav" id="fav${producto.id}" data-id="${producto.id}"></i>
                                                        <i class="fa-solid fa-bag-shopping btn-add" id="btn${producto.id}" data-id="${producto.id}"></i>
                                                    </div>
                                                    <div class="prod-img">
                                                        <img src="${producto.imgsrc}" alt="">
                                                    </div>
                                                    <span class="prod-name">${producto.nombre}</span>
                                                    <span class="precio">$<span class="prod-precio">${producto.precio}</span></span>
                                                </div>`;
    }
}

document.querySelector('.fav-content').addEventListener('click', e =>{
    addFavCarrito(e);
    activarRemoveFav(e);
})

productosSeccion.addEventListener('click', e => {
    addCarrito(e);
    addFavorito(e);
});

cartVSeccion.addEventListener('click', e => {
    activarBotones(e);
})

let carrito = {};

let favorito = {};

function addFavCarrito(e){
    if(e.target.classList.contains('fav-add')){
        setCarrito(e.target.parentElement);
    }

    e.stopPropagation();
}

function addCarrito(e){
    if(e.target.classList.contains('btn-add')){
        setCarrito(e.target.parentElement.parentElement);
    }

    e.stopPropagation();
}

function addFavorito(e){
    if(e.target.classList.contains('btnfav')){
        setFavorito(e.target.parentElement.parentElement);
    }

    e.stopPropagation();
}

function setFavorito(objeto){
    // console.log(objeto);
    
    const producto = {
        id : objeto.querySelector('.btn-add').dataset.id,
        nombre : objeto.querySelector('.prod-name').textContent,
        precio : objeto.querySelector('.prod-precio').textContent,
        imgsrc : objeto.querySelector('.prod-img img').getAttribute("src"),
        cantidad : 1
    }

    if(favorito.hasOwnProperty(producto.id)){
        producto.cantidad = favorito[producto.id].cantidad + 1;
    }

    favorito[producto.id] = {...producto};

    // console.log(producto);
    // console.log(favorito);
    
    crearFavorito();
    crearFavFooter();


}



function setCarrito(objeto){
    // console.log(objeto);
    
    const producto = {
        id : objeto.querySelector('.btn-add').dataset.id,
        nombre : objeto.querySelector('.prod-name').textContent,
        precio : objeto.querySelector('.prod-precio').textContent,
        imgsrc : objeto.querySelector('.prod-img img').getAttribute("src"),
        cantidad : 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto};

    // console.log(producto);
    // console.log(carrito);
    
    crearCarrito();
    crearFooter();

}

function crearFavorito(){


    favSeccion.innerHTML = '';

    Object.values(favorito).forEach(producto => {
        let subtotal = producto.precio * producto.cantidad;
        favSeccion.innerHTML += `
                                    <div class="fav-item">
                                    <div class="fav-img prod-img">
                                        <img src="${producto.imgsrc}" alt="">
                                    </div>
                                    <div class="fav-info">
                                        <p class="prod-name">${producto.nombre}</p>
                                        <div class="fav-precio">
                                            $<span class="prod-precio">${producto.precio}</span>
                                        </div>
                                        <span data-id="${producto.id}" class= 'remove fav-remove'>remove</span>
                                    </div>
                                    <span class="fav-add btn-add" data-id="${producto.id}">Agregar al carrito</span>
                                </div>
                                `;
    })

    crearFavFooter();

    localStorage.setItem('favorito', JSON.stringify(favorito));

}


function crearCarrito(){
    cartVSeccion.innerHTML = '';

    Object.values(carrito).forEach(producto => {
        let subtotal = producto.precio * producto.cantidad;
        cartVSeccion.innerHTML += `
                                    <div class="cart-v-item">
                                        <div class="cart-v-img">
                                            <img src="${producto.imgsrc}" alt="">
                                        </div>
                                        <div class="cart-v-info">
                                            <p>${producto.nombre}</p>
                                            <div class="cantidad">
                                                <i class="fa-solid fa-plus" data-id="${producto.id}"></i>
                                                <span>
                                                    ${producto.cantidad}
                                                </span>
                                                <i class="fa-solid fa-minus" data-id="${producto.id}"></i>
                                            </div>
                                            <span data-id="${producto.id}" class= 'remove'>remove</span>
                                        </div>
                                        <div class="item-precio">
                                            $<span>${subtotal}</span>
                                        </div>
                                    </div>
                                `;
    })

    crearFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function crearFavFooter(){
    favFooter.innerHTML = '';

    if(Object.keys(favorito).length === 0){
        favSeccion.innerHTML += `<p class="fav-p">No se encuentran productos en favoritos.</p>`;
        return
    }
}

function crearFooter(){
    cartVFooter.innerHTML = '';

    if(Object.keys(carrito).length === 0){
        cartVFooter.innerHTML += `<p>Su carrito actualmente está vacío.</p>`;
        return
    }

    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad*precio, 0);

    cartVFooter.innerHTML += `
                    <div class="cart-v-sub">
                        <p>Subtotal:</p>
                        <p>$<span>${nPrecio}</span></p>
                    </div>
                    <div class="cart-v-btns">
                        <a href="#">ver carrito</a>
                        <a href="#">finalizar compra</a>
                    </div>
                    `;
}


function activarRemoveFav(e){
    if(e.target.classList.contains('remove')){
        const producto = favorito[e.target.dataset.id];
        delete favorito[e.target.dataset.id];

        crearFavorito();
    }

    e.stopPropagation();
}
function activarBotones(e){
    if(e.target.classList.contains('fa-plus')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        carrito[e.target.dataset.id] = {...producto};

        crearCarrito();
    }

    if(e.target.classList.contains('fa-minus')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;

        if(producto.cantidad == 0){
            delete carrito[e.target.dataset.id];
        }

        crearCarrito();
    }

    if(e.target.classList.contains('remove')){
        const producto = carrito[e.target.dataset.id];
        delete carrito[e.target.dataset.id];

        crearCarrito();
    }

    e.stopPropagation();
}

let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.add('login-active');
    // navbar.classList.remove('active');
    // menu.classList.remove('fa-times');

}

document.querySelector('#close-login').onclick = () => {
    loginForm.classList.remove('login-active');
}

document.querySelector('.fa-th').addEventListener('click', () => {
    productosSeccion.style.flexDirection = "row";
})

document.querySelector('.fa-list').addEventListener('click', () => {
    productosSeccion.style.flexDirection = "column";
})