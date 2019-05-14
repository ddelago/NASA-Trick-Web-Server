import { classList, enumList, topLevelObjectList } from '../../common/variables';
import { addDimensionsClass, addDimensionsPrimitive } from './addDimensions';
export { walkClassTree };

// Recursively constuct variables and add to list
function walkClassTree(classObject, varString, varTreeObject) {
	// If top level object (TLO)
	if(topLevelObjectList.includes(classObject)) {
		// Create tree object
		varTreeObject[varString] = {};

		// Walk the class that equals the TLO type
		return walkClassTree(classList[classObject.type], varString, varTreeObject[varString]);
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
			return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}`};
		}

		// If class, recurse on object. DONT FORGET THAT CLASSES CAN HAVE DIMENSIONS
		if(classList.hasOwnProperty(member.$.type) ) {
			// If the class has dimensions
			if(member.hasOwnProperty('dimension')) {
				return addDimensionsClass(member, varString, varTreeObject);
			} 
			else {
				varTreeObject[member.$.name] = {};
				return walkClassTree(classList[member.$.type], `${varString}.${member.$.name}`, varTreeObject[member.$.name]);
			}
		}
		
		// If primitive 
		// If the primitive has dimensions
		if(member.hasOwnProperty('dimension')) {
			return addDimensionsPrimitive(member, varString, varTreeObject);
		}

		// If the primitive has no dimensions, just return 
		return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}`};
	});
}

// WORK IN PROGRESS BELOW
// Recursively constuct variables and add to list
function walkClassTreeNew(classObject, varString, varTreeObject, dimLocations, dimensions) {
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