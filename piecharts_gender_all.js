// CLASS
// Contains numbers of students of each gender
function gender(male, female) {
    this.Male = +male;
    this.Female = +female;
}

// FUNCTION
// Returns an empty gender object
function emptyGenders() {
    return new gender(0, 0);
}

// FIELDS
// Lists for categories
var artsListG = [],
    languageListG = [],
    stemListG = [],
    humanitiesListG = [],
    regularListG = [],
    honorsListG = [],
    apListG = [];

// OBJECT
// Contains all lists
var categoryDataG = {
    Arts : artsListG,
    Language : languageListG,
    STEM : stemListG,
    Humanities : humanitiesListG,
    Regular : regularListG,
    Honors : honorsListG,
    AP : apListG
};

// OBJECT
// Data for pie charts
var dataG = {
    Arts : emptyGenders(),
    Language : emptyGenders(),
    STEM : emptyGenders(),
    Humanities : emptyGenders(),
    Regular : emptyGenders(),
    Honors : emptyGenders(),
    AP : emptyGenders()
}

// Data for pie charts
var rawDataG = [];

// Extracting data from AllData.csv
d3.csv("AllData.csv", function(genddata) {  
    return {
        name : genddata.name,
        Black : +genddata.Black,
        Hispanic : +genddata.Hispanic,
        Asian : +genddata.Asian,
        Other : +genddata.Other,
        White : +genddata.White,
        "Native American" : +genddata["Native American"],
        Male : +genddata.Male,
        Female : +genddata.Female,
        type : genddata.type,
        category : genddata.category
    };
}, function(error, d1) {    
    d1.forEach(function(d2) {
        // Compiling category lists
        switch (d2.category) {
            case "Arts":
                artsListG.push(d2);
                break;
            case "Humanities": 
                humanitiesListG.push(d2);
                break;
            case "Language":
                languageListG.push(d2);
                break;
            case "STEM":
                stemListG.push(d2);
                break;
        }
        
        // Compiling type lists
        switch (d2.type) {
            case "Regular":
                regularListG.push(d2);
                break;
            case "Honors":
                honorsListG.push(d2);
                break;
            case "AP":
                apListG.push(d2);
                break;
        }
        
        // Checks if given field is a gender
        function isGender(field) {
            switch (field) {
                case "Male":
                case "Female":
                    return true;
            }
            
            return false;
        }        
        
        for (var d2Key in d2) { 
            if (isGender(d2Key)) {
                dataG[d2.category][d2Key] = dataG[d2.category][d2Key] + +d2[d2Key];
                                                
                dataG[d2.type][d2Key] = dataG[d2.type][d2Key] + +d2[d2Key];
            } 
        }})
        
        for (var cKey in dataG) {
            var list = [];
            for (var rKey in dataG[cKey]) {
                list.push(dataG[cKey][rKey]);
            }
            rawDataG.push(list);
        }
    
var marginG = 10,
    radiusG = 100,
    widthG = (radiusG + marginG) * 2,
    heightG = (radiusG + marginG) * 2;
    
var colorG = d3.scaleOrdinal(["#8dd3c7", "#ffed6f"]);

var arcG = d3.arc()
            .innerRadius(radiusG / 2)
            .outerRadius(radiusG);
    
var arcOverG = d3.arc()
        .outerRadius(radiusG + 9);

var labelArcG = d3.arc()
    .outerRadius(radiusG - 40)
    .innerRadius(radiusG - 40);

var pieG = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

// Gets the category that is associated with the given index
function getGCategory(i) {
    switch (i) {
        case 0:
            return "Arts";
        case 1:
            return "Language";
        case 2:
            return "STEM";
        case 3:
            return "Humanities";
        case 4:
            return "Regular";
        case 5:
            return "Honors";
        case 6:
            return "AP";
    }
}

// Creating the pie charts
for (var i = 0; i < rawDataG.length; i++) {
    var svg = d3.select("#piecharts_gender").append("svg")
    .attr("id", getGCategory(i))
    .attr("class", "pie")
    .attr("width", widthG)
    .attr("height", heightG)
    .append("g")
    .attr("transform", "translate(" + widthG / 2 + "," + heightG / 2 + ")");
        
    svg.append("text")
        .attr("text-anchor", "middle")
         .style('font-size', '18px')
             .style('font-family', 'sans-serif')
         .attr('y', 10)
       .text(getGCategory(i));
    
    var g = svg.selectAll(".arc")
      .data(pieG(rawDataG[i]))
    .enter().append("g")
    .attr("text", getGCategory(i))
      .attr("class", "arc")
    .on('mouseover', function(d) { dispatch.call("categorySelectedGender", null, d3.select(this).attr('text')); })
    .on('mouseout', function(d) { dispatch.call("categorySelectedGender", null, null); })
    .on("mousemove", function(d){
            var cat = d3.select(this).attr("text");
        
            tooltip
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("<b>" + 
                cat + "</b>" + "<br>" +
                "Male: " + (dataG[cat].Male) + " students" + "<br>" + 
                "Female: " + (dataG[cat].Female) + " students" + "<br>"
                );
        })
    .on('click', function(d) { dispatch.call("pieClickGender", null, d3.select(this).attr('text')); });

  g.append("path")
      .attr("d", arcG)
      .style("fill", function(d, i) { return colorG(i); });
    }
});



dispatch.on("classSelectedGender.pie", function(bar) {
    //select piecharts
    //filter type and category
    //highlight them
    //console.log(bar.data.type);
    var p = d3.selectAll(".pie");
    if(bar) {
        p.style('fill-opacity', .3);
        d3.selectAll("#" + bar.data.type).style('fill-opacity', 1);
        d3.selectAll("#" + bar.data.category).style('fill-opacity', 1);
    } else {
        p.style('fill-opacity', 1);
    }
});

dispatch.on("categorySelectedGender.pie", function(arc) {
    //select piecharts
    //filter type and category
    //highlight them
    //console.log(bar.data.type);
    var p = d3.selectAll(".pie");

    if(arc) {
        dispatch.call("categorySelectedForBarGender", null, categoryDataG[arc]);
        p.style('fill-opacity', .3);
        d3.selectAll("#" + arc).style('fill-opacity', 1);
    } else {
        dispatch.call("categorySelectedForBarGender", null, null);
        p.style('fill-opacity', 1);
        tooltip.style("display", "none");
    }
});

