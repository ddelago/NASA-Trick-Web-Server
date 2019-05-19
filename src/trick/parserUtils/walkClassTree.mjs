import { classList, enumList, topLevelObjectList } from '../../common/variables';
import { addDimensionsClass, addDimensionsPrimitive } from './addDimensions';
export { walkClassTree, walkClassTreeNew };

// Recursively constuct variables and add to list
function walkClassTree(classObject, varString, varTreeObject) {
    // If top level object (TLO)
    /* DONT FORGET TO ADD DIMENSIONS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
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
function walkClassTreeNew(classObject, varString, varTreeObject) {
	// If top level object (TLO)
	if(topLevelObjectList.includes(classObject)) {
		// If the TLO has dimensions
		if(classObject.hasOwnProperty('dimension')) {
            var dimString = ''
            classObject.dimension.forEach(function(dimension) {
                dimString += `[${dimension}]`;
            });

			// Create tree object
			varTreeObject[`${varString}${dimString}`] = {dimension: classObject.dimension, memberName: classObject.name};

			// Walk the class that equals the TLO type
			return walkClassTreeNew(classList[classObject.type], `${varString}${dimString}`, varTreeObject[`${varString}${dimString}`]);
		} 
		else {
			// Create tree object
            varTreeObject[varString] = {memberName: classObject.name};
            
			// Walk the class that equals the TLO type
			return walkClassTreeNew(classList[classObject.type], varString, varTreeObject[varString]);
		}
	}

	// If class has no members
	if(classObject.member === undefined) {
		return varTreeObject[varString] = {trickVarString: varString, memberName: classObject.$.name};
	}

	// Loop over class members
	classObject.member.forEach(function(member) {
		// Kill when infinite recursion. Look into fix later when have access to ER7 sims
		if(member.$.type == classObject.$.name) {
			return; 
		}

		// Kill when two classes recursively call eachother. 
		// If they are not the same length, there is a repeated class (recursion)
		var varStringSplit = varString.split('.');
		if(varStringSplit.length !== new Set(varStringSplit).size) {
			return;
		}

		// Check if Enum
		if(enumList.includes(member.$.type)) {
			// Add dimensions to variables
			return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}`};
		}

		// If class, recurse on object.
		if(classList.hasOwnProperty(member.$.type) ) {
			// If the class has dimensions
			if(member.hasOwnProperty('dimension')) {
                var dimString = ''
                member.dimension.forEach(function(dimension) {
                    dimString += `[${dimension}]`;
                });
				varTreeObject[`${member.$.name}${dimString}`] = {dimension: member.dimension, memberName: member.$.name};
				return walkClassTreeNew(classList[member.$.type], `${varString}.${member.$.name}${dimString}`, varTreeObject[`${member.$.name}${dimString}`]);
			} 
			else {
				varTreeObject[member.$.name] = {memberName: member.$.name};
				return walkClassTreeNew(classList[member.$.type], `${varString}.${member.$.name}`, varTreeObject[member.$.name]);
			}
		}
		
		// If primitive 
		// If the primitive has dimensions
		if(member.hasOwnProperty('dimension')) {
            var dimString = ''
            member.dimension.forEach(function(dimension) {
                dimString += `[${dimension}]`;
            });
            return varTreeObject[`${member.$.name}${dimString}`] = {
                trickVarString: `${varString}.${member.$.name}${dimString}`, 
                dimension: member.dimension, 
                memberName: member.$.name
            };
		}

        // Else, just return 
		return varTreeObject[member.$.name] = {trickVarString: `${varString}.${member.$.name}`, memberName: member.$.name};
	});
}