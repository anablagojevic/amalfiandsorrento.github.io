console.log("First JS code line");

//ajax callBack function
function ajaxCallBack(filename, result){
    $.ajax({
        url: "assets/data/" + filename,
        method: "get",
        dataType: "json",
        success: result,
        error: function(jqXHR){
            let message = ''; 
            if (jqXHR.status == 0) { 
                message = 'The request was cancelled. Please verify your network'; 
            }
            else if (jqXHR.status == 404) {
                message = 'Requested page not found. [404]';
            }
            else if (jqXHR.status == 400){
                message = 'Server cannot or will not process the request due to something that is perceived to be a client error. [400]';
            }
            else if (jqXHR.status == 408){
                message = 'The server would like to shut down this unused connection. [408]';
            }
            else if (jqXHR.status == 500){
                message = 'Internal Server Error - The server encountered an unexpected condition that prevented it from fullfilling the request. [500]';
            }
            else if (jqXHR.status == 503){
                message = 'Service Unavailable - The server is not ready to handle the request. [503]';
            }
            else if (jqXHR.status == 504){
                message = 'Gateway Timeout - The server did not get a response in time from the upstream server that it needed in order to complete the request. [504].';
            }
            else{
                message = 'Uncaught Error!' + jqXHR.responseText;
            }
            confirm(message);
        }
    });
}

var chosenBrand = false;
var chosenColor = false;
var chosenMaterial = false;
var filter = false;

window.onload = function(){

    let url = window.location.pathname;

    //function for all pages
    ajaxCallBack("menu.json", function(result){
        showMenu(result);
    });

    //function for updating the number od products
    numberOfProducts();

    //functions for page index.html
    if(url == "/" || url == "/index.html"){

        ajaxCallBack("brands.json", function(result){
            showBrands(result);
        });
    }

    //functions for page shop.html
    if(url == "/" || url == "/shop.html"){

        //showing products and setting them to localeStorage
        ajaxCallBack("products.json", function(result){
            showProducts(result);
            setItemToLocalStorage("productsArray", result);
        });

        //calling the function for showing drop down list - brand names
        ajaxCallBack("brands.json", function(result){
            showDDL(result, "Filter by brand name", "brand");
        });

        //sending the parametars to filterFunction for filtering brands
        $(document).on("change", "#brand", function(){
            let idB = $(this).val();
            if(idB == 0){
                chosenBrand=false;
            }
            else{
                chosenBrand=true;
            }
            setItemToLocalStorage("brandC", idB);
            filterFunction(idB, "brand");
        });

        //calling the function for showing drop down list for price and function for sorting by price
        ajaxCallBack("sort.json", function(result){
            showDDL(result, "Sort by price", "sort");
            document.getElementById("sort").addEventListener("change", sortByPrice);
        });

        //sending the parametars to filterFunction for filtering colors
        $(document).on("change", "#sortColor", function(){
            let idC = $(this).val();
            if(idC == 0){
                chosenColor = false;
            }
            else{
                chosenColor = true;
            }
            setItemToLocalStorage("colorC", idC);
            filterFunction(idC, "color");
        });

        //calling the function for showing drop down list for sizes and function for sorting by size
        ajaxCallBack("sizes.json", function(result){
            showDDL(result, "Sort by size", "sortSize");
            document.getElementById("sortSize").addEventListener("change", sortBySize);
        });

        //calling the function for showing drop down list - material names
        ajaxCallBack("materials.json", function(result){
            showDDL(result, "Filter by material", "filterMaterial");
        });

        //sending the parametars to filterFunction for filtering materials
        $(document).on("change", "#filterMaterial", function(){
            let idM = $(this).val();
            if(idM == 0){
                chosenMaterial = false;
            }
            else{
                chosenMaterial = true;
            }
            setItemToLocalStorage("materialC", idM);
            filterFunction(idM, "material");
        });

        //calling the function for showing drop down list - color names
        ajaxCallBack("colors.json", function(result){
            showDDL(result, "Filter by color", "sortColor");
            setItemToLocalStorage("colorsArray", result);
        });
    }

    //functions for page contact.html
    if(url == "/" || url == "/contact.html"){

        //calling the function for showing information
        ajaxCallBack("contact.json", function(result){
            showContactInfo(result);
        });

        //calling the checking form function
        document.getElementById("send").addEventListener("click", formCheck);

    }

    //functions for page cart.html
    if(url == "/" || url == "/cart.html"){

        //checking if the cart is empty
        let cartProductsLS = getItemFromLocalStorage("cartProducts");

        if(cartProductsLS == null || cartProductsLS.length == 0){
            cartProducts();
        }
        else{
            displayProducts();
        }

        document.getElementById("remove2").addEventListener("click", removeAllProducts);
    }

    //functions for page buy.html
    if(url == "/" || url == "/buy.html"){

        //calling the function for checking the form when customer is buying a product
        document.getElementById("finish").addEventListener("click", formCheckForBuying);
    }
}
//function for showing menu
function showMenu(menuA){
    let meni = "";

    for(let i = 0; i < menuA.length; i++){
        meni += `<li class="nav-item"><a class="nav-link" href="${menuA[i].href}">${menuA[i].name}</a></li>`;
    }
    document.getElementById("menu").innerHTML = meni;
}
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
//function for adding product in cart
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

//function for showing brand names in cards
function showBrands(brands){
    let html = "";

    for(let i = 0; i < brands.length; i++){
        html += `<div class="col-lg-4 col-md-6 mb-3" id="brandModal">
                    <div class="card">
                        <img src="${brands[i].image.src}" class="card-img-top" alt="${brands[i].image.alt}"/>
                        <div class="card-body">
                            <h5 class="card-title">${brands[i].name}</h5>
                            <p class="card-text">
                            ${brands[i].description}
                            </p>
                        </div>
                    </div>
                </div>`;
    }
    document.getElementById("brands").innerHTML = html;
}

//function for showing products
function showProducts(products){
    let html = "";

    if(products.length == 0){
        html += `<p class="alert alert-danger mx-3 mt-5">There are no products according to the selected criteria</p>`;
    }
    else{
        for(let productObj of products){
            html += loadProducts(productObj);
        }
    }

    document.getElementById("products").innerHTML = html;

    $('.add-to-cart').click(addToCart);
}
//function for writing products
function loadProducts(products){
    return `<div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100">
                    <a href="#"><img class="card-img-top" src="${products.image.src}" alt="${products.image.alt}"></a>
                    <div class="card-body">
                        <h4 id="titleP" class="card-title">${products.title}</h4>
                        <h5>${showBrandName(products.brand, "brands.json")}</h5>
                        <h5 id="priceN">${products.price.activePrice}$</h5>
                        <s>${products.price.oldPrice}</s>
                        <p class="card-text text-danger">${productAvailability(products.availability)}</p>
                    </div>
                    <div class="card-footer">
                        <input data-id="${products.id}" id="btnAdd" class="btn btn-light border float-right add-to-cart" type="button" value="Add to cart"/>
                    </div>
                </div>
            </div>`;
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
//function for setting items in localStorage
function setItemToLocalStorage(name, data){
    return localStorage.setItem(name, JSON.stringify(data));
}
//function for getting items from localStorage
function getItemFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name));
}

//function for showing the number of products in cart
function numberOfProducts(){
    let productsLS = getItemFromLocalStorage("cartProducts");

    if(productsLS != null){
        let number = productsLS.length;
        document.getElementById("cartNumber").textContent = `${number}`;
    }
    else{
        document.getElementById("cartNumber").textContent = `0`;
    }
}
//function for availability of products
function productAvailability(availability){
    if(availability){
        return "";
    }
    return "Out of stock";
}

//code reuse function for showing drop down lists
function showDDL(result, selected, id){
    let html = `<option value="0" selected>${selected}</option>`;

    for(let i = 0; i < result.length; i++){
        html += `<option value="${result[i].id}">${result[i].name}</option>`;
    }
    document.getElementById(id).innerHTML = html;
}

//code reuse function for filtering products
function filterFunction(id, elName){

    filter = true;
    
    var productsLS = getItemFromLocalStorage("productsArray");
    var brand = getItemFromLocalStorage("brandC");
    var color = getItemFromLocalStorage("colorC");
    var material = getItemFromLocalStorage("materialC");

    if(chosenBrand == true){
        productsLS = productsLS.filter(objProduct => objProduct["brand"] == brand);
    }
    if(chosenColor == true){
        productsLS = productsLS.filter(objProduct => objProduct["color"] == color);
    }
    if(chosenMaterial == true){
        productsLS = productsLS.filter(objProduct => objProduct["material"] == material);
    }

    setItemToLocalStorage("filteredProducts", productsLS);
    
    showProducts(productsLS);
}

// sorting by price
function sortByPrice(){
    let type = this.value;

    var productsLS = getItemFromLocalStorage("productsArray");

    if(filter == true){
        productsLS = getItemFromLocalStorage("filteredProducts");
    }

    productsLS.sort(function(a, b){
        // price ascending
        if(type == 1){
            if(a.price.activePrice < b.price.activePrice){
                return -1;
            }
            else if(a.price.activePrice > b.price.activePrice){
                return 1;
            }
            else{
                return 0;
            }
        }

        // price descending
        else if(type == 2){
            if(a.price.activePrice > b.price.activePrice){
                return -1;
            }
            else if(a.price.activePrice < b.price.activePrice){
                return 1;
            }
            else{
                return 0;
            }
        }
        else{
            productsLS = getItemFromLocalStorage("productsArray");
        }
    })

    showProducts(productsLS);
}

//function for sorting by size
function sortBySize(){
    let type = this.value;

    var productsLS = getItemFromLocalStorage("productsArray");

    if(filter == true){
        productsLS = getItemFromLocalStorage("filteredProducts");
    }

    productsLS.sort(function(a, b){
        // first bigger
        if(type == 1){
            if(a.size < b.size){
                return -1;
            }
            else if(a.size > b.size){
                return 1;
            }
            else{
                return 0;
            }
        }

        // first smaller
        else if(type == 2){
            if(a.size > b.size){
                return -1;
            }
            else if(a.size < b.size){
                return 1;
            }
            else{
                return 0;
            }
        }
        else{
            productsLS = getItemFromLocalStorage("productsArray");
        }
    })

    showProducts(productsLS);
}

//function for showing contacts
function showContactInfo(contact){
    let html = `<h4 class="mb-4">Conctact info</h4>`;

    for(let i = 0; i < contact.length; i++){
        html += `<h6 class="mb-4"><img src="${contact[i].image.src}" alt="${contact[i].image.alt}"> ${contact[i].text}</h6>`;
    }
    document.getElementById("contactInfo").innerHTML = html;
}

//function for checking form for sending message
function formCheck(){
    var mistakes = 0;

    //checking full name
    var nameSurname = document.getElementById("fullName");
    var reNameSurname=/^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,14}(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{2,19})+$/;

    if((!reNameSurname.test(nameSurname.value)) || (nameSurname.value.length == 0)){
        nameSurname.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        nameSurname.nextElementSibling.classList.remove("show");
    }
    
    //checking email
    var mail = document.getElementById("mail");
    var reMail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if(!reMail.test(mail.value)){
        mail.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        mail.nextElementSibling.classList.remove("show");
    }

    //checking dropdown list
    let dd1 = document.getElementById("subject");

    if(dd1.options.selectedIndex == 0) {
        dd1.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else {
        dd1.nextElementSibling.classList.remove("show");
    }

    // checking textarea - NE RADI
    let textarea = document.getElementById("exampleFormControlTextarea1");
    if(textarea.value == ""){
        textarea.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        textarea.nextElementSibling.classList.remove("show");
    }

    //provera broja gresaka
    if(mistakes == 0){
        document.getElementById("spanS").textContent = "Message successfully sent!";
    }
    else{
        document.getElementById("spanS").textContent = "Please fill in the blanks";
    }
}

//function for checking form for buying product
function formCheckForBuying(){
    mistakes = 0;

    //checking email
    var mail = document.getElementById("email");
    var reMail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if(!reMail.test(mail.value)){
        mail.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        mail.nextElementSibling.classList.remove("show");
    }

    //checking the address
    var address = document.getElementById("address");
    var reAddress = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,14}(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{3,19})\s[1-9a-z]{1,4}$/;
    if((!reAddress.test(address.value)) || (address.value.length == 0)){
        address.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        address.nextElementSibling.classList.remove("show");
    }

    //checking the phone number
    var phone = document.getElementById("phoneNumber");
    var rePhone = /^[+][0-9]{2,3}[0-9]{8,11}$/;
    if((!rePhone.test(phone.value)) || (phone.value.length == 0)){
        phone.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        phone.nextElementSibling.classList.remove("show");
    }

    //provera broja gresaka
    if(mistakes == 0){
        document.getElementById("spanS").textContent = "You have successfully completed your purchase! Thank you! We will contact you soon.";
        document.getElementById("goBack").innerHTML = `Go back to our <a href="shop.html">shop</a>`;
        removeAllProducts();
    }
    else{
        document.getElementById("spanS").textContent = "Please provide us with all the required information";
    }
}

