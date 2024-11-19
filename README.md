# 🌍 Land Cover Classification and Forest Change Detection in Kisumu

This repository contains a Google Earth Engine (GEE) script for land cover classification and forest change detection in Kisumu. The analysis is performed using Landsat imagery and training data, with a focus on assessing forest area changes over time.

---

## 📂 Project Structure

```plaintext
├── scripts/               # GEE code for land cover classification and analysis
├── exports/               # Data and images exported to Google Drive
├── outputs/               # Classified images and charts
└── README.md              # Documentation
✨ Features
AOI Definition:
Defines the Area of Interest (AOI) for Kisumu and overlays it on the map.
Landsat Preprocessing:
Filters and processes Landsat imagery for the years 2013, 2016, 2021, and 2024.
Supervised Classification:
Utilizes training data to classify land cover into categories: Forest, Water Body, Bareland, Other Vegetations, and Built-up.
Accuracy Assessment:
Generates a confusion matrix and calculates accuracy metrics (overall, producer's, user's, and Kappa accuracy).
Forest Area Calculation:
Calculates forest area in hectares for each year within the AOI.
Change Detection:
Highlights forest cover changes between consecutive years using binary maps.
Visualization:
Displays classified maps and change detection layers with interactive legends.
🚀 Getting Started
Prerequisites
Google Earth Engine account.
Training data uploaded to GEE assets (as a FeatureCollection in CSV format).
Landsat Level-2 Collection 2 Tier 1 imagery access.
Setup
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/land-cover-classification.git
Open the Google Earth Engine Code Editor.
Copy and paste the script from scripts/land_cover_analysis.js into the Code Editor.
Replace placeholders (aoi, trainingData) with your asset paths.
Running the Code
Run the script to classify land cover for the years 2013, 2016, 2021, and 2024.
Export the classification results and accuracy assessment data to Google Drive for further analysis.
📊 Outputs
Classified Maps:
Displays land cover maps for the years 2013, 2016, 2021, and 2024.
Change Detection Maps:
Binary maps showing forest cover changes between consecutive years.
Accuracy Metrics:
Confusion matrix and accuracy scores for the classification.
Forest Area Statistics:
Calculated forest area in hectares for each year.
📜 Code Overview
The main script performs the following steps:

Preprocess Landsat Imagery:
Clips the imagery to the AOI and selects relevant bands.
Supervised Classification:
Trains a Random Forest classifier using training data.
Validation:
Splits training data into training and validation subsets for accuracy assessment.
Forest Area Calculation:
Computes forest area for each classified image using pixel area.
Change Detection:
Calculates differences in forest cover between years.
Visualization:
Displays maps with interactive legends for land cover classes and change detection.
📧 Contact
For questions or feedback, feel free to reach out:
Your John Odero
Email: johnwuorodero@gmail.com
GitHub: John2white
🌟 Acknowledgements
This project utilizes:

Google Earth Engine for cloud-based geospatial analysis.
Landsat Collection 2 Data for satellite imagery.
