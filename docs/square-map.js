var data_mem = []; // Will contain our data for later analysis
var age_data_mem = [];
var player_data_mem = [];
var scale = d3.scaleLinear(); // An empty d3 quantize scale to make our choropleth
// This is the 'geographic' and label data for the states
var states_data = "https://raw.githubusercontent.com/jyjuni/5702_nba_salaries/main/docs/states_median.csv"
var age_data = "https://raw.githubusercontent.com/jyjuni/5702_nba_salaries/main/docs/states_age_median.csv"
var player_data = "https://raw.githubusercontent.com/jyjuni/5702_nba_salaries/main/docs/player_salary.csv"
var legend = false;

data = [states_data, age_data, player_data]
selector = '.map-container'
//render([states_data, age_data], '.map-container');
// Takes the location of the data CSV and the container element
// Parse the data
states_data = d3.csv(data[0], d => ({
        state: d.States,
        mean_salary: parseFloat(d.Mean_Salary)
        }))
age_data = d3.csv(data[1], d => ({
        state: d.States,
        age: parseInt(d.Age),
        avg_salary: parseFloat(d.Mean_Salary)
        }))
player_data = d3.csv(data[2], d => ({
        state: d.States,
        team: d.Tm,
        player_name: d.PlayerName,
        age: parseInt(d.Age),
        salary: parseInt(d.Salary)
        }))

// Load data and use data
Promise.all([states_data, age_data, player_data])
    .then(function(datas) {

    // Loop through states data (this.states)
    for (var key in states) {
        // Loop through the state data
        for (var j = 0; j < datas[0].length; j++) {
                // Check if the current selection in the states object matches the current selection in the data object
                if (states[key].full == datas[0][j].state) {
                    
                        // If matches, set that state's stateData property to the data
                        states[key].stateData = datas[0][j].mean_salary;

                        // Also add the data to the data array. This will be used to calculate min and max for the scale
                        data_mem.push(+datas[0][j].mean_salary);
                }
        }

        // Loop through the age data
        for (var j = 0; j < datas[1].length; j++) {

                // Check if the current selection in the states object matches the current selection in the data object
                if (states[key].full == datas[1][j].state) {

                        // If matches, set that state's stateAgeData property to the data
                        if (states[key].stateAgeData == null){
                            states[key].stateAgeData = []
                        }
                        states[key].stateAgeData.push(
                            {"age":datas[1][j].age, 
                             "salary":datas[1][j].avg_salary}) 

                        // Also add the data to the data array. This will be used to calculate min and max for the scale
                        age_data_mem.push(+datas[1][j].avg_salary);
                }
        }
        
        // Loop through the player data
        for (var j = 0; j < datas[2].length; j++) {

                // Check if the current selection in the states object matches the current selection in the data object
                if (states[key].full == datas[2][j].state) {

                        // If matches, set that state's statePlayerData property to the data
                        if (states[key].statePlayerData == null){
                            states[key].statePlayerData = []
                        }
                        states[key].statePlayerData.push(
                            {"age":datas[2][j].age, 
                             "salary":datas[2][j].salary,
                             "player_name":datas[2][j].player_name,
                             "team":datas[2][j].team
                            })

                        // Also add the data to the data array. This will be used to calculate min and max for the scale
                        player_data_mem.push(+datas[2][j].salary);
                }
        }
    }


    // Once the data is done parsing, actually draw the map
    drawStateMap(selector);
    drawLinechart(selector);

    svg = d3.select("div.map-container").select("svg")
    
    svg
        .select("g#rects")
        .selectAll("rect")
        .on("mouseover", showdata)
        .on("mouseout", undo);

});



//highlight and then update lineplot
function showdata() {
     //highlight selection
      highlight(this)

    //draw linechart on the side 
      agedata = d3.select(this).data()[0].stateAgeData
      playerdata = d3.select(this).data()[0].statePlayerData
      updateLinechart(selector, agedata, playerdata);
    };


//highlight state square on selection          
function highlight(selector){
    d3.select(selector)
        .attr("fill", function (d) { return d.stateData ? scale(d.stateData * .8) : 'lightgrey' })
        .attr("stroke", "white")
        .attr("stroke-width", "3")
    };

//undo highlight on mouseout
function undo() {
    d3.select(this)
        .attr("fill", function (d) { return d.stateData ? scale(d.stateData) : 'lightgrey' })
        .attr("stroke-width", "0")
    };

function drawStateMap(selector) {
        

        // Update the domain and range of the scale based on the user's data
        updateScaleRange();
        updateScaleDomain(data_mem);

        // Append an SVG to the container element, based on the user's set properties
        svg = d3.select(selector)
            .append('svg')
            .attr('width', 500)
            .attr('height', 300)
            .attr('viewBox', '0 0 858.8 600'); // Needed to make the map scale to the SVG size
        
        var margin = {top: 20, right: 20, bottom: 20, left: 20};

        var g = svg
        .append("g")
          .attr("id", "plot")
          .attr("transform", `translate (${margin.left}, ${margin.top})`)
         
        svg.append("text")
            .attr("x", 450)             
            .attr("y", 25)
            .attr("text-anchor", "middle")  
            .style("font-size", "30px") 
            .style("font-family", "Gill Sans")
            .text("NBA Players Median Salary State Map")

        // Append the SVG rect for each state to the SVG canvas
        map = g
            .append("g")
            .attr("id", "rects")
            .selectAll('rect')
            .data(Object.values(states)) // Bind the user's data
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
                return d.stateData ? scale(d.stateData) : 'lightgrey'; // Set the colors of each state using our data and scale
//                return "grey"
            });

            //add labels
            addLabels(g);
            
            //add legend
            g.append("g")
                .attr("class", "legendLinear")
                .attr("transform", `translate(0, 35)`);
        
            var legendLinear = d3.legendColor()
                                .shapeWidth(50)
                                .shapeHeight(40)
                                .labels(["2.5", "4.5", "6.5","8.5","10.5","12.5","14(M)"])
                                .cells(7)
                                .orient('horizontal')
                                .scale(scale);
            
            svg.select(".legendLinear")
              .call(legendLinear);

    };


function drawLinechart(selector) {
        
        // Update the domain and range of the scale based on the user's data
        updateScaleRange();
        updateScaleDomain(age_data_mem);

        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        
        // Append an SVG to the container element, based on the user's set properties
        var svg = d3.select(selector)
            .append("div")
            .attr("id", 'key')
            .append('svg')
            .attr('width', 800)
            .attr('height', 300);
        
        var bgrect = svg.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", 500)
            .attr("height", 300)
            .attr("fill", "white");
        
        
        var g = svg
            .append("g")
          .attr("id", "plot")
          .attr("transform", `translate (${margin.left}, ${margin.top})`)
        
        svg
            .append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate (${margin.left}, ${300 - margin.bottom})`)

        svg
            .append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate (${margin.left}, ${margin.top})`)
        
        g.append("path")
            .attr("class", "line")
        
    };


function add_legend(svg){
    // legend
    svg.append("circle").attr("cx",430).attr("cy",80).attr("r", 3.5).style("fill", "white").style("stroke", "grey")
    svg.append("circle").attr("cx",430).attr("cy",100).attr("r", 3.5).style("fill", "#3e4096")
    svg.append("text").attr("x", 440).attr("y", 80).text("single player(team, salary)")
        .style("font-size", "15px").attr("alignment-baseline","middle").style("font-family", "Gill Sans") 
    svg.append("text").attr("x", 440).attr("y", 100).text("median salary")
        .style("font-size", "15px").attr("alignment-baseline","middle").style("font-family", "Gill Sans") 

    // title and axis label
    // x-label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .style("font-size", "13px") 
        .style("font-family", "Gill Sans")
        .attr("x", 475)
        .attr("y", 280)
        .text("age");

    // y-label
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -30)
        .attr("y", 10)
        .attr("dy", ".75em")
        .style("font-size", "13px") 
        .style("font-family", "Gill Sans")
        .attr("transform", "rotate(-90)")
        .text("median salary(millions)");

   svg.append("text")
        .attr("x", 250)             
        .attr("y", 30)
        .attr("text-anchor", "middle") 
        .style("font-size", "16px") 
        .style("font-family", "Gill Sans")
        .text("State Median Salary per Age");
};

function updateLinechart(selector, agedata, playerdata) {
        
//        console.log(selector)
    
        if(agedata){
            
            var svg = d3.select(selector)
                         .select("#key")
                         .select("svg")
 
            if(legend == false){
                
                add_legend(svg);

                legend = true
            }

        
            var g = svg.select("g")

            ages = agedata.map(function (r) {return r["age"]});
            salaries = agedata.map(function (r) {return r["salary"]/1000000});  
            agedata = agedata.map(function (r) {return {"age":r["age"], "salary": r["salary"]/1000000}});  
            playerdata = playerdata.map(function (r) {return {"age":r["age"], 
                                                              "salary": r["salary"]/1000000, 
                                                              "team": r["team"],
                                                              "player_name": r["player_name"]}});  

            console.log(playerdata)

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
            svg.selectAll("g.xAxis")
                .call(xAxis);

            // Update the Y axis
            svg.selectAll("g.yAxis")   
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
    //            .transition()
    //            .duration(1500)
                .attr("class", "circle")
                .attr("r", 3.5)
                .attr("cx", d => xScale(d.age))
                .attr("cy", d => yScale(d.salary))
                .attr("fill", "#3e4096")
                .attr("opacity", 0)
                .transition()
                .duration(1500)
                .attr("opacity", 0.6);


            databind.exit()
                    .remove();

            var databind_player = g

                .selectAll(".symbol")
                .data(playerdata, d => d.age);

            var symbolGenerator = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(30);

            databind_player
                .enter()
                .append("circle")
                .merge(databind_player)
                .attr("class", "symbol")
//                .attr('transform', d => `translate(${xScale(d.age)}, ${yScale(d.salary)})`)
//    	        .attr('d', symbolGenerator())
                .attr("r", 5)
                .attr("cx", d => xScale(d.age))
                .attr("cy", d => yScale(d.salary))
                .attr("fill", "white")
                .attr("stroke", "grey")
                .attr("opacity", 0)
                .transition()
                .duration(1500)
                .attr("opacity", 0.8)
                ;

            databind_player.exit()
                    .remove();
            
            // show player name on selection
            g.selectAll(".symbol")
//                .selectAll("path")
                .on("mouseover", showName)
                .on("mouseout", redo)
            
            function showName() {
                var name = d3.select(this).data()[0].player_name
                var team = d3.select(this).data()[0].team
                var salary = d3.select(this).data()[0].salary.toFixed(1)
                var box = this.getBBox();
                console.log(box, box.x, box.y)
                var text_node =  g.append("g")
                    .attr('id', 'name_label') // Label the state
                
                text_node     
                        .append('text')
                        .text(`${name}(${team})`) // Set the text based on the state and the user's style choice
                        .attr('x', box.x + 12) // Set the x position based on the bounding box
                        .attr('y', box.y + 5) // Set the y position based on the bounding box
                        .attr('text-anchor', "start") // Center the text horizontally
                        .attr('alignment-baseline', 'middle') // Center the text vertically
                        .style('fill', "black") // Color the labels
                        .style("font-size", "15px") 
                        .style("font-family", "Gill Sans") 
                text_node  
                        .append('text')
                        .text(`${salary}M`) // Set the text based on the state and the user's style choice
                        .attr('x', box.x + 12) // Set the x position based on the bounding box
                        .attr('y', box.y + 20) // Set the y position based on the bounding box
                        .attr('text-anchor', "start") // Center the text horizontally
                        .attr('alignment-baseline', 'middle') // Center the text vertically
                        .style('fill', "black") // Color the labels
                        .style("font-size", "15px") 
                        .style("font-family", "Gill Sans") 
            };

            function redo(){
                g.selectAll("g#name_label").selectAll("text").data([])
                .exit().remove()
            };
            
        }


    
    };


// update the scale range
function updateScaleRange() {
        // Set the range
        scale.range(["white", "navy"]);
    };
    
// update the scale domain
function updateScaleDomain(data) {
        // Get the min and max form the user's data
        var min = d3.min(data);
        var max = d3.max(data);
        // Set the scale domain
        scale.domain([min, max]);
    };
     // Generate the state labels
function addLabels(selector) {

        // For each state on the map, make a label
        map.each(function(d) {

            // Get the bounding box (l,w,x,y) of the state
            var box = this.getBBox();

            // Append a text element to the SVG
            selector.append('text')
                .text(d['abbr']) // Set the text based on the state and the user's style choice
                .attr('x', box.x + (box.width/2)) // Set the x position based on the bounding box
                .attr('y', box.y + (box.height/2)) // Set the y position based on the bounding box
                .attr('class', 'state-label') // Label the state
                .attr('text-anchor', 'middle') // Center the text horizontally
                .attr('alignment-baseline', 'middle') // Center the text vertically
                .style('fill', "white") // Color the labels
                .style('font-family', 'Gill Sans'); // Set the label font
        });
    };
var states= {
    "AK": { // Which state
        "abbr": "AK", // Postal abbreviation
        "full": "Alaska", // AP abbreviation
        "ap": "Alaska", // Full name
        "x": 52, // x coordinate of square
        "y": 432, // y coordinate of square
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
        "y": 504,
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
};


