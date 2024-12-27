window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [-12080385, 7567433],
      zoom: 3,
      maxZoom: 12,
      minZoom: 2,
      rotation: 0.5,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "js-map",
  });
  const popupContainerElement = document.getElementById("popup-coordinates");
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
}
