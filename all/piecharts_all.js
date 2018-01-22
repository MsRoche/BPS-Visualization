// CLASS
// Contains numbers of students of each race
function races(black, hispanic, asian, other, white, nativeAmerican) {
    this.Black = +black;
    this.Hispanic = +hispanic;
    this.Asian = +asian;
    this.Other = +other;
    this.White = +white;
    this["Native American"] = +nativeAmerican;
}

// FUNCTION
// Returns an empty races object
function emptyRaces() {
    return new races(0, 0, 0, 0, 0, 0);
}

// FIELDS
// Lists for categories
var artsList = [],
    languageList = [],
    stemList = [],
    humanitiesList = [],
    regularList = [], 
    honorsList = [],
    apList = [];

// OBJECT
// Contains all lists
var categoryData = {
    Arts : artsList,
    Language : languageList,
    STEM : stemList,
    Humanities : humanitiesList,
    Regular : regularList,
    Honors : honorsList,
    AP : apList
};

// OBJECT
// Data for pie charts
var data = {
    Arts : emptyRaces(),
    Language : emptyRaces(),
    STEM : emptyRaces(),
    Humanities : emptyRaces(),
    Regular : emptyRaces(),
    Honors : emptyRaces(),
    AP : emptyRaces()
}

// Data for pie charts
var rawData = [];

// Extracting data from AllData.csv
d3.csv("AllData.csv", function(data) {  
    return {
        name : data.name,
        Black : +data.Black,
        Hispanic : +data.Hispanic,
        Asian : +data.Asian,
        Other : +data.Other,
        White : +data.White,
        "Native American" : +data["Native American"],
        Male : +data.Male,
        Female : +data.Female,
        type : data.type,
        category : data.category
    };
}, function(error, d1) {    
    d1.forEach(function(d2) {
        // Compiling category lists
        switch (d2.category) {
            case "Arts":
                artsList.push(d2);
                break;
            case "Humanities": 
                humanitiesList.push(d2);
                break;
            case "Language":
                languageList.push(d2);
                break;
            case "STEM":
                stemList.push(d2);
                break;
        }
        
        // Compiling type lists
        switch (d2.type) {
            case "Regular":
                regularList.push(d2);
                break;
            case "Honors":
                honorsList.push(d2);
                break;
            case "AP":
                apList.push(d2);
                break;
        }
        
        // Checks if given field is a race
        function isRace(field) {
            switch (field) {
                case "Black":
                case "Hispanic":
                case "Asian":
                case "Other":
                case "White":
                case "Native American":
                    return true;
            }
            
            return false;
        }
        
        // Checks if given field is a type
        function isType(field) {
            if (field === "type") {
                return true;
            }
            
            return false;
        }
        
        for (var d2Key in d2) { 
            if (isRace(d2Key)) {
                data[d2.category][d2Key] = data[d2.category][d2Key] + +d2[d2Key];
                                
                data[d2.type][d2Key] = data[d2.type][d2Key] + +d2[d2Key];
            } 
        }})
        
        for (var cKey in data) {
            var list = [];
            for (var rKey in data[cKey]) {
                list.push(data[cKey][rKey]);
            }
            rawData.push(list);
        }

var margin = 10,
    radius = 100,
    width = (radius + margin) * 2,
    height = (radius + margin) * 2;
    
var color = d3.scaleOrdinal(["#8dd3c7", "#ffed6f", "#bebada", "#fb8072", "#80b1d3", "#fdb462"]);

var arc = d3.arc()
            .innerRadius(radius / 2)
            .outerRadius(radius);
    
var arcOver = d3.arc()
        .outerRadius(radius + 9);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

// Gets the category that is associated with the given index
function getCategory(i) {
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
for (var i = 0; i < rawData.length; i++) {
    var svg = d3.select("#piecharts_race").append("svg")
    .attr("id", getCategory(i))
    .attr("class", "pie")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
    svg.append("text")
        .attr("text-anchor", "middle")
         .style('font-size', '18px')
             .style('font-family', 'sans-serif')
         .attr('y', 10)
       .text(getCategory(i));
    
    var g = svg.selectAll(".arc")
      .data(pie(rawData[i]))
    .enter().append("g")
    .attr("text", getCategory(i))
      .attr("class", "arc")
    .on('mouseover', function(d) { dispatch.call("categorySelectedRace", null, d3.select(this).attr('text')); })
    .on('mouseout', function(d) { dispatch.call("categorySelectedRace", null, null); })
    .on("mousemove", function(d){
            var cat = d3.select(this).attr("text");
        
            tooltip
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("<b>" + 
                cat + "</b>" + "<br>" +
                "Black: " + (data[cat].Black) + " students" + "<br>" + 
                "Hispanic: " + (data[cat].Hispanic) + " students" + "<br>" + 
                "Asian: " + (data[cat].Asian) + " students" + "<br>" + 
                "White: " + (data[cat].White) + " students" + "<br>" + 
                "Other: " + (data[cat].Other) + " students" + "<br>" + 
                "Native American: " + (data[cat]["Native American"]) + " students" 
                );
        })
    .on('click', function(d) { dispatch.call("pieClickRace", null, d3.select(this).attr('text')); });

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) { return color(i); });
    }
});



dispatch.on("classSelectedRace.pie", function(bar) {
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

dispatch.on("categorySelectedRace.pie", function(arc) {
    //select piecharts
    //filter type and category
    //highlight them
    //console.log(bar.data.type);
    var p = d3.selectAll(".pie");
    console.log(categoryData[arc]);

    if(arc) {
        dispatch.call("categorySelectedForBarRace", null, categoryData[arc]);
        p.style('fill-opacity', .3);
        d3.selectAll("#" + arc).style('fill-opacity', 1);
    } else {
        dispatch.call("categorySelectedForBarRace", null, null);
        p.style('fill-opacity', 1);
        tooltip.style("display", "none");
    }

});

