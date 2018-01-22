
//References
//https://bl.ocks.org/mbostock/3886208
//https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
//HW 8 code 
//https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
//http://jsfiddle.net/michaschwab/92afjqc8/15/

//To Do
//sort by AP/Honors/Regular
//sort alphabetically
//sort by class size
//sort by subject

//VARIABLES

d3.selectAll(".gender-button").on('click', function(d) { dispatch.call("genderSortSelected", null, d3.select(this).attr("id")); });

var barchart_gender = d3.select(".barchart_gender"),
    marginG = {top: 20, right: 20, bottom: 170, left: 40},
    widthG = +barchart_gender.attr("width") - marginG.left - marginG.right,
    heightG = +barchart_gender.attr("height") - marginG.top - marginG.bottom,
    gG = barchart_gender.append("g").attr("transform", "translate(" + marginG.left + "," + marginG.top + ")");

var tooltipG = d3.select("body").append("div").attr("class", "toolTip");

var xG = d3.scaleBand()
    .rangeRound([0, widthG])
    .paddingInner(0.20)
    .align(.1);

var yG = d3.scaleLinear()
    .rangeRound([heightG, 0]);

var colorG = d3.scaleOrdinal()
    .range(["#8dd3c7", "#ffed6f"]);

var subGend = gG.append("g");


d3.csv("AllData.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < 7; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

    var subsetDataG = data;
    
  var keys = data.columns.slice(7,9);

  function updateVis() {

      xG.domain(subsetDataG.map(function(d) { return d.name; }));
      yG.domain([0, 154]).nice();
      colorG.domain(keys);
      
      var barsG = subGend
      .selectAll("g")
      .data(d3.stack().keys(keys)(subsetDataG));
      
      barsG
        .enter().append("g")
        .attr("fill", function(d) { return colorG(d.key); 
                                  })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return xG(d.data.name); })
            .attr("y", function(d) { return yG(d[1]); })
            .attr("height", function(d) { return yG(d[0]) - yG(d[1]); })
            .attr("width", xG.bandwidth())
            .attr("class", "bar")
            .attr("id", function(d) {
              return d.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
            })
            .on('mouseover', function(d) { dispatch.call("classSelectedGender", null, d); })
            .on('mouseout', function(d) { dispatch.call("classSelectedGender", null, null); })
            .on("mousemove", function(d){
                tooltipG
                  .style("left", d3.event.pageX + 20 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html("<b>" + 
                    (d.data.name) + "</b>" + "<br>" +
                    "Female: " + (d.data.Female) + " students" + "<br>" +
                    "Male: " + (d.data.Male) + " students" + "<br>"
                    );
            });
      
      var barPartsG = barsG
            .attr("fill", function(d) { return colorG(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; });
            
     barPartsG.enter().append("rect")
            .attr("x", function(d) { return xG(d.data.name); })
            .attr("y", function(d) { return yG(d[1]); })
            .attr("height", function(d) { return yG(d[0]) - yG(d[1]); })
            .attr("width", xG.bandwidth())
            .attr("class", "bar")
            .attr("id", function(d) {
              return d.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
            })
            .on('mouseover', function(d) { dispatch.call("classSelectedGender", null, d); })
            .on('mouseout', function(d) { dispatch.call("classSelectedGender", null, null); })
            .on("mousemove", function(d){
                tooltipG
                  .style("left", d3.event.pageX + 20 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html("<b>" + 
                    (d.data.name) + "</b>" + "<br>" +
                    "Male: " + (d.data.Male) + " students" + "<br>" + 
                    "Female: " + (d.data.Female) + " students" + "<br>"
                    );
            });
         
         barPartsG
            .transition()
            .attr("x", function(d) { return xG(d.data.name); })
            .attr("y", function(d) { return yG(d[1]); })
            .attr("height", function(d) { return yG(d[0]) - yG(d[1]); })
            .attr("width", xG.bandwidth())
            .attr("id", function(d) {
              return d.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
            });
      
      barPartsG.exit().remove();
      barsG.exit().remove();
  }

  updateVis();
         
  function createAxis() {
         gG.append("g")
         .attr("class", "x_axis")
         .attr("transform", "translate(0," + heightG + ")")
         .call(d3.axisBottom(xG))
         .selectAll("text")  
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", "-.7em")
         .attr("transform", "rotate(-90)");

      gG.append("g")
          .attr("class", "y_axis")
          .call(d3.axisLeft(yG).ticks(null, "s")) //todo
        .append("text")
          .attr("x", 2)
          .attr("y", yG(yG.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("# Students");
  }
    createAxis(); 
    
    function createLegend() {
        var legend = gG.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
         
        legend.append("rect")
          .attr("x", widthG - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", colorG)
        .on('click', function(d) { 
        dispatch.call("genderLegendSelected", null, d); });;
        
        legend.append("text")
          .attr("x", widthG - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });
    }

    
    createLegend();
    
      function updateAxis() {
var gAx = d3.select(".barchart_gender").selectAll(".x_axis");
    gAx
      .attr("class", "x_axis")
         .attr("transform", "translate(0," + heightG + ")")
          .call(d3.axisBottom(xG))
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.7em")
            .attr("transform", "rotate(-90)");
      }
    

dispatch.on("pieClickGender.bar", function(arc) {
    subsetDataG = data.filter(function(d) { return d.type == arc || d.category == arc; });
    
    updateVis();
    updateAxis();

   d3.selectAll('rect').style('fill-opacity', 1);
});   

dispatch.on("genderSortSelected.bar", function(d){
    if(d == "reset") {
        subsetDataG = data; 
        updateVis();
        updateAxis();
    }
    else if(d == "category") {
      subsetDataG = subsetDataG.sort(function(a, b) {
        if(a.category < b.category) return -1;
        if(a.category > b.category) return 1;
        return 0;
      });

      updateVis();
      updateAxis();
    }
    else if(d == "type") {
      subsetDataG = subsetDataG.sort(function(a, b) {
        if(a.type < b.type) return -1;
        if(a.type > b.type) return 1;
        return 0;
      });

      updateVis();
      updateAxis();
    }
    else if(d == "class_size") {
      subsetDataG = subsetDataG.sort(function(a, b) { return b.total - a.total; });
      
      updateVis();
      updateAxis();
    }
        else if(d == "alphabetically") {
      subsetDataG = subsetDataG.sort(function(a, b) {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });

      updateVis();
      updateAxis();
    } else {
      subsetDataG = subsetDataG;
    }
});
    
  dispatch.on("genderLegendSelected.bar", function(d) {
    if(d == "Female") {
      subsetDataG = subsetDataG.sort(function(a, b) { return b.Female - a.Female; });
      
      updateVis();
      updateAxis();
    } 
    else if(d == "Male") {
      subsetDataG = subsetDataG.sort(function(a, b) { return b.Male - a.Male; });
      
      updateVis();
      updateAxis();
    }
  });
});

dispatch.on("classSelectedGender.bar", function(bar) {
    var n = d3.select(".barchart_gender").selectAll(".bar");

    if(bar) {
    	n.style("fill-opacity", .3)
    	var className = "#" + bar.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
    	d3.selectAll(className).style("fill-opacity", 1);
    } else {
    	n.style("fill-opacity", 1);
      tooltipG.style("display", "none");
    }
});


dispatch.on("categorySelectedForBarGender.bar", function(arc){
    var n = d3.select(".barchart_gender").selectAll('.bar');

    if(arc) {
        n.style('fill-opacity', .1);
        
        for (var i = 0; i < arc.length; i++) {
            var className = arc[i].name;
            d3.select(".barchart_gender").selectAll("#" + className.replace(/ /g, "").replace("(", "").replace(")", ""))
                .style('fill-opacity', 1);
         }
    } else {
      n.style('fill-opacity', 1);
    }
});

