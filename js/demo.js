
function changeContent(page){
	if(page == "overview"){
		$('#contentApp').load('overview.html');
	}else if(page == "wathis"){
		$('#contentApp').load('wathis.html');
	}else if(page == "team"){			
		$('#contentApp').load('team.html');
	}else if(page == "raster-images"){		
		$('#contentApp').load('raster.html');
	}else{
		$('#contentApp').load('statistical.html');
	}
}

function clearSearchFilter(){
		$("#datasetSearchInput").val("");
		dataset.query({q: ""});
		$("#datasetFilterNumber").text("Total returned: " + dataset.records.length);
		changeViewResult(typeView);
	}
	
function changeViewResult(type){
	typeView = type;
	if(type == "table"){
		//renderStatistical(areaSelect, yearSelect);
		$("#mygrid").show();
		$("#mychart").hide();
		$("#mymap").hide();
		$("#selectArea").show();
	}else if(type == "chart"){
		//renderStatistical(areaSelect, yearSelect);
		$("#mygrid").hide();
		$("#mychart").show();
		$("#mymap").hide();
		$("#selectArea").show();
	}else{
		$("#mygrid").hide();
		$("#mychart").hide();
		$("#mymap").show();
		$("#selectArea").hide();
		var $el = $('#mymap');
		var map = new recline.View.Map({
			model: dataset
		});
		$el.append(map.el);
		map.render();
	}
}

function initDatatableGrid(){
	$('#mygrid').html('<table class="table table-striped" cellpadding="0" cellspacing="0" border="0" class="display" id="tableGrid" style=" padding:10px"></table>' );
	$('#tableGrid').dataTable({
		"aaData": [
				[ "Trident", "Internet Explorer 4.0", "Win 95+", 4, "X" ],
				[ "Trident", "Internet Explorer 5.0", "Win 95+", 5, "C" ],
				[ "Trident", "Internet Explorer 5.5", "Win 95+", 5.5, "A" ],
				[ "Trident", "Internet Explorer 6.0", "Win 98+", 6, "A" ],
				[ "Trident", "Internet Explorer 7.0", "Win XP SP2+", 7, "A" ],
				[ "Gecko", "Firefox 1.5", "Win 98+ / OSX.2+", 1.8, "A" ],
				[ "Gecko", "Firefox 2", "Win 98+ / OSX.2+", 1.8, "A" ],
				[ "Gecko", "Firefox 3", "Win 2k+ / OSX.3+", 1.9, "A" ],
				[ "Webkit", "Safari 1.2", "OSX.3", 125.5, "A" ],
				[ "Webkit", "Safari 1.3", "OSX.3", 312.8, "A" ],
				[ "Webkit", "Safari 2.0", "OSX.4+", 419.3, "A" ],
				[ "Webkit", "Safari 3.0", "OSX.4+", 522.1, "A" ]
			],
			"aoColumns": [
				{ "sTitle": "Engine" },
				{ "sTitle": "Browser" },
				{ "sTitle": "Platform" },
				{ "sTitle": "Version", "sClass": "center" },
				{ "sTitle": "Grade", "sClass": "center" }
			]
	});
}

function renderChartSWE(nameCountry){
		Highcharts.visualize = function(table, options) {
            // the categories
            options.xAxis.categories = [];
            $('tbody th', table).each( function(i) {
                options.xAxis.categories.push(this.innerHTML);
            });
    
            // the data series
            options.series = [];
            $('tr', table).each( function(i) {
                var tr = this;
                $('th, td', tr).each( function(j) {
                    if (j > 0) { // skip first column
                        if (i == 0) { // get the name and init the series
                            options.series[j - 1] = {
                                name: this.innerHTML,
                                data: []
                            };
                        } else { // add values
                            options.series[j - 1].data.push(parseFloat(this.innerHTML));
                        }
                    }
                });
            });
            var chart = new Highcharts.Chart(options, function(chart){
				var $ulTypeChart1 = $("#ulTypeChart1");
				$($ulTypeChart1).html("");
				var $liColumn = $("<li class='active' />").append("<a href='javascript:void(0)'><i class='icon-bar-chart'></i> Column Chart</a>").click(function(){
					changeTypeChart($ulTypeChart1, this, chart, "column");
				});
				var $liColumnStack = $("<li />").append("<a href='javascript:void(0)'><i class='icon-bar-chart'></i> Column Stack Chart</a>").click(function(){
					changeTypeChart($ulTypeChart1, this, chart, "column stack");
				});
				var $liLine = $("<li />").append("<a href='javascript:void(0)'><i class='icon-bar-chart'></i> Line Chart</a>").click(function(){
					changeTypeChart($ulTypeChart1, this, chart, "line");
				});
				var $liArea = $("<li />").append("<a href='javascript:void(0)'><i class='icon-bar-chart'></i> Area Chart</a>").click(function(){
					changeTypeChart($ulTypeChart1, this, chart, "area");
				});				    	
				$ulTypeChart1.append($liColumn);
				$ulTypeChart1.append($liColumnStack);
				$ulTypeChart1.append($liLine);
				$ulTypeChart1.append($liArea);
			});
        }

	
        var table = $("#tableResult"),
        options = {
            chart: {
                renderTo: 'chart',
                type: 'column'
            },
            title: {
                text: '<h1>' + nameCountry + '</h1>'
            },
            xAxis: {
            },
            yAxis: {
                title: {
                    text: '(CM)'
                }
            },
			credits : { enabled : false },
			plotOptions: {
				series: {}
			},
            tooltip: {
                formatter: function() {
                    return this.x.toLowerCase() + '<br /><b>'+ this.series.name +'</b><br/>'+
                        this.y;
                }
            }
        };
    
        Highcharts.visualize(table, options);
	}


function changeTypeChart(ul, aLink, chart, type){
	$(ul).find("li").removeClass("active");	
	$(aLink).addClass("active");

	if(type == "column stack"){
		type = "column";
		chart.options.plotOptions.series.stacking = 'normal';
	}else{
		chart.options.plotOptions.series.stacking = '';
	}
	for(var i=0; i < chart.series.length; i++){
		serie = chart.series[0];
		serie.chart.addSeries({
			type: type,
			name: serie.name,
			color: serie.color,
			data: serie.options.data
		}, false);
		serie.remove();
	}
}