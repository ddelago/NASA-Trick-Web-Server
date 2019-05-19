import { classList } from '../../common/variables';
import { walkClassTree } from './walkClassTree';
export { addDimensionsClass, addDimensionsPrimitive };

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
    // console.log(varString)
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