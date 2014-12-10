var chartGenerator = function() {
	/*this.chart 						= new AmCharts.AmSerialChart();
    this.chart.pathToImages 		= "/git/amcharts-generator/amcharts/images/";
	this.chart.plotAreaBorderColor 	= "#000000";
	this.chart.plotAreaBorderAlpha 	= 1;
	this.chart.categoryField 		= "d";
	
	var categoryAxis = this.chart.categoryAxis;
	categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
	categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD                
	categoryAxis.tickLenght = 0;
	
	var chartCursor = new AmCharts.ChartCursor();
	this.chart.addChartCursor(chartCursor);
	
	var chartScrollbar 				= new AmCharts.ChartScrollbar();
	chartScrollbar.scrollbarHeight 	= 30;
	chartScrollbar.graph 			= graph;
	chartScrollbar.graphType 		= "line";
	chartScrollbar.gridCount 		= 4;
	chartScrollbar.color 			= "#FFFFFF";
	this.chart.addChartScrollbar(chartScrollbar);*/
	
	
	this.datasetBuffer 	= {};
	this.datasets 		= [];
}
chartGenerator.prototype.add = function(dataset) {
	var scope	= this;
	
	this.datasets.push(dataset);
	
	console.log("dataset.type",dataset.type);
	switch (dataset.type) {
		case "ohlc":
			/*_.each(dataset.data, function(datapoint) {
				var d = datapoint.d.toISOString();
				if (!scope.datasetBuffer.hasOwnProperty(d)) {
					scope.datasetBuffer[d] = {
						date:	d
					};
				}
				_.each();
				scope.datasetBuffer[d][] = datapoint.v;
				
			});
			
			console.log("scope.datasetBuffer",scope.datasetBuffer);*/
			/*var graph 				= new AmCharts.AmGraph();
			graph.title 			= "Price:";
			graph.type 				= "ohlc";
			graph.lineColor 		= "#7f8da9";
			graph.fillColors 		= "#7f8da9";
			graph.negativeLineColor = "#db4c3c";
			graph.negativeFillColors = "#db4c3c";
			// candlestick graph has 4 fields - open, low, high, close
			graph.openField 		= "o";
			graph.highField 		= "h";
			graph.lowField 			= "l";
			graph.closeField 		= "c";
			// this will be used by scrollbar's graph, as we force it to "line" type
			graph.valueField 		= "c";
			graph.balloonText		 = "Open:<b>[[o]]</b><br>Low:<b>[[l]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>";
			this.chart.addGraph(graph);*/
		break;
	}
}
chartGenerator.prototype.generate = function(id) {
	var scope	= this;
	
	//this.chart.write(id);
	_.each(this.datasets, function(dataset, index) {
		
			_.each(dataset.data, function(datapoint) {
				var d = datapoint.d;
				if (!scope.datasetBuffer.hasOwnProperty(d)) {
					scope.datasetBuffer[d] = {
						date:	d
					};
				}
				_.each(datapoint, function(value, key) {
					if (key != 'd') {
						scope.datasetBuffer[d][key+'-'+index] = value.toFixed(2);
					}
				});
				//scope.datasetBuffer[d][] = datapoint.v;
				
			});
	});
	
	//console.log("datasetBuffer",this.datasetBuffer);
	
	// Now we recreate the array();
	var datasetArray = [];
	_.each(this.datasetBuffer, function(values, date) {
		datasetArray.push(values);
	});
	datasetArray = datasetArray.sort(function(a,b) {
		return a.date-b.date;
	});
	
	// Convert the dates
	datasetArray = _.map(datasetArray, function(item) {
		item.date = new Date(item.date);
		return item;
	});
	
	console.log("datasetArray",datasetArray);
	
	
	// SERIAL CHART
	var chart;
	
	chart = new AmCharts.AmSerialChart();
    chart.pathToImages 				= "/git/amcharts-generator/amcharts/images/";
	chart.dataProvider 				= datasetArray;
	chart.plotAreaBorderColor 		= "#000000";
	chart.plotAreaBorderAlpha 		= 1;
	chart.categoryField 			= "date";
	
	// AXES
	// Category
	var categoryAxis 				= chart.categoryAxis;
	categoryAxis.parseDates 		= true; // as our data is date-based, we set parseDates to true
	categoryAxis.minPeriod 			= "DD"; // our data is daily, so we set minPeriod to DD                
	categoryAxis.tickLenght 		= 0;
	
	
	// GRAPH
	_.each(this.datasets, function(dataset, index) {
		switch (dataset.type) {
			case "ohlc":
				var graph 						= new AmCharts.AmGraph();
				graph.title 					= "Price:";
				graph.type 						= "ohlc";
				graph.lineColor					= "#7f8da9";
				graph.fillColors				= "#7f8da9";
				graph.negativeLineColor			= "#db4c3c";
				graph.negativeFillColors		= "#db4c3c";
				// candlestick graph has 4 fields - open, low, high, close
				graph.openField					= "o-"+index;
				graph.highField					= "h-"+index;
				graph.lowField					= "l-"+index;
				graph.closeField				= "c-"+index;
				graph.valueField				= "c-"+index;
				graph.balloonText				= "Open:<b>[[o-"+index+"]]</b><br>Low:<b>[[l-"+index+"]]</b><br>High:<b>[[h-"+index+"]]</b><br>Close:<b>[[c-"+index+"]]</b><br>";
				chart.addGraph(graph);
				
				// SCROLLBAR
				var chartScrollbar 				= new AmCharts.ChartScrollbar();
				chartScrollbar.scrollbarHeight 	= 30;
				chartScrollbar.graph 			= graph;
				chartScrollbar.graphType 		= "line";
				chartScrollbar.gridCount 		= 4;
				chartScrollbar.color 			= "#FFFFFF";
				chart.addChartScrollbar(chartScrollbar);
			break;
			case "zone":
				// Double chart
				var graphDown 					= new AmCharts.AmGraph();
				graphDown.title 				= dataset.name;
				graphDown.type 					= 'line';
				graphDown.lineColor				= dataset.color;
				graphDown.valueField			= "down-"+index;
				graphDown.balloonText			= dataset.name+" (down):<b>[[down-"+index+"]]</b>";
				graphDown.fillAlphas 			= 0;
				chart.addGraph(graphDown);
				
				var graphUp 					= new AmCharts.AmGraph();
				graphUp.title 					= dataset.name;
				graphUp.type 					= 'line';
				graphUp.lineColor				= dataset.color;
				graphUp.valueField				= "up-"+index;
				graphUp.balloonText				= dataset.name+" (up):<b>[[up-"+index+"]]</b>";
				graphUp.fillToGraph				= graphDown;
				graphUp.fillAlphas				= 0.8;
				chart.addGraph(graphUp);
				
			break;
			default:
				var graph 						= new AmCharts.AmGraph();
				graph.title 					= dataset.name;
				graph.type 						= dataset.type;
				graph.lineColor					= dataset.color;
				graph.valueField				= "v-"+index;
				graph.balloonText				= dataset.name+":<b>[[v-"+index+"]]</b>";
				chart.addGraph(graph);
			break;
		}
		
	});
	
	// CURSOR
	var chartCursor 				= new AmCharts.ChartCursor();
	chart.addChartCursor(chartCursor);
	
	// WRITE
	chart.write(id);
}