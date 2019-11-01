let output = document.getElementById('output');

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic"
],
    function (Map, MapView, FeatureLayer, GraphicsLayer, Graphic) {

        var map = new Map({
            basemap: "gray"
        });

        var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-81.357502, 41.154396],
            zoom: 13
        });

        // Reference the feature layer to query
        var featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/kwmUh9MJciUcuce3/arcgis/rest/services/MyMapService/FeatureServer/0?token=g6SmFR5yRa07hhE7Rn5UzNBK8YghiP9oixoMnIrN8_hpA3G42asSjxgl0e5wjJeRXUSjlQNx087st9EFE68wVtRMAUDmpkyaJHLW8vN7SRDZpvw9lTm-jwUCvzkKWrNsJ6wR-t3nn2dG9yCcJDnSCp9ziB_krdlVlyUpvz82iWyEpzhMPyAFlDINWSlZeY2Y60_YPFj58u3SEbyu4XzIw5_jBsCvPe6myJGb4eL1wf0hu8ZHtcPFAZ9ITMGZeTKH",
        });

        // Layer used to draw graphics returned
        var graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

    });// end require main function