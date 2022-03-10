ajaxCallBack("brands.json", function(result){
    showBrands(result);
});

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