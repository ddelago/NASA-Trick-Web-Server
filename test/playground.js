var testObject = {}

for(var i = 0; i < 28000; i++) {
    testObject[`member[${i}]`] = {}
}