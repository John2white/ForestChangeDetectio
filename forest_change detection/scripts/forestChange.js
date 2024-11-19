// Load AOI (Area of Interest)
var aoi = HB;  
Map.centerObject(aoi, 9);
Map.addLayer(aoi, {color: 'red'}, 'AOI');

// Load CSV training data
var trainingData = ee.FeatureCollection("projects/ee-johnwhitte/assets/training_data_export");

// Function to preprocess Landsat images
function preprocessImage(year) {
    var image = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                .filterDate(year + '-01-01', year + '-12-31')
                .filterBounds(aoi)
                .filterMetadata("CLOUD_COVER", "less_than", 10)
                .map(function(img) {
                    return img.clip(aoi);
                })
                .median()
                .select(['SR_B4', 'SR_B5', 'SR_B6']); // Red, Green, Blue bands
    return image;
}

// Preprocess images for each year
var image2013 = preprocessImage(2013);
var image2016 = preprocessImage(2016);
var image2021 = preprocessImage(2021);
var image2024 = preprocessImage(2024);

// Display the images
Map.addLayer(image2013, {min: 0, max: 3000, bands: ['SR_B4', 'SR_B5', 'SR_B6']}, '2013 Image');
Map.addLayer(image2016, {min: 0, max: 3000, bands: ['SR_B4', 'SR_B5', 'SR_B6']}, '2016 Image');
Map.addLayer(image2021, {min: 0, max: 3000, bands: ['SR_B4', 'SR_B5', 'SR_B6']}, '2021 Image');
Map.addLayer(image2024, {min: 0, max: 3000, bands: ['SR_B4', 'SR_B5', 'SR_B6']}, '2024 Image');

// Split training data into training and validation subsets
var withRandom = trainingData.randomColumn('random');
var trainingSet = withRandom.filter(ee.Filter.lt('random', 0.7)); // 70% for training
var validationSet = withRandom.filter(ee.Filter.gte('random', 0.7)); // 30% for validation

// Train classifier using training subset
var trainedClassifier = ee.Classifier.smileRandomForest(10).train({
    features: trainingSet,
    classProperty: 'class',
    inputProperties: ['SR_B4', 'SR_B5', 'SR_B6']
});

// Classify validation dataset
var validated = validationSet.classify(trainedClassifier);

// Generate confusion matrix
var confusionMatrix = validated.errorMatrix('class', 'classification');

// Print confusion matrix
print('Confusion Matrix:', confusionMatrix);

// Compute accuracy metrics
var overallAccuracy = confusionMatrix.accuracy();
var producersAccuracy = confusionMatrix.producersAccuracy();
var usersAccuracy = confusionMatrix.consumersAccuracy();
var kappaAccuracy = confusionMatrix.kappa(); // Calculate Kappa's accuracy

// Print accuracy metrics
print('Overall Accuracy:', overallAccuracy);
print('Producer\'s Accuracy:', producersAccuracy);
print('User\'s Accuracy:', usersAccuracy);
print('Kappa Accuracy:', kappaAccuracy);

// Use the trained classifier for image classification
var classifier = trainedClassifier;


function classifyImage(image) {
    return image.classify(classifier);
}

// Classify each image
var classified2013 = classifyImage(image2013);
var classified2016 = classifyImage(image2016);
var classified2021 = classifyImage(image2021);
var classified2024 = classifyImage(image2024);

// Add classification layers with legend
var landcoverPalette = ['006400', '2328C6', 'A52A2A', '7FFF00', 'C0C0C0']; // Adjust colors for classes
Map.addLayer(classified2013, {min: 0, max: 4, palette: landcoverPalette}, 'Classified 2013');
Map.addLayer(classified2016, {min: 0, max: 4, palette: landcoverPalette}, 'Classified 2016');
Map.addLayer(classified2021, {min: 0, max: 4, palette: landcoverPalette}, 'Classified 2021');
Map.addLayer(classified2024, {min: 0, max: 4, palette: landcoverPalette}, 'Classified 2024');

// Filter for 'Forest' class (assuming 'Forest' is class 0 in your dataset)
var forestClass2013 = classified2013.eq(0);
var forestClass2016 = classified2016.eq(0);
var forestClass2021 = classified2021.eq(0);
var forestClass2024 = classified2024.eq(0);

// Calculate forest area for each year (in hectares)
var forestArea2013 = forestClass2013.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

var forestArea2016 = forestClass2016.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

var forestArea2021 = forestClass2021.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

var forestArea2024 = forestClass2024.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

// Display the calculated forest areas in hectares
print('Forest area in 2013 (ha):', forestArea2013);
print('Forest area in 2016 (ha):', forestArea2016);
print('Forest area in 2021 (ha):', forestArea2021);
print('Forest area in 2024 (ha):', forestArea2024);


// Calculate forest change detection for forest class only
var change1316 = forestClass2016.subtract(forestClass2013);
var change1621 = forestClass2021.subtract(forestClass2016);
var change2124 = forestClass2024.subtract(forestClass2021);

// Display change detection layers
var changePalette = ['FFFFFF', '1c1c1c']; // White = No Change, Red = Change
Map.addLayer(change1316, {min: -1, max: 1, palette: changePalette}, 'Change 2013-2016');
Map.addLayer(change1621, {min: -1, max: 1, palette: changePalette}, 'Change 2016-2021');
Map.addLayer(change2124, {min: -1, max: 1, palette: changePalette}, 'Change 2021-2024');

// Function to add legends
function addLegend(title, palette, names) {
    var legend = ui.Panel({
        style: {
            position: 'bottom-left',
            padding: '8px 15px'
        }
    });

    var legendTitle = ui.Label({
        value: title,
        style: {fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0'}
    });
    legend.add(legendTitle);

    for (var i = 0; i < names.length; i++) {
        var colorBox = ui.Label({
            style: {
                backgroundColor: '#' + palette[i],
                padding: '8px',
                margin: '0 0 4px 0'
            }
        });
        var description = ui.Label({
            value: names[i],
            style: {margin: '0 0 4px 6px'}
        });

        var row = ui.Panel({
            widgets: [colorBox, description],
            layout: ui.Panel.Layout.Flow('horizontal')
        });
        legend.add(row);
    }
    Map.add(legend);
}

// Define class names and add legends
var classNames = ['Forest', 'Water Body', 'Bareland', 'Other Vegetations', 'Built-up'];
addLegend('Land Cover Classes', landcoverPalette, classNames);
addLegend('Forest Change Detection', changePalette, ['No Change', 'Change']);
