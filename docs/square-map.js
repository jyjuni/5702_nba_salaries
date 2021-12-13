var states_data = "https://raw.githubusercontent.com/jyjuni/5702_nba_salaries/main/docs/states_median.csv"
var age_data = "https://raw.githubusercontent.com/jyjuni/5702_nba_salaries/main/docs/states_age_median.csv"
data = [states_data, age_data]
selector = '.map-container'
//d3.squareMap.render([states_data, age_data], '.map-container');
// Takes the location of the data CSV and the container element
// Parse the data
data1 = d3.csv(data[0], d => ({
        state: d.States,
        mean_salary: parseFloat(d.Mean_Salary)
        }))
data2 = d3.csv(data[1], d => ({
        state: d.States,
        age: parseInt(d.Age),
        avg_salary: parseFloat(d.Mean_Salary)
        }))

Promise.all([data1, data2]).then(function(datas) {

    // Loop through states data (this.states)
//            console.log(d3.squareMap.states)
    // Loop through states data (this.states)
    for (var key in d3.squareMap.states) {
        // Loop through the state data
        for (var j = 0; j < datas[0].length; j++) {
                // Check if the current selection in the states object matches the current selection in the data object
                if (d3.squareMap.states[key].full == datas[0][j].state) {

//                                    console.log(key, data[j].mean_salary)
                        // If it does, set that state's stateData property to the data
                        // The data from here will be used in tooltips and such
                        d3.squareMap.states[key].stateData = datas[0][j].mean_salary;

                        // Also add the data to the data array. This will be used to calculate min and max for the scale
                        d3.squareMap.data.push(+datas[0][j].mean_salary);
                }
        }

        // Loop through the age data
        for (var j = 0; j < datas[1].length; j++) {

                // Check if the current selection in the states object matches the current selection in the data object
                if (d3.squareMap.states[key].full == datas[1][j].state) {

//                                    console.log(key, data[j].mean_salary)
                        // If it does, set that state's stateData property to the data
                        // The data from here will be used in tooltips and such
                        if (d3.squareMap.states[key].stateAgeData == null){
                            d3.squareMap.states[key].stateAgeData = []
                        }
                        d3.squareMap.states[key].stateAgeData.push({"age":datas[1][j].age, "salary":datas[1][j].avg_salary})
//                                        d3.squareMap.states[key].stateAgeData["salary"] = datas[1][j].avg_salary;

                        // Also add the data to the data array. This will be used to calculate min and max for the scale
                        d3.squareMap.age_data.push(+datas[1][j].avg_salary);
                }
        }
    }


    console.log(d3.squareMap.states)


    // Once the data is done parsing, actually draw the map
    d3.squareMap.draw(selector);
    d3.squareMap.drawBarchart(selector);




    // select and highlight       
    function showdata() {
         //highlight
          d3.select(this)
            .attr("fill", function (d) { return d.stateData ? d3.squareMap.scale(d.stateData * .8) : 'lightgrey' })
            .attr("stroke", "white")
            .attr("stroke-width", "3")
        //draw barchart on the side 
        console.log(d3.select(this).data()[0].stateAgeData)
          d3.squareMap.updateBarchart(selector, d3.select(this).data()[0].stateAgeData);
        };

    function gonormal() {
      d3.select(this)
        .attr("fill", function (d) { return d.stateData ? d3.squareMap.scale(d.stateData) : 'lightgrey' })
        .attr("stroke-width", "0")
        };



    //highlight rect on selection
    d3.select("div.map-container").select("svg")
        .select("g#rects")
        .selectAll("rect")
        .on("mouseover", showdata)
        .on("mouseout", gonormal);

});







// Everything for our module is contained in a object as a property of d3
d3.squareMap = {
    // Default properties of the map
    width: null, // Width
    colorSet: 'navy', // The ColorBrewer set to use
    colorNumber: 6, // The number of steps in the ColorBrewer scale
    labels: true, // Whether or not the map has labels
    labelTypeface: 'sans-serif', // Font of the labels
    labelStyle: 'abbr', // Kind of labels (e.g. CT vs. Conn.)
    labelColor: 'white', // Color of labels
    data: [], // Will contain our data for later analysis
    age_data: [],
    scale: d3.scaleLinear(), // An empty d3 quantize scale to make our choropleth
    // This is the 'geographic' and label data for the states
    states: {
        "AK": { // Which state
            "abbr": "AK", // Postal abbreviation
            "full": "Alaska", // AP abbreviation
            "ap": "Alaska", // Full name
            "x": 0, // x coordinate of square
            "y": 100, // y coordinate of square
            "w": 66, // width
            "h": 66, // height
        },
        "AL": {
            "abbr": "AL",
            "full": "Alabama",
            "ap": "Ala.",
            "x": 504,
            "y": 432,
            "w": 66,
            "h": 66
        },
        "AR": {
            "abbr": "AR",
            "full": "Arkansas",
            "ap": "Ark.",
            "x": 360,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "AZ": {
            "abbr": "AZ",
            "full": "Arizona",
            "ap": "Ariz.",
            "x": 144,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "CA": {
            "abbr": "CA",
            "full": "California",
            "ap": "Calif.",
            "x": 72,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "CO": {
            "abbr": "CO",
            "full": "Colorado",
            "ap": "Colo.",
            "x": 216,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "CT": {
            "abbr": "CT",
            "full": "Connecticut",
            "ap": "Conn.",
            "x": 720,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "DC": {
            "abbr": "DC",
            "full": "Washington DC",
            "ap": "D.C.",
            "x": 648,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "DE": {
            "abbr": "DE",
            "full": "Delaware",
            "ap": "Del.",
            "x": 720,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "FL": {
            "abbr": "FL",
            "full": "Florida",
            "ap": "Fla.",
            "x": 648,
            "y": 504,
            "w": 66,
            "h": 66
        },
        "GA": {
            "abbr": "GA",
            "full": "Georgia",
            "ap": "Ga.",
            "x": 576,
            "y": 432,
            "w": 66,
            "h": 66
        },
        "HI": {
            "abbr": "HI",
            "full": "Hawaii",
            "ap": "Hawaii",
            "x": 52,
            "y": 490,
            "w": 66,
            "h": 66
        },
        "IA": {
            "abbr": "IA",
            "full": "Iowa",
            "ap": "Iowa",
            "x": 360,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "ID": {
            "abbr": "ID",
            "full": "Idaho",
            "ap": "Idaho",
            "x": 144,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "IL": {
            "abbr": "IL",
            "full": "Illinois",
            "ap": "Ill.",
            "x": 432,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "IN": {
            "abbr": "IN",
            "full": "Indiana",
            "ap": "Ind.",
            "x": 432,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "KS": {
            "abbr": "KS",
            "full": "Kansas",
            "ap": "Kan.",
            "x": 288,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "KY": {
            "abbr": "KY",
            "full": "Kentucky",
            "ap": "Ky.",
            "x": 432,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "LA": {
            "abbr": "LA",
            "full": "Louisiana",
            "ap": "La.",
            "x": 360,
            "y": 432,
            "w": 66,
            "h": 66
        },
        "MA": {
            "abbr": "MA",
            "full": "Massachusetts",
            "ap": "Mass.",
            "x": 720,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "MD": {
            "abbr": "MD",
            "full": "Maryland",
            "ap": "Md.",
            "x": 648,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "ME": {
            "abbr": "ME",
            "full": "Maine",
            "ap": "Maine",
            "x": 792.8,
            "y": 0,
            "w": 66,
            "h": 66
        },
        "MI": {
            "abbr": "MI",
            "full": "Michigan",
            "ap": "Mich",
            "x": 504,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "MN": {
            "abbr": "MN",
            "full": "Minnesota",
            "ap": "Minn.",
            "x": 360,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "MO": {
            "abbr": "MO",
            "full": "Missouri",
            "ap": "Mo.",
            "x": 360,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "MS": {
            "abbr": "MS",
            "full": "Mississippi",
            "ap": "Miss.",
            "x": 432,
            "y": 432,
            "w": 66,
            "h": 66
        },
        "MT": {
            "abbr": "MT",
            "full": "Montana",
            "ap": "Mont.",
            "x": 216,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "NC": {
            "abbr": "NC",
            "full": "North Carolina",
            "ap": "N.C.",
            "x": 504,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "ND": {
            "abbr": "ND",
            "full": "North Dakota",
            "ap": "N.D.",
            "x": 288,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "NE": {
            "abbr": "NE",
            "full": "Nebraska",
            "ap": "Neb.",
            "x": 288,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "NH": {
            "abbr": "NH",
            "full": "New Hampshire",
            "ap": "N.H.",
            "x": 792.8,
            "y": 72,
            "w": 66,
            "h": 66
        },
        "NJ": {
            "abbr": "NJ",
            "full": "New Jersey",
            "ap": "N.J.",
            "x": 648,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "NM": {
            "abbr": "NM",
            "full": "New Mexico",
            "ap": "N.M.",
            "x": 216,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "NV": {
            "abbr": "NV",
            "full": "Nevada",
            "ap": "Nev.",
            "x": 144,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "NY": {
            "abbr": "NY",
            "full": "New York",
            "ap": "N.Y.",
            "x": 648,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "OH": {
            "abbr": "OH",
            "full": "Ohio",
            "ap": "Ohio",
            "x": 504,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "OK": {
            "abbr": "OK",
            "full": "Oklahoma",
            "ap": "Okla.",
            "x": 288,
            "y": 432,
            "w": 66,
            "h": 66
        },
        "OR": {
            "abbr": "OR",
            "full": "Oregon",
            "ap": "Ore.",
            "x": 72,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "PA": {
            "abbr": "PA",
            "full": "Pennsylvania",
            "ap": "Pa.",
            "x": 576,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "RI": {
            "abbr": "RI",
            "full": "Rhode Island",
            "ap": "R.I.",
            "x": 792.8,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "SC": {
            "abbr": "SC",
            "full": "South Carolina",
            "ap": "S.C.",
            "x": 576,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "SD": {
            "abbr": "SD",
            "full": "South Dakota",
            "ap": "S.D.",
            "x": 288,
            "y": 216,
            "w": 66,
            "h": 66
        },
        "TN": {
            "abbr": "TN",
            "full": "Tennessee",
            "ap": "Tenn.",
            "x": 432,
            "y": 360,
            "w": 66,
            "h": 66
        },
        "TX": {
            "abbr": "TX",
            "full": "Texas",
            "ap": "Texas",
            "x": 288,
            "y": 504,
            "w": 66,
            "h": 66
        },
        "UT": {
            "abbr": "UT",
            "full": "Utah",
            "ap": "Utah",
            "x": 144,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "VA": {
            "abbr": "VA",
            "full": "Virginia",
            "ap": "Va.",
            "x": 576,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "VT": {
            "abbr": "VT",
            "full": "Vermont",
            "ap": "Vt.",
            "x": 720,
            "y": 72,
            "w": 66,
            "h": 66
        },
        "WA": {
            "abbr": "WA",
            "full": "Washington",
            "ap": "Wash.",
            "x": 72,
            "y": 144,
            "w": 66,
            "h": 66
        },
        "WI": {
            "abbr": "WI",
            "full": "Wisconsin",
            "ap": "Wis.",
            "x": 432,
            "y": 72,
            "w": 66,
            "h": 66
        },
        "WV": {
            "abbr": "WV",
            "full": "West Virginia",
            "ap": "W. Va.",
            "x": 504,
            "y": 288,
            "w": 66,
            "h": 66
        },
        "WY": {
            "abbr": "WY",
            "full": "Wyoming",
            "ap": "Wyo.",
            "x": 216,
            "y": 216,
            "w": 66,
            "h": 66
        }
    },
    // Called by the user to render the map
    drawBarchart: function(selector) {
        
        // Update the domain and range of the scale based on the user's data
        this.updateScaleRange();
        this.updateScaleDomain();
//
//        // Check if the user has set a custom width
//        if (!this.width) {
//            // If not, set the width based on the width of the containing element
//            this.width = d3.select(selector).node().getBoundingClientRect().width;
//            this.height = this.width * 0.66371681415;
//        } else {
//            this.height = this.width * 0.66371681415;
//        }

        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        
        // Append an SVG to the container element, based on the user's set properties
        this.svg = d3.select(selector)
            .append("div")
            .attr("id", 'key')
            .append('svg')
            .attr('width', 500)
            .attr('height', 300);
        
        this.bgrect = this.svg.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", 500)
            .attr("height", 300)
            .attr("fill", "white");
        
        
        var g = this.svg
            .append("g")
          .attr("id", "plot")
          .attr("transform", `translate (${margin.left}, ${margin.top})`)
        
        this.svg
            .append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate (${margin.left}, ${300 - margin.bottom})`)

        this.svg
            .append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate (${margin.left}, ${margin.top})`)

        g.append("text")
                .attr("x", 200)             
                .attr("y", 0)
                .attr("text-anchor", "middle") 
                .attr("fill", "white")
                .style("font-size", "16px") 
                .text("State Median Salary per Age");
        
        g.append("path")
            .attr("class", "line")
        
        
        // x-label
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .style("font-size", "13px") 
            .attr("fill", "white")
            .attr("x", 475)
            .attr("y", 280)
            .text("age");
           
        // y-label
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("fill", "white")
            .attr("x", -30)
            .attr("y", 10)
            .attr("dy", ".75em")
            .style("font-size", "13px") 
            .attr("transform", "rotate(-90)")
            .text("median salary(millions)");
 
    },
    
    updateBarchart: function(selector, agedata) {
        
        if(agedata){
            
            this.svg.selectAll("text")
                .attr("fill", "black")
        
            this.svg = d3.select(selector)
                         .select("#key")
                         .select("svg")
      

            var g = this.svg.select("g")

            ages = agedata.map(function (r) {return r["age"]});
            salaries = agedata.map(function (r) {return r["salary"]/1000000});  
            agedata = agedata.map(function (r) {return {"age":r["age"], "salary": r["salary"]/1000000}});  

//            console.log(salaries)

            var margin = {top: 50, right: 50, bottom: 50, left: 50};
            var innerWidth = 500 - margin.left - margin.right;
            var innerHeight = 300 - margin.top - margin.bottom;

        // update scirpts
        var xScale = d3.scaleLinear()
            .domain([20, 40])
            .range([0, innerWidth]);

        var yScale = d3.scaleLinear()
            .domain([0, 45])
            .range([innerHeight, 0]);

        var xAxis = d3.axisBottom()
           .scale(xScale);

        var yAxis = d3.axisLeft()
           .scale(yScale);
            
        // Update the X axis:
        this.svg.selectAll("g.xAxis")
            .call(xAxis);
        
        // Update the Y axis
        this.svg.selectAll("g.yAxis")   
            .call(yAxis);


                        
        var line = d3.line()
            .x(d => xScale(d.age))
            .y(d => yScale(d.salary));
            
        var databind_line = g.selectAll(".line")
            .datum(agedata, d => d.age);

        databind_line
            .enter()
            .append("path")
            .merge(databind_line)
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#9e9fca")
            .attr("mix-blend-mode", "multiply")
            .attr("stroke-width", 3)
            .attr("stroke-linejoin", "round")
            .attr("opacity", 0.6)
            .attr("d", line(agedata))
            
            
        var databind = g.selectAll(".circle")
            .data(agedata, d => d.age);

        databind.enter()
            .append("circle")
            .merge(databind)
            .transition()
            .duration(1000)
            .attr("class", "circle")
            .attr("r", 3.5)
            .attr("cx", d => xScale(d.age))
            .attr("cy", d => yScale(d.salary))
            .attr("fill", "#3e4096")
            .attr("opacity", 0.6);

        databind.exit()
                .remove();
        }
        
    },
    
    draw: function(selector) {
        

        // Update the domain and range of the scale based on the user's data
        this.updateScaleRange();
        this.updateScaleDomain();

        // Append an SVG to the container element, based on the user's set properties
        this.svg = d3.select(selector)
            .append('svg')
            .attr('width', 500)
            .attr('height', 300)
            .attr('viewBox', '0 0 858.8 600'); // Needed to make the map scale to the SVG size
        
        var margin = {top: 20, right: 20, bottom: 20, left: 20};

        
        var g = this.svg
        .append("g")
          .attr("id", "plot")
          .attr("transform", `translate (${margin.left}, ${margin.top})`)
         
        this.svg.append("text")
            .attr("x", 450)             
            .attr("y", 25)
            .attr("text-anchor", "middle")  
            .style("font-size", "30px") 
            .text("NBA Players Median Salary State Map")

        // Append the SVG rect for each state to the SVG canvas
        this.map = g
            .append("g")
            .attr("id", "rects")
            .selectAll('rect')
            .data(Object.values(this.states)) // Bind the user's data
            .enter()
            .append('rect') // Create the rect
            .attr('width', function(d) {
                return d.w; // Set width dynamically
            })
            .attr('height', function(d) {
                return d.h; // Set height dynamically
            })
            .attr('x', function(d) {
                return d.x; // Set x dynamically
            })
            .attr('y', function(d) {
                return d.y; // Set y dynamically
            }).attr('fill', function(d) {
//            console.log(d.stateData)
                return d.stateData ? d3.squareMap.scale(d.stateData) : 'lightgrey'; // Set the colors of each state using our data and scale
//                return "grey"
            });

            // If the user wants labels, generate them
            if (this.labels) {
                this.addLabels(g); // Call addLabels() on the SVG
            }
//        
//            var legend = d3.legendColor()
//                .scale(this.scale);

            g.append("g")
                .attr("class", "legendLinear")
                    .attr("transform", `translate(0,30)`);
        
            var legendLinear = d3.legendColor()
                                .shapeWidth(50)
                                .shapeHeight(30)
                                .labels(["2.5", "4.5", "6.5","8.5","10.5","12.5","14(M)"])
                                .cells(7)
                                .orient('horizontal')
                                .scale(this.scale);

            this.svg.select(".legendLinear")
              .call(legendLinear);

    },
    // Generate the state labels
    addLabels: function(selector) {

        // For each state on the map, make a label
        this.map.each(function(d) {

            // Get the bounding box (l,w,x,y) of the state
            var box = this.getBBox();

            // Append a text element to the SVG
            selector.append('text')
                .text(d[d3.squareMap.labelStyle]) // Set the text based on the state and the user's style choice
                .attr('x', box.x + (box.width/2)) // Set the x position based on the bounding box
                .attr('y', box.y + (box.height/2)) // Set the y position based on the bounding box
                .attr('class', 'state-label') // Label the state
                .attr('text-anchor', 'middle') // Center the text horizontally
                .attr('alignment-baseline', 'middle') // Center the text vertically
                .style('fill', d3.squareMap.labelColor) // Color the labels
                .style('font-family', d3.squareMap.labelTypeface); // Set the label font
        });
    },
    


    // Setter method to allow the user to set properties. Takes an object of properties as its argument.
    setAttr: function(attr) {

        // For each key in the attr object...
        for (var key in attr) {
            // If that key is also a key in this
            if (key in this) {
                // Set the value of the this key to the value of the attr key
                this[key] = attr[key];
            } else {
                // Otherwise, throw an error
                throw new Error("Property '" + key + "' does not exist.");
            }
        }

        // Return this so the functions can be chained
        return this;
    },
    
    // Method to update the scale range
    updateScaleRange: function() {
        // Get the colorset and number
        var palette = this.colorSet,
            number = this.colorNumber;
        // Set the range
        this.scale.range(["white", palette]);
    },
    
    // Method to update the scale domain
    updateScaleDomain: function() {
        // Get the min and max form the user's data
        var min = d3.min(this.data);
        var max = d3.max(this.data);
        // Set the scale domain
        this.scale.domain([min, max]);
    }, 
    
    onClick: function(userFunction) {
        this.map.onclick = userFunction;
    },
}
