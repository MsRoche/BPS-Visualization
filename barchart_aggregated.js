
//References
//https://bl.ocks.org/mbostock/3886208
//https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
//HW 8 code 
//https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
//http://jsfiddle.net/michaschwab/92afjqc8/15/
//https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
//https://stackoverflow.com/questions/16919280/how-to-update-axis-using-d3-js

//To Do
//sort by AP/Honors/Regular
//sort alphabetically
//sort by class size
//sort by subject

//VARIABLES


var dispatch = d3.dispatch("classSelectedRace", "categorySelectedRace", "pieClickRace", "categorySelectedForBarRace", "classSelectedGender", "categorySelectedGender", "pieClickGender", "categorySelectedForBarGender", "raceSortSelected", "genderSortSelected","raceLegendSelected","genderLegendSelected");

d3.selectAll(".race-button").on('click', function(d) { dispatch.call("raceSortSelected", null, d3.select(this).attr("id")); });

var barchart_race = d3.select(".barchart_race"),
    margin = {top: 20, right: 20, bottom: 170, left: 40},
    width = +barchart_race.attr("width") - margin.left - margin.right,
    height = +barchart_race.attr("height") - margin.top - margin.bottom,
    g = barchart_race.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.20)
    .align(.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var color = d3.scaleOrdinal()
    .range(["#8dd3c7", "#ffed6f", "#bebada", "#fb8072", "#80b1d3", "#fdb462"]);

var subG = g.append("g");


//LOAD DATA

d3.csv("AggregatedData.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < 7; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;
    
  var subsetData = data;

  var keys = data.columns.slice(1,7);

  function updateVis() {

      x.domain(subsetData.map(function(d) { return d.name; }));
      y.domain([0, 154]).nice();
      color.domain(keys);

      var bars = subG
        .selectAll("g")
        .data(d3.stack().keys(keys)(subsetData));
      
      bars
        .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x(d.data.name); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("id", function(d) {
              return d.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
            })
            .attr("class", "bar")
            .on('mouseover', function(d) { dispatch.call("classSelectedRace", null, d); })
            .on('mouseout', function(d) { dispatch.call("classSelectedRace", null, null); })
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX + 20 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html("<b>" + 
                    (d.data.name) + "</b>" + "<br>" +
                    "Native American: " + (d.data["Native American"]) + " students" + "<br>" + 
                    "White: " + (d.data.White) + " students" + "<br>" + 
                    "Other: " + (d.data.Other) + " students" + "<br>" +
                    "Asian: " + (d.data.Asian) + " students" + "<br>" + 
                    "Hispanic: " + (d.data.Hispanic) + " students" + "<br>" + 
                    "Black: " + (d.data.Black) + " students" + "<br>"
                    );
            });
          
      var barParts = bars
            .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; });
      
      barParts.enter().append('rect')
            .attr("x", function(d) { return x(d.data.name); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("class", "bar")
            .attr("id", function(d) {
              return d.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
            })
            .on('mouseover', function(d) { dispatch.call("classSelectedRace", null, d); })
            .on('mouseout', function(d) { dispatch.call("classSelectedRace", null, null); })
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX + 20 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html("<b>" + 
                    (d.data.name) + "</b>" + "<br>" +
                    "Black: " + (d.data.Black) + " students" + "<br>" + 
                    "Hispanic: " + (d.data.Hispanic) + " students" + "<br>" + 
                    "Asian: " + (d.data.Asian) + " students" + "<br>" + 
                    "White: " + (d.data.White) + " students" + "<br>" + 
                    "Other: " + (d.data.Other) + " students" + "<br>" + 
                    "Native American: " + (d.data["Native American"]) + " students" 
                    );
            });
      
      barParts
            .transition()
            .attr("x", function(d) { return x(d.data.name); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("id", function(d) {
              return d.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
            });
      
      barParts.exit().remove();
      bars.exit().remove();
  }

  updateVis();

  function createAxis() {

    g.append("g")
         .attr("class", "x_axis")
         .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.7em")
            .attr("transform", "rotate(-90)");

      g.append("g")
          .attr("class", "y_axis")
          .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("# Students");
  }

  createAxis();

  function createLegend() {
        var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color)
          .on('click', function(d) { dispatch.call("raceLegendSelected", null, d); });;

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });
  }

  createLegend();

  function updateAxis() {
      var rAx = d3.select(".barchart_race").selectAll(".x_axis");
    rAx
      .attr("class", "x_axis")
         .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.7em")
            .attr("transform", "rotate(-90)");
  }

  dispatch.on("pieClickRace.bar", function(arc) {
    subsetData = data.filter(function(d) { return d.type == arc || d.category == arc; });

    updateVis();
    updateAxis();

    d3.selectAll('rect').style('fill-opacity', 1);
  });

  dispatch.on("raceSortSelected.bar", function(d) {
    if(d == "reset") {
      subsetData = data;

      updateVis();
      updateAxis();
    }
    else if(d == "category") {
      subsetData = subsetData.sort(function(a, b) {
        if(a.category < b.category) return -1;
        if(a.category > b.category) return 1;
        return 0;
      });

      updateVis();
      updateAxis();
    }
    else if(d == "type") {
      subsetData = subsetData.sort(function(a, b) {
        if(a.type < b.type) return -1;
        if(a.type > b.type) return 1;
        return 0;
      });

      updateVis();
      updateAxis();
    }
    else if(d == "class_size") {
      subsetData = subsetData.sort(function(a, b) { return b.total - a.total; });
      
      updateVis();
      updateAxis();
    }
    else if(d == "alphabetically") {
      subsetData = subsetData.sort(function(a, b) {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });

      updateVis();
      updateAxis();
    } else {
      subsetData = subsetData;
    }
  });

  dispatch.on("raceLegendSelected.bar", function(d) {
    if(d == "Black") {
      subsetData = subsetData.sort(function(a, b) { return b.Black - a.Black; });
      
      updateVis();
      updateAxis();
    } 
    else if(d == "Hispanic") {
      subsetData = subsetData.sort(function(a, b) { return b.Hispanic - a.Hispanic; });
      
      updateVis();
      updateAxis();
    }
    else if(d == "Asian") {  
      subsetData = subsetData.sort(function(a, b) { return b.Asian - a.Asian; });
      
      updateVis();
      updateAxis();
    }
    else if(d == "Other") {
      subsetData = subsetData.sort(function(a, b) { return b.Other - a.Other; });
      
      updateVis();
      updateAxis();
    }
    else if(d == "White") {
      subsetData = subsetData.sort(function(a, b) { return b.White - a.White; });
      
      updateVis();
      updateAxis();
    }
    else if(d == "Native American") {
      subsetData = subsetData.sort(function(a, b) { return b["Native American"] - a["Native American"]; });
      
      updateVis();
      updateAxis();
    }
  });
});



dispatch.on("classSelectedRace.bar", function(bar) {
    var n = d3.select(".barchart_race").selectAll(".bar");

    if(bar) {
    	n.style("fill-opacity", .3)
    	var className = "#" + bar.data.name.replace(/ /g, "").replace("(", "").replace(")", "");
    	d3.selectAll(className).style("fill-opacity", 1);
    } else {
    	n.style("fill-opacity", 1);
      tooltip.style("display", "none");
    }
});


dispatch.on("categorySelectedForBarRace.bar", function(arc) {
    var n = d3.select(".barchart_race").selectAll('.bar');

    
    if(arc) {
        n.style('fill-opacity', .1);
        
        for (var i = 0; i < arc.length; i++) {
            var className = arc[i].name;
            d3.select(".barchart_race").selectAll("#" + className.replace(/ /g, "").replace("(", "").replace(")", ""))
                .style('fill-opacity', 1);
         }
    } else {
      n.style('fill-opacity', 1);
    }
});
