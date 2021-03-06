var mymap = L.map('main_map').setView([3.435101,-76.5199507,13], 13);

/*L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZWR1YXJkb3FiMjQiLCJhIjoiY2tmZTNzMDE0MDE2OTMzcXY3dmp1Y2c1MCJ9.aQvBNGTYIPEaC0Ul7pWIBQ'
}).addTo(mymap);*/

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    atributions: '&copy; <a href="https://www.opentreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

$.ajax({
    datatype: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion,{title: bici.id}).addTo(mymap);
        });
    }
})