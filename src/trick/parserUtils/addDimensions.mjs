import { classList } from '../../common/variables';
import { walkClassTree } from './walkClassTree';
export { addDimensionsClass, addDimensionsPrimitive, addDimensions };

// Add dimensions to class
function addDimensionsClass(member, varString, varTreeObject) {
	var dims = member.dimension.length;

	// Loop over dimensions
	for(var x = 0; x <= Number(member.dimension[0]); x++) {
		if(dims == 1) {
			varTreeObject[`${member.$.name}[${x}]`] = {};
			walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}]`, varTreeObject[`${member.$.name}[${x}]`]);
		}

		// If 2 dimensions
		else {
			for(var y = 0; y <= Number(member.dimension[1]); y++) {
				if(dims == 2) {
					varTreeObject[`${member.$.name}[${x}][${y}]`] = {};
					walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}]`, varTreeObject[`${member.$.name}[${x}][${y}]`]);
				}

				// If 3 dimensions
				else {
					for(var z = 0; z <= Number(member.dimension[2]); z++) {
						varTreeObject[`${member.$.name}[${x}][${y}][${z}]`] = {};
						walkClassTree(classList[member.$.type], `${varString}.${member.$.name}[${x}][${y}][${z}]`, varTreeObject[`${member.$.name}[${x}][${y}][${z}]`]);
						if(z == Number(member.dimension[2]) - 1) break;
					}
				}
				if(y == Number(member.dimension[1]) - 1) break;
			}
		}
		if(x == Number(member.dimension[0]) - 1) break;
	}
}

// Add dimensions to primitive
function addDimensionsPrimitive(member, varString, varTreeObject) {
	var dims = member.dimension.length;

	// Loop over dimensions
	for(var x = 0; x <= Number(member.dimension[0]); x++) {
		if(dims == 1) {
			varTreeObject[`${member.$.name}[${x}]`] = {trickVarString: `${varString}.${member.$.name}[${x}]`};
		}

		// If 2 dimensions
		else {
			for(var y = 0; y <= Number(member.dimension[1]); y++) {
				if(dims == 2) {
					varTreeObject[`${member.$.name}[${x}][${y}]`] = {trickVarString: `${varString}.${member.$.name}[${x}][${y}]`};
				}

				// If 3 dimensions
				else {
					for(var z = 0; z <= Number(member.dimension[2]); z++) {
						varTreeObject[`${member.$.name}[${x}][${y}][${z}]`] = {trickVarString: `${varString}.${member.$.name}[${x}][${y}][${z}]`};
						if(z == Number(member.dimension[2]) - 1) break;
					}
				}
				if(y == Number(member.dimension[1]) - 1) break;
			}
		}
		if(x == Number(member.dimension[0]) - 1) break;
	}
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
						if(z == Number(dimensions[2]) - 1) break;
					}
				}
				if(y == Number(dimensions[1]) -1) break;
			}
		}
		if(x == Number(dimensions[0]) - 1) break;
	}
	return segmentList;
}