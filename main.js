window.onload = init;

function init() {
  /*const fullScreenControl = new ol.control.FullScreen();
  const mousePositionControl = new ol.control.MousePosition();
  const overViewMapControl = new ol.control.OverviewMap({
    collapsed: false,
    layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
  });
  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent();*/

  const map = new ol.Map({
    view: new ol.View({
      center: [-12080385, 7567433],
      zoom: 3,
      /*maxZoom: 12,
      minZoom: 2,
      rotation: 0,*/
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        zIndex: 1,
        visible: false,
        //extent: [],
      }),
    ],
    target: "js-map",
    /*keyboardEventTarget: document,
    controls: ol.control.defaults //ez megváltozott valamilyen körkörös hivatkozási probléma miatt dupla defaults kell
      .defaults()      .extend([        fullScreenControl,        mousePositionControl,
        overViewMapControl,
        scaleLineControl,
        zoomSliderControl,
        zoomToExtentControl,*/
  });
  const layerGroup = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        }),
        zIndex: 0,
        visible: false,
        opacity: 0.5,
      }),
      //Bing Maps
      new ol.layer.Tile({
        source: new ol.source.BingMaps({
          key: "Atuo1D-VVY8EkXkW_I6RZoyPnwPLUoIpK-Jau8Njf5tVvN4oQ93o1pFRK5QdjxIW",
          imagerySet: "Aerialwithlabels",
        }),
        visible: true,
      }),
    ],
  });
  map.addLayer(layerGroup);

  const cartoDbBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    }),
    visible: false,
  });

  map.addLayer(cartoDbBaseLayer);

  const tiledebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false,
  });
  map.addLayer(tiledebugLayer);

  const stamenLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg",
    }),
    visible: false,
  });
  map.addLayer(stamenLayer);

  map.on("click", function (e) {
    console.log(e.coordinate);
  });
  //map.addControl(fullScreenControl);
  //map.addControl(mousePositionControl);
  // map.addControl(overViewMapControl);
  /*const popupContainerElement = document.getElementById("popup-coordinates");
  const popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: "center-left",
    //autoPan: true,
  });
  map.addOverlay(popup);
  map.on("click", function (e) {
    console.log(e.coordinate);
    const clickedCoordinate = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContainerElement.innerHTML = clickedCoordinate;
  });
  //DragRotate interaction
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly,
  });
  map.addInteraction(dragRotateInteraction);
  const drawInteraction = new ol.interaction.Draw({
    type: "Polygon",
    freehand: false,
  });
  map.addInteraction(drawInteraction);

  drawInteraction.on("drawend", function (e) {
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeatures([e.feature]);
    console.log(drawnFeatures);
  });*/
}
