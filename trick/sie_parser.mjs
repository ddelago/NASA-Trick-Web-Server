/*
 * Daniel Delago
 * daniel.b.delago@nasa.gov
 * Node.js S_sie.resource parsing algorithm
 * 
 */

import fs from 'fs';
import  xml2js  from 'xml2js';
export { parseSie };

var parser = new xml2js.Parser();

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

    // Allow time for file to populate (S_sie.resource files are very large)
    setTimeout(readSie, 1000);
}

// Extract variables from SIE and store variable list locally.
function extractElements(sieObject) {
	// console.log(sieObject.sie);

	var classList = [];
	var enumList = [];
	var topLevelObjectList = [];

	// Get classes
	sieObject.sie.class.forEach(function(element) {
		// console.log(element);
		classList.push(element.$.name);
		walkClassTree(element);
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
	});

	// console.log("CLASSES:\n", classList);
	// console.log("\nENUMS:\n", enumList);
	// console.log("\nTOP LEVEL OBJECTS:\n", topLevelObjectList);
}


function walkClassTree(classObject, varString) {
	
	// If class has no members
	if(classObject.member === undefined) {
		return;
	}	
	
	console.log(`MEMBERS OF ${classObject.$.name}`)
	classObject.member.forEach(function(element) {
		console.log(element);
	});

}


// for each topLevelObject in (xml elements of type <top_level_object>):
//     info = new MemberInfo(topLevelObject)
//     allInstances.add(info)
//     rootInstances.add(info)

// for each clazz in (xml elements of type <class>):
//     memberList = new List()
//     typeHashMap[clazz.name] = memberList
//     for each member in (xml element of type <member>):
//     info = new MemberInfo(member)
//     allInstances.add(info)
//     memberList.add(info)

// for each enum in (xml elements of type <enumeration>):
//     enumHashMap[enum.name] = new EnumInfo(enum)

// for each instance in allInstances:
//     instance.children = typeHashMap[instance.type]       // one of these
//     instance.enumeration = enumHashMap[instance.type]    // will be NULL

// Daniel Delago 
// daniel.b.delago@nasa.gov
// Go XML Parser for S_sie.resource files
// package Parsers

// import (
// 	"encoding/xml"
// 	"fmt"	
// 	"io/ioutil"
// )

// func ExampleUnmarshal() {

// 	type Pair struct {
// 		Label 			string 				`xml:"label,attr"`
// 		Value 			string 				`xml:"value,attr"`
// 	}	

// 	type Enumeration struct {
// 		Name 			string 				`xml:"name,attr"`
// 		Pairs			[]Pair 				`xml:"pair"`
// 	} 

// 	type Member struct {
// 		Name 			string 				`xml:"name,attr"`
// 		Type 			string 				`xml:"type,attr"`
// 		IO_attributes 	string 				`xml:"io_attributes,attr"`
// 		Units 			string 				`xml:"units,attr"`
// 		Description 	string 				`xml:"description,attr"`
// 		Dimensions 		[]string			`xml:"dimension"`
// 	}

// 	type Class struct {
// 		XMLName 		xml.Name 			`xml:"class"`
// 		Name 			string 				`xml:"name,attr"`
// 		Members 		[]Member 			`xml:"member"`
// 	}

// 	type TopLevelObject struct {
// 		XMLName 		xml.Name 			`xml:"top_level_object"`
// 		Name 			string 				`xml:"name,attr"`
// 		Type 			string 				`xml:"type,attr"`
// 		Dimensions 		[]string			`xml:"dimension"`
// 	} 

// 	type SIE struct {
// 		XMLName 		xml.Name 			`xml:"sie"`
// 		TopLevelObjects	[]TopLevelObject 	`xml:"top_level_object"`
// 		Classes			[]Class 			`xml:"class"`
// 		Enumerations	[]Enumeration 		`xml:"enumeration"`
// 	}

// 	v := SIE{}

// 	dat, err := ioutil.ReadFile("src/variables/S_sie.resource")

// 	if err != nil {
//         panic(err)
// 	}
	
// 	err2 := xml.Unmarshal([]byte(dat), &v)
// 	if err2 != nil {
// 		fmt.Printf("error: %v", err2)
// 		return
// 	}

	// fmt.Printf("XMLName: %#v\n", v.XMLName)
	// for object := range v.TopLevelObjects {
	// 	fmt.Printf("Object Name: %v\n", v.TopLevelObjects[object].Name)
	// 	fmt.Printf("---Type: %v\n", v.TopLevelObjects[object].Type)
	// 	fmt.Printf("---Dimensions: %v Length: %v\n", v.TopLevelObjects[object].Dimensions, len(v.TopLevelObjects[object].Dimensions))
	// }

	// fmt.Printf("\n\nCLASSES BELOW:\n")
	// for object := range v.Classes {
	// 	fmt.Printf("Class Name: %v\n", v.Classes[object].Name)	
	// 	for member := range v.Classes[object].Members {
	// 		fmt.Printf("---member: %v\n", v.Classes[object].Members[member].Name)
	// 		fmt.Printf("   ---Type: %v\n", v.Classes[object].Members[member].Type)
	// 		fmt.Printf("   ---IO_attributes: %v\n", v.Classes[object].Members[member].IO_attributes)
	// 		fmt.Printf("   ---Units: %v\n", v.Classes[object].Members[member].Units)
	// 		fmt.Printf("   ---Description: %v\n", v.Classes[object].Members[member].Description)
	// 		fmt.Printf("   ---Dimensions: %v Length: %v \n", v.Classes[object].Members[member].Dimensions, len(v.Classes[object].Members[member].Dimensions))
	// 	}
	// }

	// fmt.Printf("\n\nENUMERATIONS BELOW:\n")
	// for object := range v.Enumerations {
	// 	fmt.Printf("Enum Name: %v\n", v.Enumerations[object].Name)
	// 	for pair := range v.Enumerations[object].Pairs {
	// 		fmt.Printf("---Pair: %v %v\n",v.Enumerations[object].Pairs[pair].Label, v.Enumerations[object].Pairs[pair].Value)
	// 	}
	// }


	// TODO: Enable functionality below to display all available trick variables on Dashboard

	// varList := make([]string,0)
	// classMap := make(map[string]bool)
	// enumMap := make(map[string]bool)

	// // Create boolean map for classes
	// for i := 0; i < len(v.Classes); i++ {
    //    	classMap[v.Classes[i].Name] = true
	// }

	// // Create boolean map for enums
	// for i := 0; i < len(v.Enumerations); i++ {
    //    	enumMap[v.Enumerations[i].Name] = true
	// }

	// // For each top level object
	// for object := range v.TopLevelObjects {
		
	// 	varName := v.TopLevelObjects[object].Name
	// 	dim := len(v.TopLevelObjects[object].Dimensions)

	// 	// Dimension length is zero, only single attribute
	// 	if dim == 0 {
	// 		// If type is a class
	// 		if classMap[v.TopLevelObjects[object].Type] {

	// 		}

	// 		// If type is an enum
	// 		else if enumMap[v.TopLevelObjects[object].Type] {
	// 			// Just append because not able to change variable values yet
	// 			varList = append(varList, varName)
	// 		}

	// 		// Else type is a primitive type
	// 		else {
	// 			varList = append(varList, varName)
	// 		}
	// 	}
	// }