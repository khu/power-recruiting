function csv2array( strData, strDelimiter ){
// Check to see if the delimiter is defined. If not,
// then default to comma.
strDelimiter = (strDelimiter || ",");
 
// Create a regular expression to parse the CSV values.
var objPattern = new RegExp(
(
// Delimiters.
"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
 
// Quoted fields.
"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
 
// Standard fields.
"([^\"\\" + strDelimiter + "\\r\\n]*))"
),
"gi"
);
 
 
var arrData = [[]];
 
var arrMatches = null;
 
 
// Keep looping over the regular expression matches
// until we can no longer find a match.
while (arrMatches = objPattern.exec( strData )){
 
// Get the delimiter that was found.
var strMatchedDelimiter = arrMatches[ 1 ];
 
if (
strMatchedDelimiter.length &&
(strMatchedDelimiter != strDelimiter)
){
 
arrData.push( [] );
 
}
 
 
if (arrMatches[ 2 ]){
 
var strMatchedValue = arrMatches[ 2 ].replace(
new RegExp( "\"\"", "g" ),
"\""
);
 
} else {
 
var strMatchedValue = arrMatches[ 3 ];
 
}
 
 
arrData[ arrData.length - 1 ].push( strMatchedValue );
}
 

return  (arrData) ;
}

function array2csv(array) {	
	arr.join(",")
}
