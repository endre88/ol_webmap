window.onload = init;

function init() {
  proj4.defs(
    "EPSG:23700",
    "+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +units=m +no_defs"
  );
  ol.proj.proj4.register(proj4);
  /*const fullScreenControl = new ol.control.FullScreen();
  const mousePositionControl = new ol.control.MousePosition();
  const overViewMapControl = new ol.control.OverviewMap({
    collapsed: false,
    layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
  });
  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent();*/
  let extent = ol.proj.transformExtent(
    [21.450936, 47.383822, 21.850891, 47.63821],
    "EPSG:4326",
    "EPSG:3857"
  );
  let center = ol.proj.transform(
    [19.050914, 47.511016],
    "EPSG:4326",
    "EPSG:3857"
  );
  const map = new ol.Map({
    view: new ol.View({
      //center: [-12080385, 7567433],
      zoom: 12,
      projection: "EPSG:3857",
      center: center,
      /*maxZoom: 12,
      minZoom: 2,
      rotation: 0,*/
    }),
    target: "js-map",
    /*keyboardEventTarget: document,
    controls: ol.control.defaults //ez megváltozott valamilyen körkörös hivatkozási probléma miatt dupla defaults kell
      .defaults()      .extend([        fullScreenControl,        mousePositionControl,
        overViewMapControl,
        scaleLineControl,
        zoomSliderControl,
        zoomToExtentControl,*/
  });

  //Base Layers
  // 1. OSM Standard
  const openstreetmapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: "OSMStandard",
  });

  // 2. OSM Humanitarian
  const openstreemaphumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    }),
    visible: false,
    title: "OSMHumanitarian",
  });

  // 3. Bing Maps
  const BingMaps = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "Atuo1D-VVY8EkXkW_I6RZoyPnwPLUoIpK-Jau8Njf5tVvN4oQ93o1pFRK5QdjxIW",
      imagerySet: "Aerialwithlabels",
    }),
    visible: false,
    title: "BingMaps",
  });

  // 4. Cartodb Base Layer
  const cartoDbBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    }),
    visible: false,
    title: "CartoDbBaseLayer",
  });

  //Base vector layers
  //Vector tile layers openstreetmap

  const openstreetmapVectorTile = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      url: "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=AWQe57TePncXgDmGmTJ5",
      format: new ol.format.MVT(),
      attributions:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
    }),
    visible: false,
    title: "OpenStreetMapVectorTile",
  });

  const opensteetmapvectorstyle =
    "https://api.maptiler.com/maps/c1aec2a4-2f40-48ac-a369-f3bab3e8d444/style.json?key=AWQe57TePncXgDmGmTJ5";
  //olms.apply(map, opensteetmapvectorstyle);

  //Base Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openstreetmapStandard,
      openstreemaphumanitarian,
      BingMaps,
      cartoDbBaseLayer,
      openstreetmapVectorTile,
    ],
  });

  map.addLayer(baseLayerGroup);
  //Layer Switcher Logic for Base Layers
  const baseLayerElements = document.querySelectorAll(
    ".sidebar > input[type=radio]"
  );
  //console.log(baseLayerElements);
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener("change", function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerTitle = element.get("title");
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });
  }

  //Layers
  // 1. ÚjbudaLayer

  const ujbudalayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: "https://terinfo.ujbuda.hu/mapproxy/service?",
      params: {
        LAYERS: "orto_2023",
        FORMAT: "image/png",
        TRANSPARENT: true,
      },
      attributions: "Újbuda",
    }),
    title: "UjbudaLayer",
    visible: false,
    //archiv_1963_0076_2827, orto_2023, osm-eov, OSM_BPXI_20161024 ez a rész a fontos a WMS rétegek hozzáadásakor, itt van egy korábbi állapot EOV-ban is az OSM-ről.
  });

  // 2. ÚjbudaLayer

  const budalayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: "https://terinfo.ujbuda.hu/mapproxy/service?",
      params: {
        LAYERS: "osm-eov",
        FORMAT: "image/png",
        TRANSPARENT: true,
      },
      attributions: "osm",
      //archiv_1963_0076_2827, orto_2023, osm-eov, OSM_BPXI_20161024 ez a rész a fontos a WMS rétegek hozzáadásakor, itt van egy korábbi állapot EOV-ban is az OSM-ről.
    }),
    title: "budaLayer",
    visible: false,
  });

  // 3. TileDebub Layer
  const tiledebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false,
    title: "TileDebug",
  });

  //Vector Layers
  //Central EU Countries geojson vector layer
  /*const EUCountriesGeoJSON = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "./data/vector_data/Central_EU_Countries.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
  });*/

  const EUCountriesGeoJSONVI = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "./data/vector_data/Central_EU_Countries.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: false,
    title: "EUCountriesGeoJSONVI",
  });

  const VectorSource = new ol.source.Vector({
    url: "https://raw.githubusercontent.com/endre88/gyak/refs/heads/master/E-kozmu_polygonok.geojson",
    format: new ol.format.GeoJSON(),
    projection: "EPSG:23700",
  });

  const ekozmu = new ol.layer.Vector({
    source: VectorSource,
    visible: true,
    title: "Ekozmu",
  });
  //map.addLayer(EUCountriesGeoJSONVI);

  //Raster Tile Layer Group
  const rasteTileLayerGroup = new ol.layer.Group({
    layers: [
      ujbudalayer,
      budalayer,
      tiledebugLayer,
      EUCountriesGeoJSONVI,
      ekozmu,
    ],
  });

  map.addLayer(rasteTileLayerGroup);

  //Layer Switcher Logic for Layers
  const tileRasterLayerElements = document.querySelectorAll(
    ".sidebar > input[type=checkbox]"
  );
  //console.log(tileRasterLayerElements);
  for (let tileRasterLayerElement of tileRasterLayerElements) {
    tileRasterLayerElement.addEventListener("change", function () {
      let tileRasterLayerElementValue = this.value;
      let tileRasterLayer;
      rasteTileLayerGroup.getLayers().forEach(function (element, index, array) {
        if (tileRasterLayerElementValue === element.get("title")) {
          tileRasterLayer = element;
        }
      });
      this.checked
        ? tileRasterLayer.setVisible(true)
        : tileRasterLayer.setVisible(false);
    });
  }

  /*const envimap = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://tileserver8.envimap.hu/2023_Debrecen_20/{z}/{x}/{y}",
    }),
    visible: false,
    extent: extent,
  });
  map.addLayer(envimap);*/

  map.on("click", function (e) {
    console.log(e.coordinate);
  });

  //BKM-be
  let select = new ol.interaction.Select();
  map.addInteraction(select);
  let selectedFeatures = select.getFeatures();
  // a DragBox interaction used to select features by drawing boxes
  let dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.shiftKeyOnly,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 0, 255, 1],
      }),
    }),
  });
  map.addInteraction(dragBox);
  let infoBox = document.getElementById("info");
  dragBox.on("boxend", function (e) {
    // features that intersect the box are added to the collection of
    // selected features, and their names are displayed in the "info"
    // div
    let info = [];
    let infok = "";
    let extent = dragBox.getGeometry().getExtent();
    VectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
      selectedFeatures.push(feature);
      /*info.push(
        "Kérelem: ",
        feature.get("ugyszam"),
        "Tárgy: ",
        feature.get("targy")
      );*/
      infok += "Kérelem: " + feature.get("ugyszam") + "<br>";
      infok += " Tárgy: " + feature.get("targy") + " <br> <br>";
    });
    /*if (info.length > 0) {
      infoBox.innerHTML = info.join(", ");
    }*/
    console.log(info);
    console.log(infok);
    infoBox.innerHTML = infok;
  });

  // clear selection when drawing a new box and when clicking on the map
  dragBox.on("boxstart", function (e) {
    selectedFeatures.clear();
  });
  map.on("click", function () {
    selectedFeatures.clear();
    infoBox.innerHTML = "";
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
