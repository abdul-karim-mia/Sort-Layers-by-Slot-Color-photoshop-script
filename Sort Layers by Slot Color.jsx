// Tested on Photoshop CS2 to Photoshop CC 2024
/**
 * @@@BUILDINFO@@@ Sort-Layers-by-Color-Photoshop-Script.jsx 1.0.0 Fri Dec 15 2023 12:34:56 GMT+0000
 */
/*
<javascriptresource>
<about>$$$/JavaScripts/SortLayersbyColor/About=Sort Layers by Slot Color - By Abdul Karim Mia.^r^rCopyright 2023 Abdul Karim Mia.^r^rScript utility for organizing layers within a group based on color labels.^r</about>
<category>Abdul's Scripts</category>
</javascriptresource>

Sort-Layers-by-Color-Photoshop-Script
This script organizes layers within a group based on Slot color labels.

Date: 15/12/2023
Author: Abdul Karim Mia
Mail: akmia51@gmail.com

Release Notes:
- 1.0.0: Initial version
  - Organizes layers within a group by color labels
  - Tested on Photoshop CS2 to Photoshop CC 2024

Donate (optional):
If you find this script helpful, you can support the author:
- via PayPal: https://paypal.me/akmia51

NOTICE:
This script is provided "as is" without warranty of any kind.
Free to use, not for sale.
Released under the GNU General Public License (GPL).
https://opensource.org/licenses/gpl-license

Check other scripts by the author:
https://github.com/abdul-karim-mia
*/


// Function to get the color name based on type ID
function getColorName(colorTypeID) {
    switch (colorTypeID) {
        case charIDToTypeID('Rd  '): return 'Red';
        case charIDToTypeID('Orng'): return 'Orange';
        case charIDToTypeID('Ylw '): return 'Yellow';
        case charIDToTypeID('Grn '): return 'Green';
        case 1399152998: return 'SeaFoam';
        case charIDToTypeID('Bl  '): return 'Blue';
        case 1231971433: return 'Indigo';
        case 1298624116: return 'Magenta';
        case 1182098280: return 'Fuchsia';
        case charIDToTypeID('Vlt '): return 'Violet';
        case charIDToTypeID('Gry '): return 'Gray';
        default: return 'Unknown';
    }
}

// Function to compare layers based on color labels
function compareLayers(layer1, layer2) {
    var color1 = layer1.colorTypeID;
    var color2 = layer2.colorTypeID;

    // Compare based on color type IDs directly for efficiency
    return color1 - color2;
}

// Function to sort layers within a group by color
function sortLayersByColor(group) {
    // Get an array of layers in the group
    var layersArray = group.layers;

    // Convert layers to an array of objects with color information
    var layersWithColor = [];
    for (var i = 0; i < layersArray.length; i++) {
        var layerRef = new ActionReference();
        layerRef.putProperty(charIDToTypeID('Prpr'), charIDToTypeID('Clr '));
        layerRef.putIdentifier(charIDToTypeID('Lyr '), layersArray[i].id);
        var layerDesc = executeActionGet(layerRef);

        if (layerDesc.hasKey(charIDToTypeID('Clr '))) {
            var colorTypeID = layerDesc.getEnumerationValue(charIDToTypeID('Clr '));
            layersWithColor.push({ layer: layersArray[i], colorTypeID: colorTypeID });
        }
    }

    // Sort layers based on color labels
    layersWithColor.sort(compareLayers);

    // Move the layers to group them consecutively by color
    var currentColor = null;
    for (var j = 0; j < layersWithColor.length; j++) {
        var layer = layersWithColor[j].layer;
        var color = getColorName(layersWithColor[j].colorTypeID);

        if (color !== currentColor) {
            // Move to the end of the group
            layer.move(group, ElementPlacement.PLACEATEND);
            currentColor = color;
        } else {
            // Move next to the previous layer
            layer.move(layersWithColor[j - 1].layer, ElementPlacement.PLACEAFTER);
        }
    }

    alert("Layers within the group have been sorted by color.");
}

// Get the active document
var activeDocument = app.activeDocument;

// Get the active layer (assuming it's a group)
var activeLayer = activeDocument.activeLayer;

// Check if the active layer is a group
if (activeLayer && activeLayer.typename === 'LayerSet') {
    // Create a history state for the entire operation
    activeDocument.suspendHistory("Sort Layers by Slot Color", "sortLayersByColor(activeLayer)");
} else {
    alert("Please select a group before running this script.");
}
