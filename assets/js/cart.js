//checking if the cart is empty
let cartProductsLS = getItemFromLocalStorage("cartProducts");

if(cartProductsLS == null || cartProductsLS.length == 0){
    cartProducts();
}
else{
    displayProducts();
}

document.getElementById("remove2").addEventListener("click", removeAllProducts);

function cartProducts(){
    let html = `<div class="col-12">
                    <h2 class="text-center font-weight-light">
                        Your cart is empty!
                        Visit our <a href="shop.html" class="text-decoration-none text-secondary">shop</a> to add some products!
                    </h2>
                </div>`;
    document.getElementById("empty").innerHTML = html;
    document.getElementById("totalPrice").innerHTML = "";
}

function addToCart(){
    let id = $(this).data('id');
    var cartProducts = getItemFromLocalStorage("cartProducts");

    if(cartProducts){
        if(productIsAlreadyInCart()){
            updateQuantity();
            $(this).val("Added to cart");
        }
        else{
            addToLocaleStorage();
            numberOfProducts();
            $(this).val("Added to cart");
        }
    }
    else{
        addFirstItemToCart();
        numberOfProducts();
        $(this).val("Added to cart");
    }

    //function for adding product in the cart
    function addFirstItemToCart(){
        let products = [];
        products[0] = {
            id : id,
            quantity : 1
        };
        setItemToLocalStorage("cartProducts", products);
    }

    //function for checking if the product is already in the cart
    function productIsAlreadyInCart(){
        return cartProducts.filter(p => p.id == id).length;
    }

    //function for updating quantity of products
    function updateQuantity(){
        let productsLS = getItemFromLocalStorage("cartProducts");

        for(let i = 0; i < productsLS.length; i++){
            if(productsLS[i].id == id){
                productsLS[i].quantity++;
                break;
            }
        }

        setItemToLocalStorage("cartProducts", productsLS);
    }

    //function for adding new item in localStorage that currently doesn't exist
    function addToLocaleStorage(){
        let productsLS = getItemFromLocalStorage("cartProducts");
        productsLS.push({
            id : id,
            quantity : 1
        });
        setItemToLocalStorage("cartProducts", productsLS);
    }
}

//function for displaying products added to cart
function displayProducts(){
    let productsLS = getItemFromLocalStorage("productsArray");

    let chartItemsLS = getItemFromLocalStorage("cartProducts");

    let boughtProduct = [];

    boughtProduct = productsLS.filter(p => {
        for(let item of chartItemsLS){
            if(p.id == item.id){
                p.quantity = item.quantity;
                return true;
            }
        }
        return false;
    });

    displayBoughtProducts(boughtProduct);
}

//function for creating div where bought products are going to be displayed
function displayBoughtProducts(boughtProducts){
    console.log(boughtProducts);
    let html = "";
    let div = "";
    let price = 0;
    for(let product of boughtProducts){
        html += `<div class="col-12">
                    <div class="card mb-3">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${product.image.src}" class="card-img" alt="${product.image.alt}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body mt-5">
                                    <h4 class="card-title mt-2">${product.title}</h4>
                                    <h6 class="card-text mt-3">Brand name: ${showBrandName(product.brand, "brands.json")}</h6>
                                    <h6 class="card-text mt-3">Price per item: ${product.price.activePrice}$</h6>
                                    <h6 class="card-text mt-3">Quantity: ${product.quantity}</h6>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button type="button" id="remove1" onClick="removeProduct(${product.id})" class="btn btn-light border float-right ml-3">Remove</button>
                            <h6 class="float-right mt-2">Total price: ${product.price.activePrice * product.quantity}$</h6>
                        </div>
                    </div>
                </div>`;
    }
    for(let product of boughtProducts){
        price += product.price.activePrice * product.quantity;
    }
    div += `<div class="col-12 float-right">
                <button type="button" id="remove2" class="btn btn-light border float-right ml-3">Clear cart</button>
                <a href="buy.html"><button type="button" class="btn btn-light border float-right ml-3">Buy</button></a>
                <h5 class="float-right mt-2">Total price: ${price}$</h5>
            </div>`;

    document.getElementById("empty").innerHTML = html;
    document.getElementById("totalPrice").innerHTML = div;
}

//function for removing a product from cart
function removeProduct(id){
    let cartProducts = getItemFromLocalStorage("cartProducts");
    let unremovedProducts = cartProducts.filter(p => p.id != id);
    setItemToLocalStorage("cartProducts", unremovedProducts);
    let products = getItemFromLocalStorage("cartProducts");
    console.log(products.length)
    if(products.length == 0){
    let html = `<div class="col-12">
                <h2 class="text-center font-weight-light">
                    Your cart is empty!
                    Visit our <a href="shop.html" class="text-decoration-none text-secondary">shop</a> to add some products!
                </h2>
            </div>`;
    document.getElementById("empty").innerHTML = html;
    document.getElementById("totalPrice").innerHTML = "";
    }
    else{
        displayProducts();
    }
    numberOfProducts();
}

function removeAllProducts(){
    localStorage.removeItem("cartProducts");
    let html = `<div class="col-12">
                <h2 class="text-center font-weight-light">
                    Your cart is empty!
                    Visit our <a href="shop.html" class="text-decoration-none text-secondary">shop</a> to add some products!
                </h2>
            </div>`;
    document.getElementById("empty").innerHTML = html;
    document.getElementById("totalPrice").innerHTML = "";
    numberOfProducts();
}

//function for showing brand names on shop.html page
function showBrandName(id, file){

    ajaxCallBack(file, function(result){

        setItemToLocalStorage("brandNameArray", result);
    })

    let brandArray = getItemFromLocalStorage("brandNameArray");
    
    let brandName = "";

    for(let object of brandArray){
        if(object.id == id){
            brandName = object.name;
        }
    }
    return brandName;
}