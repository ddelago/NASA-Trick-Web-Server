import fs from 'fs';
import { trickData } from './variables';
export { getTrickVars };

function getTrickVars(trickClient) {

    // Get list of variables
    trickClient.write(`trick.send_sie_resource()\n`);

    var oldValue = trickData[0];
    function wait() {
        if(trickData[0] === oldValue) {
            setTimeout(wait, 10);
            return;
        }

        fs.writeFile("./common/test.xml", trickData[0], function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    } 
    wait();

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
