/*
 * Daniel Delago
 * daniel.b.delago@nasa.gov
 * Node.js S_sie.resource parsing algorithm
 * Recursively constructs variables based on S_sie.resource file
 */

import fs from 'fs';
import  xml2js  from 'xml2js';
import { trickVariableTree, sieIsParsed } from '../common/variables';
export { parseSie };

var parser = new xml2js.Parser();
var classList = {};
var enumList = [];
var topLevelObjectList = [];

function parseSie(trickClient) {

    // Get list of variables
	trickClient.write(`trick.send_sie_resource()\n`);
	
	// Read S_sie XML and convert to JSON
    function readSie() {
        // trick_output.log will contain the S_sie.resource file
        fs.readFile('./trick/trick_output.log', 'utf8', function(err, contents) {
            
            // Remove first line of trick_output.log (non-xml line)
            contents = contents.split('\n');
            contents.shift();

            // Reconstruct into XML string  
            var xmlString = "";
            contents.forEach(function(v) { 
                xmlString += (v + '\n'); 
            });
            
            // Parse XML and store as JSON object
            parser.parseString(xmlString, function (err, result) {
                extractElements(result);
			});
			
			sieIsParsed(true);
        });
    } 

    // Allow time for file to populate (S_sie.resource files are very very large)
    setTimeout(readSie, 1000);
}

// Extract variables from SIE
function extractElements(sieObject) {

	// Get classes
	sieObject.sie.class.forEach(function(element) {
		classList[element.$.name] = element;
	});

	// Get enums (if they exist)
	if(sieObject.sie.enumeration !== undefined) {
		sieObject.sie.enumeration.forEach(function(element) {
			enumList.push(element.$.name);
		});
	}

	// Get top_level_objects
	sieObject.sie.top_level_object.forEach(function(element) {
		// Ignore reference objects
		if(element.$.alloc_memory_init == "0") {
			return;
		}
		topLevelObjectList.push(element.$);

		// Begin recursive construction of variable list
		walkClassTree(element.$, element.$.name, trickVariableTree, [], []);
	});

	// console.log(classList['Satellite'].member[0]);
	// console.log("CLASSES:\n", classList);
	// console.log("\nENUMS:\n", enumList);
	// console.log("\nTOP LEVEL OBJECTS:\n", topLevelObjectList);
	// console.log(trickVariableTree.dyn);
}

// Recursively constuct variables and add to list
function walkClassTree(classObject, varString, varTreeObject, dimLocations, dimensions) {
	// If top level object (TLO)
	if(topLevelObjectList.includes(classObject)) {
		// If the TLO has dimensions
		if(classObject.hasOwnProperty('dimension')) {
			
			dimLocations.push(classObject.name);
			dimensions.push(classObject.dimension);

			// Create tree object
			varTreeObject[varString] = {};

			// Walk the class that equals the TLO type
			return walkClassTree(classList[classObject.type], varString, varTreeObject[varString], dimLocations, dimensions);
		} 
		else {
			// Create tree object
			varTreeObject[varString] = {};
			// Walk the class that equals the TLO type
			return walkClassTree(classList[classObject.type], varString, varTreeObject[varString], dimLocations, dimensions);
		}
	}

	// If class has no members
	if(classObject.member === undefined) {
		return varTreeObject[varString] = {trickVarString: varString};
	}

	// Loop over class members
	classObject.member.forEach(function(member) {
		// Kill when infinite recursion. Look into fix later when have access to ER7 sims
		if(member.$.type == classObject.$.name) {
			return; 
		}

		// Kill when two classes recursively call eachother. 
		var varStringSplit = varString.split('.');
		// If they are not the same length, there is a repeated class (recursion)
		if(varStringSplit.length !== new Set(varStringSplit).size) {
			return;
		}

		// Check if Enum
		if(enumList.includes(member.$.type)) {
			// Add dimensions to variables
			addDimensions(member, `${varString}.${member.$.name}`, dimLocations, dimensions);
			return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}`};
		}

		// If class, recurse on object. DONT FORGET THAT CLASSES CAN HAVE DIMENSIONS
		if(classList.hasOwnProperty(member.$.type) ) {
			// If the class has dimensions
			if(member.hasOwnProperty('dimension')) {
				dimLocations.push(member.$.name);
				dimensions.push(member.dimension);
				varTreeObject[member.$.name] = {};
				return walkClassTree(classList[member.$.type], `${varString}.${member.$.name}`, varTreeObject[member.$.name], dimLocations, dimensions);
			} 
			else {
				varTreeObject[member.$.name] = {};
				return walkClassTree(classList[member.$.type], `${varString}.${member.$.name}`, varTreeObject[member.$.name], dimLocations, dimensions);
			}
		}
		
		// If primitive 
		// If the primitive has dimensions
		if(member.hasOwnProperty('dimension')) {
			dimLocations.push(member.$.name);
			dimensions.push(member.dimension);
		}

		// Add dimensions to variables
		addDimensions(member, `${varString}.${member.$.name}`, dimLocations, dimensions);
		return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}`};

	});
}

// Add dimensions to the variable strings
function addDimensions(member, varString, dimLocations, dimensions) {
	var segments = varString.split(".");
	var segmentDimensionList = [];

	// Create the dimensionalized segments. From pos to [ pos[0], pos[1] ]
	for(var i = 0; i < dimLocations.length; i++) {
		segmentDimensionList.push(addDimensionsSegment(dimLocations[i], dimensions[i]));
	}

	// Build the full variable strings
	buildVariable("", 0);

	function buildVariable(varString, n) {
		var segment = segments[n]

		// Base case, add variable
		if(segments.length - n == 0) {
			// return
			return console.log(varString.slice(1, varString.length))
			// var varTreeObject = _.get(trickVariableTree, varString);
			// varTreeObject[`${member.$.name}[${x}][${y}][${z}]`] = {trickVarString: `${varString}.${member.$.name}[${x}][${y}][${z}]`};
		}

		// If the segment has dimensions
		if(dimLocations.includes(segment)) {
			// Get the appropriate array from the list and recurse on each
			segmentDimensionList[dimLocations.indexOf(segment)].forEach(function(segmentDimension) {
				buildVariable(`${varString}.${segmentDimension}`, n+1);
			})
		}

		else {
			buildVariable(`${varString}.${segment}`, n+1);
		}
	}
}

// Returns a list with dimensions added to the variable segment
function addDimensionsSegment(segment, dimensions) {
	var dims = dimensions.length;
	var segmentList = [];

	// Loop over dimensions
	for(var x = 0; x <= Number(dimensions[0]); x++) {
		if(dims == 1) {
			segmentList.push(`${segment}[${x}]`);
		}
		
		// If 2 dimensions
		else {
			for(var y = 0; y <= Number(dimensions[1]); y++) {
				if(dims == 2) {
					segmentList.push(`${segment}[${x}][${y}]`);
				}

				// If 3 dimensions
				else {
					for(var z = 0; z <= Number(dimensions[2]); z++) {
						segmentList.push(`${segment}[${x}][${y}][${z}]`);
						if(z == Number(dimensions[0]) - 1) break;
					}
				}
				if(y == Number(dimensions[1]) -1) break;
			}
		}
		if(x == Number(dimensions[0]) - 1) break;
	}
	return segmentList;
}

/* OLD CODE BELOW */

// Add dimensions to class
function addDimensionsClass(member, varString, varTreeObject) {
	var dims = member.dimension.length;

	// Weird case where dimension is ZERO
	if(member.dimension[0] == '0' && dims == 1) {
		varTreeObject[`${member.$.name}[0]`] = {};
		return walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[0]`, varTreeObject[`${member.$.name}[0]`]);
	}

	// Loop over dimensions
	for(var x = 0; x < Number(member.dimension[0]); x++) {
		if(dims == 1) {
			varTreeObject[`${member.$.name}[${x}]`] = {};
			walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}]`, varTreeObject[`${member.$.name}[${x}]`]);
		}

		// If 2 dimensions
		else {
			// Weird case where dimension is ZERO
			if(member.dimension[1] == '0' && dims == 2) {
				varTreeObject[`${member.$.name}[${x}][0]`] = {};
				walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][0]`, varTreeObject[`${member.$.name}[${x}][0]`]);
				continue;
			}
			for(var y = 0; y < Number(member.dimension[1]); y++) {
				if(dims == 2) {
					varTreeObject[`${member.$.name}[${x}][${y}]`] = {};
					walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}]`, varTreeObject[`${member.$.name}[${x}][${y}]`]);
				}

				// If 3 dimensions
				else {
					// Weird case where dimension is ZERO
					if(member.dimension[2] == '0' && dims == 3) {
						varTreeObject[`${member.$.name}[${x}][${y}][0]`] = {};
						walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}][0]`, varTreeObject[`${member.$.name}[${x}][${y}][0]`]);
						continue;
					}
					for(var z = 0; z < Number(member.dimension[2]); z++) {
						varTreeObject[`${member.$.name}[${x}][${y}][${z}]`] = {};
						walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}][${z}]`, varTreeObject[`${member.$.name}[${x}][${y}][${z}]`]);
					}
				}
			}
		}
	}
}

// Add dimensions to primitive
function addDimensionsPrimitive(member, varString, varTreeObject) {
	var dims = member.dimension.length;

	// Weird case where dimension is ZERO
	if(member.dimension[0] == '0' && dims == 1) {
		return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}[0]`};
	}

	// Loop over dimensions
	for(var x = 0; x < Number(member.dimension[0]); x++) {
		if(dims == 1) {
			varTreeObject[`${member.$.name}[${x}]`] = {trickVarString: `${varString}.${member.$.name}[${x}]`};
		}

		// If 2 dimensions
		else {
			// Weird case where dimension is ZERO
			if(member.dimension[1] == '0' && dims == 2) {
				varTreeObject[`${member.$.name}[${x}][0]`] = {trickVarString: `${varString}.${member.$.name}[${x}][0]`};
				continue;
			}
			for(var y = 0; y < Number(member.dimension[1]); y++) {
				if(dims == 2) {
					varTreeObject[`${member.$.name}[${x}][${y}]`] = {trickVarString: `${varString}.${member.$.name}[${x}][${y}]`};
				}

				// If 3 dimensions
				else {
					// Weird case where dimension is ZERO
					if(member.dimension[2] == '0' && dims == 3) {
						varTreeObject[`${member.$.name}[${x}][${y}][0]`] = {trickVarString: `${varString}.${member.$.name}[${x}][${y}][0]`};
						continue;
					}
					for(var z = 0; z < Number(member.dimension[2]); z++) {
						varTreeObject[`${member.$.name}[${x}][${y}][${z}]`] = {trickVarString: `${varString}.${member.$.name}[${x}][${y}][${z}]`};
					}
				}
			}
		}
	}
}