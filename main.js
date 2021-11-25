window.onload = init;

function init() {
    const map = new ol.Map({
        view: new ol.View({
            center:[2225577.5391289764, 6460194.27288314],
            zoom: 15,
            minZoom: 3,
            maxZoom: 20,
            rotation: 0//in radians
        }),
        target: "js-map"
    });

    //Layers
    const openStreetMap = new ol.layer.Tile ({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OSMStandard'
    });

    const stamenWatercolor = new ol.layer.Tile ({
        source: new ol.source.XYZ({
            url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
            attributions: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA'
        }),
        visible: true,
        title: 'StamenWatercolor'
    });


    const openStreetMapHumanitarian = new ol.layer.Tile ({
        source: new ol.source.OSM({
            url: 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            visible: false,
            title: 'OSMHumanitarian'
        })
    })

    //Grouping layers
    const layerGroup = new ol.layer.Group({
        layers: [openStreetMap, stamenWatercolor, openStreetMapHumanitarian]
    })
    map.addLayer(layerGroup);

    //switcher
    const layersElements = document.querySelectorAll('.sidebar > input[type=radio]');
    for (layer of layersElements) {
        layer.addEventListener('change', function() {
            let layerValue = this.value;
            layerGroup.getLayers().forEach(function(el,index,arr){
                let layerTitle = el.get('title');
                el.setVisible(layerTitle === layerValue);
            })
        })
    }

    //Vector Layers
    const fillStyle = new ol.style.Fill ({
        color: [85, 115, 255, 1]
    });

    const strokeStyle = new ol.style.Stroke ({
        color: [40, 15, 1, 1],
        width: 1.2
    });

    const circleStyle = new ol.style.Circle ({
        fill: new ol.style.Fill({
           color: [222, 57, 10, 1] 
        }),
        radious: 8,
        stroke: strokeStyle
    });

    const PLHutaGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './libs/vector_data/vector_huta.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'PLHutaGeoJSON',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            circle: circleStyle
        })
    })

    map.addLayer(PLHutaGeoJSON)

  //Vector layer popup
    const popupContainerEl = document.querySelector('.popup-container');
    const popupLayer = new ol.Overlay({
        element: popupContainerEl
    })
    map.addOverlay(popupLayer);
    const popupFeatureName = document.getElementById('feature-name')
    const popupFeatureAdditionalInfor = document.getElementById('feature-additional-info');
 
  map.on('click', function(e){
    popupLayer.setPosition(undefined);
      map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
          let clickedCoordinate = e.coordinate;
          let clickedFeatureName = feature.get('name');
          let clickedFeatureAdditionalInfo = feature.get('additional information');
          popupLayer.setPosition(clickedCoordinate);
          popupFeatureName.innerHTML = clickedFeatureName;
          popupFeatureAdditionalInfor.innerHTML = clickedFeatureAdditionalInfo;
      })
  })


    map.on('click', e => console.log(e.coordinate))
};