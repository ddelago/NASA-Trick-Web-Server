/*
 * Daniel Delago
 * daniel.b.delago@nasa.gov
 * Node.js S_sie.resource parsing algorithm
 * Recursively constructs variables based on S_sie.resource file
 */

import fs from 'fs';
import  xml2js  from 'xml2js';
import { trickVariableTree, sieIsParsed, classList, enumList, addEnum, topLevelObjectList, addTLO } from '../common/variables';
import { walkClassTree, walkClassTreeNew } from './parserUtils/walkClassTree';
export { parseSie };

var parser = new xml2js.Parser();

function parseSie(trickClient) {

    // Get list of variables
	trickClient.write(`trick.send_sie_resource()\n`);
	
	// Read S_sie XML and convert to JSON
    function readSie() {
        // trick_output.log will contain the S_sie.resource file
        fs.readFile('./src/trick/logs/trick_output.log', 'utf8', function(err, contents) {
            
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
			addEnum(element.$.name);
		});
	}

	// Get top_level_objects
	sieObject.sie.top_level_object.forEach(function(element) {
        // Ignore reference objects
        // This skips a VAST majority of internal variables (not useful data)
		if(element.$.alloc_memory_init == "0") {
            return;
        }
        
        // Add TLO to list
        addTLO(element.$);
        
		// Begin recursive construction of variable list
        // walkClassTree(element.$, element.$.name, trickVariableTree);
        walkClassTreeNew(element.$, element.$.name, trickVariableTree);
	});

	// console.log(classList['Satellite'].member[0]);
	// console.log("CLASSES:\n", classList.Satellite);
	// console.log("\nENUMS:\n", enumList);
	// console.log("\nTOP LEVEL OBJECTS:\n", topLevelObjectList);
	// console.log(trickVariableTree);
}