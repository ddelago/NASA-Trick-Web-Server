/*
 * Daniel Delago
 * daniel.b.delago@nasa.gov
 * Node.js S_sie.resource parsing algorithm
 * Recursively constructs variables based on S_sie.resource file 
 */

import fs from 'fs';
import  xml2js  from 'xml2js';
import { addTrickVariable, trickVariables } from '../common/variables';
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
		topLevelObjectList.push(element.$);
		
		// Begin recursive construction of variable list
		walkClassTree(element.$, element.$.name);
	});

	// console.log(classList['Satellite'].member[0]);
	// console.log("CLASSES:\n", classList);
	// console.log("\nENUMS:\n", enumList);
	// console.log("\nTOP LEVEL OBJECTS:\n", topLevelObjectList);
	console.log(trickVariables);
}

// Recursively constuct variables and add to list
function walkClassTree(classObject, varString) {
	
	// If top level object (TLO)
	if(topLevelObjectList.includes(classObject)) {
		// Return the class that equals the TLO type
		return walkClassTree(classList[classObject.type], varString);
	}

	// If class has no members
	if(classObject.member === undefined) {
		return addTrickVariable(varString);
	}
	
	// Loop over class members
	classObject.member.forEach(function(member) {

		// Check if Enum
		if(enumList.includes(member.$.name)) {
			return addTrickVariable(`${varString}.${member.$.name}`)
		}

		// If class, recurse on object. DONT FORGET THAT CLASSES CAN HAVE DIMENSIONS
		if(classList.hasOwnProperty(member.$.type) ) {
			if(member.hasOwnProperty('dimension')) {
				return addDimensionsClass(member, varString);
			} 
			else {
				return walkClassTree(classList[member.$.type], `${varString}.${member.$.name}`);
			}
		}
		
		// If primitive 
		// If the primitive has dimensions
		if(member.hasOwnProperty('dimension')) {
			return addDimensionsPrimitive(member, varString);
		}

		// If the primitive has no dimensions, just return 
		return addTrickVariable(`${varString}.${member.$.name}`);
	});
}

// Add dimensions to class
function addDimensionsClass(member, varString) {
	var dims = member.dimension.length;

	// Weird case where dimension is ZERO
	if(member.dimension[0] == '0')
		return walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[0]`);

	// Loop over dimensions
	for(var x = 0; x < Number(member.dimension[0]); x++) {
		if(dims == 1)
			walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}]`);
		
		// If 2 dimensions
		else {
			// Weird case where dimension is ZERO
			if(member.dimension[1] == '0') {
				walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][0]`);
				continue;
			}
			for(var y = 0; y < Number(member.dimension[1]); y++) {
				if(dims == 2)
					walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}]`);

				// If 3 dimensions
				else {
					// Weird case where dimension is ZERO
					if(member.dimension[2] == '0') {
						walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}][0]`);
						continue;
					}
					for(var z = 0; z < Number(member.dimension[2]); z++)
						walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}][${z}]`);
				}
			}
		}
	}
}

// Add dimensions to primitive
function addDimensionsPrimitive(member, varString) {
	var dims = member.dimension.length;

	// Weird case where dimension is ZERO
	if(member.dimension[0] == '0')
		return addTrickVariable(`${varString}.${member.$.name}[0]`);

	// Loop over dimensions
	for(var x = 0; x < Number(member.dimension[0]); x++) {
		if(dims == 1)
			addTrickVariable(`${varString}.${member.$.name}[${x}]`);
		
		// If 2 dimensions
		else {
			// Weird case where dimension is ZERO
			if(member.dimension[1] == '0') {
				addTrickVariable(`${varString}.${member.$.name}[${x}][0]`);
				continue;
			}
			for(var y = 0; y < Number(member.dimension[1]); y++) {
				if(dims == 2)
					addTrickVariable(`${varString}.${member.$.name}[${x}][${y}]`);

				// If 3 dimensions
				else {
					// Weird case where dimension is ZERO
					if(member.dimension[2] == '0') {
						addTrickVariable(`${varString}.${member.$.name}[${x}][${y}][0]`);
						continue;
					}
					for(var z = 0; z < Number(member.dimension[2]); z++)
						addTrickVariable(`${varString}.${member.$.name}[${x}][${y}][${z}]`);
				}
			}
		}
	}
}