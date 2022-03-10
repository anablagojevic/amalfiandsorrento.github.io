var chosenBrand = false;
var chosenColor = false;
var chosenMaterial = false;
var filter = false;

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

