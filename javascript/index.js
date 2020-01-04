document.addEventListener('DOMContentLoaded', function(){ 
	var isPlayersRanking = false;
	var isNationsRanking = false;
	var is1v1Ranking = false;
	var is2v2Ranking = false;
	
	//Recognize which ranking tab is
	$('.nav.item').each(function () {
		if($(this).hasClass('active')) {
			var thisTab = $(this).text().trim();
			//alert(thisTab);
			if (thisTab == 'Countries Ranking') isNationsRanking = true;
			else if (thisTab == '1v1 Ranking') is1v1Ranking = true;
			else if (thisTab == '2v2 Ranking') is2v2Ranking = true;                
		}
	});
	if (is1v1Ranking || is2v2Ranking) isPlayersRanking = true;
	
	//If is a ranking
	if (isPlayersRanking || isNationsRanking) {
		//Create loading spinner
		var spinnerDiv = document.getElementById('spinner');
		var spinner = document.createElement("button");
		spinner.setAttribute("class", "ui loading button centered-content");
		spinner.setAttribute("style", "text-align: center;");
		spinner.textContent = "Loading";
		var divider = document.createElement("div");
		divider.setAttribute("class", "ui hidden divider");
		spinnerDiv.appendChild(spinner);
		spinnerDiv.appendChild(divider);
		
		//Look which ranking is
		if (is1v1Ranking) {
			//Set ranking title and run function to create rank
			document.getElementById('rank-title').innerHTML = "<h1>1v1 Players Ranking</h1>";
			var data = get1v1Data();
			generateRanking(data);
		}
		else if (is2v2Ranking) {
			document.getElementById('rank-title').innerHTML = "<h1>2v2 Players Ranking</h1>";
			var data = get2v2Data();
			generateRanking(data);
		}
		else if (isNationsRanking) {
			document.getElementById('rank-title').innerHTML = "<h1>Countries Ranking</h1>";
			var data = getNationsData();
			generateRanking(data);
		}
	}
});

//Nav functions
function goHome() {
   window.top.location = "https://royaleranking.github.io/home/";
}    
function go1v1Ranking() {
	window.top.location = "https://royaleranking.github.io/1v1/";
}    
function go2v2Ranking() {
	window.top.location = "https://royaleranking.github.io/2v2/";
}    
function goNationsRanking() {
	window.top.location = "https://royaleranking.github.io/countries/";
}

//Function to generate ranking table
function generateRanking(data) {
	/* VARS AND PARAMS */
	//Hide spinner
   document.getElementById("spinner").style.display = "none";
   
   //Table elements
	var table = document.getElementById("rank-table");
	var tbody = document.getElementById("table-body");
	var theader = document.getElementById("table-header");
	
	//Recognize which ranking tab is
	var isPlayersRanking = false;
	var isNationsRanking = false;
	var is1v1Ranking = false;
	var is2v2Ranking = false;
	$('.nav.item').each(function () {
		if($(this).hasClass('active')) {
			var thisTab = $(this).text().trim();
			if (thisTab == 'Countries Ranking') isNationsRanking = true;
			else if (thisTab == '1v1 Ranking') is1v1Ranking = true;
			else if (thisTab == '2v2 Ranking') is2v2Ranking = true;                
		}
	});
	if (is1v1Ranking || is2v2Ranking) isPlayersRanking = true;
			
	//Data size
	var maxCols = data.table.cols.length;
	var maxRows = data.table.rows.length;

	/* CREATE TABLE */
	//Create table header
	var headersCount = 0;
	var header = document.createElement("tr");
	for (var k = 0; k < maxCols; k++) {        
		var headerName = data.table.cols[k].label;
		
		//Se omiten las columnas de empates y de flags en el ranking de paises
		if (isNationsRanking && headerName != 'Draws' && headerName != 'Flag' || isPlayersRanking && headerName != 'Player picture') {
			headersCount++;
			var field = document.createElement("th"); //Se crea el <th>
			field.textContent = headerName; //Se asigna su contenido
			header.appendChild(field); //Se appendiza el <th> a la fila encabezado
		}
	}        
	
	//Se appendiza toda la fila encabezado a la seccion theader
	theader.setAttribute("class", "center aligned");
	theader.appendChild(header);
	
	//Create table rows
	var tableRowsCount = 0;
	var tableColsCount = 0;
	for (var r = 0; r < maxRows; r++) { //Loop all rows after header
		
		var row = document.createElement("tr"); //Se crea el <tr>
		tableRowsCount++;
		
		//Loop all columns
		for (var k = 0; k < maxCols; k++) {
		
			var headerName = data.table.cols[k].label;
			var value = data.table.rows[r].c[k].v;
			
			//Se omiten las columnas de empates y de flags en el ranking de paises
			if (isNationsRanking && headerName != 'Draws' && headerName != 'Flag' || isPlayersRanking && headerName != 'Player picture') {
				
				tableColsCount++;
				var col = document.createElement("td"); //Se crea el <td>
				
				//If is -only- an image cell
				if (isPlayersRanking && headerName == "Team" || isPlayersRanking && headerName == "Country") {
					
					var img = document.createElement("img");
					img.setAttribute("src", value);

					if (headerName == "Country") {
						img.style.width = "30px";
						img.setAttribute("onError", "this.src = 'https://res.cloudinary.com/marsiglia/clash-royale/flags-full/no-flag.png'");
						img.setAttribute("class", "ui mini rounded centered image");
					}
					else if (headerName == "Team") {
						img.style.width = "30px";
						img.setAttribute("onError", "this.src = 'https://res.cloudinary.com/marsiglia/clash-royale/teams/no-team.png'");
						img.setAttribute("class", "ui mini centered image");
					}
					img.style.height = "auto";
					col.appendChild(img);
				} 
				else { //If is and image and text cell
					if (isNationsRanking && headerName == 'Country') {
						var h = document.createElement("a"); //Se crea el <h5>
						h.setAttribute("class", "ui image header"); //Se aplican los atributos
						h.setAttribute("style", "font-size:12px; font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-weight: normal;");
						var i = document.createElement("img"); //Se crea el <img>
						i.setAttribute("src", data.table.rows[r].c[k-1].v); //Se aplican los atributos
						i.setAttribute("onError", "this.src = 'https://res.cloudinary.com/marsiglia/clash-royale/flags-full/no-flag.png'");
						i.setAttribute("class", "ui mini rounded image");
						i.style.width = "30px"; 
						i.style.height = "auto";
						var c = document.createElement("div"); //Se crea el div que contendrá el texto
						c.setAttribute("class", "content"); //Se aplican los stributos
						c.textContent = value;
						h.appendChild(i); //Se apendiza el <img> y el <div> al <h5>
						h.appendChild(c); 
						col.appendChild(h); //Se apendiza el <h5> al <td>
					}
					else if (isPlayersRanking && headerName == 'Player') {
						var h = document.createElement("a"); //Se crea el <h5>
						h.setAttribute("class", "ui image header"); //Se aplican los atributos
						h.setAttribute("style", "font-size:12px; font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-weight: normal;");
						var i = document.createElement("img"); //Se crea el <img>
						i.setAttribute("src", data.table.rows[r].c[k-1].v); //Se aplican los atributos
						i.setAttribute("onError", "this.src = 'https://res.cloudinary.com/marsiglia/clash-royale/players/unknown(2).png'");
						i.setAttribute("class", "ui mini image");
						i.style.height = "60px"; 
						i.style.width = "auto";
						var c = document.createElement("div"); //Se crea el div que contendrá el texto
						c.setAttribute("class", "content"); //Se aplican los stributos
						c.textContent = value;
						h.appendChild(i); //Se apendiza el <img> y el <div> al <h5>
						h.appendChild(c); 
						col.appendChild(h); //Se apendiza el <h5> al <td>
					}
					else if (headerName == "%Wins") {
						col.textContent = data.table.rows[r].c[k].f;
					}
					else if (headerName == "ELO Score") {
						var w = Number(Number(value).toPrecision(6).toString().replace(',', '.'));
						col.textContent = w;
					}
					else col.textContent = value; //Any other text-only cell
				}
				row.appendChild(col); //Append current col to current row
			}				
		 }
		 tbody.appendChild(row); //Append current row to current table-body
	}
	
	//Enable DataTable plugin
	if (isPlayersRanking) { //Player Ranking
		var table = $('#rank-table').DataTable({
			paging: true,
			searching: true,
			lengthChange: false,
			pageLength: 20,
			ordering: true,
			order: [[9, "desc"]],
			scrollY: '73vh',
			scrollX: true,
			scrollCollapse: true,
			columnDefs: [
				{ type: "num", className: "rank center aligned", targets: 0, orderable: false },
				{ className: "center aligned", targets: 1 },
				{ className: "center aligned", targets: 2 },
				{ type: "string", className: "four wide center aligned", targets: 3 },
				{ type: "num", className: "center aligned", targets: 4 },
				{ type: "num", className: "center aligned", targets: 5 },
				{ type: "num", className: "center aligned", targets: 6 },
				{ type: "num", className: "center aligned", targets: 7 },
				{ className: "center aligned", targets: 8 },
				{ type: "num", className: "center aligned", targets: 9 }
			]
		});
		table.on( 'draw', function () {
			$('.paginate_button, .pagination').removeClass('stackable').addClass('unstackable');
		});
	}
	
	else if (isNationsRanking) { //Countries ranking
		var table = $('#rank-table').DataTable({
			paging: false,
			searching: false,
			ordering: true,
			order: [[6, "desc"]],
			scrollY: '73vh',
			scrollX: true,
			scrollCollapse: true,
			columns: [
			  { type: "num", className: "rank center aligned", orderable: false },
			  { type: "string", className: "three wide center aligned" },
			  { type: "num", className: "center aligned" },
			  { type: "num", className: "center aligned" },
			  { type: "num", className: "center aligned" },
			  { className: "center aligned" },
			  { type: "num", className: "center aligned" }
			]
		});
		
		//Redraw Rank column after each sort
		table.on( 'draw', function () {
			$('td.rank').each(function (index) {
				$(this).text(index + 1);
			})
		});
		
		//Add nations special info
		var nationsSpecialInfoData = getNationsSpecialInfo();
		var data = nationsSpecialInfoData;
		var special_info_div = document.getElementById('special-info');
		for (var i = 0; i < data.length; i++) {
			var infoTxt = data[i].info;
			var infoDiv = document.createElement("div");
			infoDiv.setAttribute("class", "row");
			infoDiv.textContent = infoTxt;
			special_info_div.appendChild(infoDiv);
		}
	}
	
	//Add ranking info
	var rankingInfoData = getRankingsInfo();
	var data = rankingInfoData;
	var p;
	if (is1v1Ranking) p = 0;
	else if (is2v2Ranking) p = 1;
	else if (isNationsRanking) p = 2;
	
	var lastUpdate = data[p].lastUpdate;
	var mediaElo = data[p].mediaElo;
	var battleCount = data[p].battleCount;
	var lastBattleDate = data[p].lastBattleDate;
	var firstBattleDate = data[p].firstBattleDate;
	var maxEloRecord = data[p].maxEloRecord;
	var minEloRecord = data[p].minEloRecord;
	
	document.getElementById('last-update').innerHTML = "Last update: " + lastUpdate.substring(0, 10);
	document.getElementById('battle-count').innerHTML = "Total battles: " + battleCount;
	document.getElementById('last-battle').innerHTML = "Last battle date: " + lastBattleDate.substring(0, 10);
	document.getElementById('first-battle').innerHTML = "First battle date: " + firstBattleDate.substring(0, 10);
	document.getElementById('max-elo').innerHTML = "Max. ELO record: " + maxEloRecord;
	document.getElementById('min-elo').innerHTML = "Min. ELO record: " + minEloRecord;    
}
	
	function getNationsData(){
        var data = {"version":"0.6","reqId":"0","status":"ok","sig":"364208977","table":{"cols":[{"id":"A","label":"Rank","type":"number","pattern":"General"},{"id":"B","label":"Flag","type":"string"},{"id":"C","label":"Country","type":"string"},{"id":"D","label":"Games","type":"number","pattern":"General"},{"id":"E","label":"Wins","type":"number","pattern":"General"},{"id":"F","label":"Draws","type":"number","pattern":"General"},{"id":"G","label":"Losses","type":"number","pattern":"General"},{"id":"H","label":"%Wins","type":"number","pattern":"0.00%"},{"id":"I","label":"ELO Score","type":"number","pattern":"General"}],"rows":[{"c":[{"v":1.0,"f":"1"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Brazil.png"},{"v":"Brazil"},{"v":36.0,"f":"36"},{"v":28.0,"f":"28"},{"v":0.0,"f":"0"},{"v":8.0,"f":"8"},{"v":0.7778,"f":"77,78%"},{"v":1628.743471,"f":"1628,743471"}]},{"c":[{"v":2.0,"f":"2"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Spain.png"},{"v":"Spain"},{"v":35.0,"f":"35"},{"v":27.0,"f":"27"},{"v":0.0,"f":"0"},{"v":8.0,"f":"8"},{"v":0.7714,"f":"77,14%"},{"v":1618.800708,"f":"1618,800708"}]},{"c":[{"v":3.0,"f":"3"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-China.png"},{"v":"China"},{"v":24.0,"f":"24"},{"v":18.0,"f":"18"},{"v":0.0,"f":"0"},{"v":6.0,"f":"6"},{"v":0.75,"f":"75,00%"},{"v":1611.709904,"f":"1611,709904"}]},{"c":[{"v":4.0,"f":"4"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Mexico.png"},{"v":"Mexico"},{"v":55.0,"f":"55"},{"v":38.0,"f":"38"},{"v":0.0,"f":"0"},{"v":17.0,"f":"17"},{"v":0.6909,"f":"69,09%"},{"v":1609.112621,"f":"1609,112621"}]},{"c":[{"v":5.0,"f":"5"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Venezuela.png"},{"v":"Venezuela"},{"v":60.0,"f":"60"},{"v":38.0,"f":"38"},{"v":0.0,"f":"0"},{"v":22.0,"f":"22"},{"v":0.6333,"f":"63,33%"},{"v":1604.69602,"f":"1604,69602"}]},{"c":[{"v":6.0,"f":"6"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Turkey.png"},{"v":"Turkey"},{"v":40.0,"f":"40"},{"v":28.0,"f":"28"},{"v":0.0,"f":"0"},{"v":12.0,"f":"12"},{"v":0.7,"f":"70,00%"},{"v":1598.975556,"f":"1598,975556"}]},{"c":[{"v":7.0,"f":"7"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Argentina.png"},{"v":"Argentina"},{"v":53.0,"f":"53"},{"v":37.0,"f":"37"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.6981,"f":"69,81%"},{"v":1597.14235,"f":"1597,14235"}]},{"c":[{"v":8.0,"f":"8"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-United-States-of-America.png"},{"v":"United States of America"},{"v":43.0,"f":"43"},{"v":30.0,"f":"30"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.6977,"f":"69,77%"},{"v":1596.134471,"f":"1596,134471"}]},{"c":[{"v":9.0,"f":"9"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-United-Kingdom.png"},{"v":"United Kingdom"},{"v":40.0,"f":"40"},{"v":27.0,"f":"27"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.675,"f":"67,50%"},{"v":1591.64668,"f":"1591,64668"}]},{"c":[{"v":10.0,"f":"10"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-France.png"},{"v":"France"},{"v":46.0,"f":"46"},{"v":29.0,"f":"29"},{"v":0.0,"f":"0"},{"v":17.0,"f":"17"},{"v":0.6304,"f":"63,04%"},{"v":1585.425098,"f":"1585,425098"}]},{"c":[{"v":11.0,"f":"11"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Romania.png"},{"v":"Romania"},{"v":33.0,"f":"33"},{"v":24.0,"f":"24"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.7273,"f":"72,73%"},{"v":1569.930188,"f":"1569,930188"}]},{"c":[{"v":12.0,"f":"12"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Russia.png"},{"v":"Russia"},{"v":40.0,"f":"40"},{"v":26.0,"f":"26"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.65,"f":"65,00%"},{"v":1566.472844,"f":"1566,472844"}]},{"c":[{"v":13.0,"f":"13"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Italy.png"},{"v":"Italy"},{"v":42.0,"f":"42"},{"v":26.0,"f":"26"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.619,"f":"61,90%"},{"v":1563.923744,"f":"1563,923744"}]},{"c":[{"v":14.0,"f":"14"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Germany.png"},{"v":"Germany"},{"v":46.0,"f":"46"},{"v":30.0,"f":"30"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.6522,"f":"65,22%"},{"v":1562.156223,"f":"1562,156223"}]},{"c":[{"v":15.0,"f":"15"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Scandinavia.png"},{"v":"Scandinavia"},{"v":15.0,"f":"15"},{"v":12.0,"f":"12"},{"v":0.0,"f":"0"},{"v":3.0,"f":"3"},{"v":0.8,"f":"80,00%"},{"v":1552.162417,"f":"1552,162417"}]},{"c":[{"v":16.0,"f":"16"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Hong-Kong.png"},{"v":"Hong Kong"},{"v":18.0,"f":"18"},{"v":11.0,"f":"11"},{"v":0.0,"f":"0"},{"v":7.0,"f":"7"},{"v":0.6111,"f":"61,11%"},{"v":1550.467745,"f":"1550,467745"}]},{"c":[{"v":17.0,"f":"17"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Bulgaria.png"},{"v":"Bulgaria"},{"v":22.0,"f":"22"},{"v":16.0,"f":"16"},{"v":0.0,"f":"0"},{"v":6.0,"f":"6"},{"v":0.7273,"f":"72,73%"},{"v":1547.785507,"f":"1547,785507"}]},{"c":[{"v":18.0,"f":"18"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-South-Korea.png"},{"v":"South Korea"},{"v":36.0,"f":"36"},{"v":22.0,"f":"22"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.6111,"f":"61,11%"},{"v":1546.527713,"f":"1546,527713"}]},{"c":[{"v":19.0,"f":"19"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Egypt.png"},{"v":"Egypt"},{"v":34.0,"f":"34"},{"v":21.0,"f":"21"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.6176,"f":"61,76%"},{"v":1540.277466,"f":"1540,277466"}]},{"c":[{"v":20.0,"f":"20"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Portugal.png"},{"v":"Portugal"},{"v":32.0,"f":"32"},{"v":19.0,"f":"19"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.5938,"f":"59,38%"},{"v":1536.612832,"f":"1536,612832"}]},{"c":[{"v":21.0,"f":"21"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Norway.png"},{"v":"Norway"},{"v":25.0,"f":"25"},{"v":16.0,"f":"16"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.64,"f":"64,00%"},{"v":1533.791971,"f":"1533,791971"}]},{"c":[{"v":22.0,"f":"22"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Sweden.png"},{"v":"Sweden"},{"v":14.0,"f":"14"},{"v":10.0,"f":"10"},{"v":0.0,"f":"0"},{"v":4.0,"f":"4"},{"v":0.7143,"f":"71,43%"},{"v":1526.835846,"f":"1526,835846"}]},{"c":[{"v":23.0,"f":"23"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Peru.png"},{"v":"Peru"},{"v":46.0,"f":"46"},{"v":23.0,"f":"23"},{"v":0.0,"f":"0"},{"v":23.0,"f":"23"},{"v":0.5,"f":"50,00%"},{"v":1523.798378,"f":"1523,798378"}]},{"c":[{"v":24.0,"f":"24"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Colombia.png"},{"v":"Colombia"},{"v":45.0,"f":"45"},{"v":24.0,"f":"24"},{"v":0.0,"f":"0"},{"v":21.0,"f":"21"},{"v":0.5333,"f":"53,33%"},{"v":1520.372091,"f":"1520,372091"}]},{"c":[{"v":25.0,"f":"25"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Czech-Republic-Slovakia.png"},{"v":"Czech Republic/Slovakia"},{"v":8.0,"f":"8"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":3.0,"f":"3"},{"v":0.625,"f":"62,50%"},{"v":1517.494087,"f":"1517,494087"}]},{"c":[{"v":26.0,"f":"26"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Belarus.png"},{"v":"Belarus"},{"v":15.0,"f":"15"},{"v":9.0,"f":"9"},{"v":0.0,"f":"0"},{"v":6.0,"f":"6"},{"v":0.6,"f":"60,00%"},{"v":1517.051284,"f":"1517,051284"}]},{"c":[{"v":27.0,"f":"27"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Serbia.png"},{"v":"Serbia"},{"v":32.0,"f":"32"},{"v":18.0,"f":"18"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.5625,"f":"56,25%"},{"v":1514.518692,"f":"1514,518692"}]},{"c":[{"v":28.0,"f":"28"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Puerto-Rico.png"},{"v":"Puerto Rico"},{"v":17.0,"f":"17"},{"v":8.0,"f":"8"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.4706,"f":"47,06%"},{"v":1511.280328,"f":"1511,280328"}]},{"c":[{"v":29.0,"f":"29"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Netherlands.png"},{"v":"Netherlands"},{"v":31.0,"f":"31"},{"v":18.0,"f":"18"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.5806,"f":"58,06%"},{"v":1510.883613,"f":"1510,883613"}]},{"c":[{"v":30.0,"f":"30"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Vietnam.png"},{"v":"Vietnam"},{"v":25.0,"f":"25"},{"v":15.0,"f":"15"},{"v":0.0,"f":"0"},{"v":10.0,"f":"10"},{"v":0.6,"f":"60,00%"},{"v":1510.079455,"f":"1510,079455"}]},{"c":[{"v":31.0,"f":"31"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Bosnia.png"},{"v":"Bosnia"},{"v":20.0,"f":"20"},{"v":11.0,"f":"11"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.55,"f":"55,00%"},{"v":1509.182056,"f":"1509,182056"}]},{"c":[{"v":32.0,"f":"32"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Taiwan.png"},{"v":"Taiwan"},{"v":11.0,"f":"11"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":6.0,"f":"6"},{"v":0.4545,"f":"45,45%"},{"v":1508.924578,"f":"1508,924578"}]},{"c":[{"v":33.0,"f":"33"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-TWHKMYSG.png"},{"v":"TWHKMYSG"},{"v":5.0,"f":"5"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.6,"f":"60,00%"},{"v":1508.702629,"f":"1508,702629"}]},{"c":[{"v":34.0,"f":"34"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-El-Salvador.png"},{"v":"El Salvador"},{"v":26.0,"f":"26"},{"v":12.0,"f":"12"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.4615,"f":"46,15%"},{"v":1506.988275,"f":"1506,988275"}]},{"c":[{"v":35.0,"f":"35"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Guatemala.png"},{"v":"Guatemala"},{"v":31.0,"f":"31"},{"v":16.0,"f":"16"},{"v":0.0,"f":"0"},{"v":15.0,"f":"15"},{"v":0.5161,"f":"51,61%"},{"v":1505.881728,"f":"1505,881728"}]},{"c":[{"v":36.0,"f":"36"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Lebanon.png"},{"v":"Lebanon"},{"v":5.0,"f":"5"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.6,"f":"60,00%"},{"v":1504.998933,"f":"1504,998933"}]},{"c":[{"v":37.0,"f":"37"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Saudi-Arabia.png"},{"v":"Saudi Arabia"},{"v":10.0,"f":"10"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.5,"f":"50,00%"},{"v":1501.816988,"f":"1501,816988"}]},{"c":[{"v":38.0,"f":"38"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Kazakhstan.png"},{"v":"Kazakhstan"},{"v":4.0,"f":"4"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.5,"f":"50,00%"},{"v":1501.57641,"f":"1501,57641"}]},{"c":[{"v":39.0,"f":"39"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Japan.png"},{"v":"Japan"},{"v":6.0,"f":"6"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":3.0,"f":"3"},{"v":0.5,"f":"50,00%"},{"v":1499.342943,"f":"1499,342943"}]},{"c":[{"v":40.0,"f":"40"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Bolivia.png"},{"v":"Bolivia"},{"v":52.0,"f":"52"},{"v":25.0,"f":"25"},{"v":0.0,"f":"0"},{"v":27.0,"f":"27"},{"v":0.4808,"f":"48,08%"},{"v":1495.197896,"f":"1495,197896"}]},{"c":[{"v":41.0,"f":"41"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Israel.png"},{"v":"Israel"},{"v":7.0,"f":"7"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":4.0,"f":"4"},{"v":0.4286,"f":"42,86%"},{"v":1493.175498,"f":"1493,175498"}]},{"c":[{"v":42.0,"f":"42"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Uzbekistan.png"},{"v":"Uzbekistan"},{"v":3.0,"f":"3"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.3333,"f":"33,33%"},{"v":1492.368349,"f":"1492,368349"}]},{"c":[{"v":43.0,"f":"43"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Tajikistan.png"},{"v":"Tajikistan"},{"v":3.0,"f":"3"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.3333,"f":"33,33%"},{"v":1492.33507,"f":"1492,33507"}]},{"c":[{"v":44.0,"f":"44"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Zimbabwe.png"},{"v":"Zimbabwe"},{"v":3.0,"f":"3"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.3333,"f":"33,33%"},{"v":1492.32685,"f":"1492,32685"}]},{"c":[{"v":45.0,"f":"45"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Philippines.png"},{"v":"Philippines"},{"v":3.0,"f":"3"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.3333,"f":"33,33%"},{"v":1492.17087,"f":"1492,17087"}]},{"c":[{"v":46.0,"f":"46"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Austria.png"},{"v":"Austria"},{"v":18.0,"f":"18"},{"v":8.0,"f":"8"},{"v":0.0,"f":"0"},{"v":10.0,"f":"10"},{"v":0.4444,"f":"44,44%"},{"v":1489.874007,"f":"1489,874007"}]},{"c":[{"v":47.0,"f":"47"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Australia.png"},{"v":"Australia"},{"v":25.0,"f":"25"},{"v":11.0,"f":"11"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.44,"f":"44,00%"},{"v":1489.187178,"f":"1489,187178"}]},{"c":[{"v":48.0,"f":"48"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Luxemburg.png"},{"v":"Luxemburg"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0,00%"},{"v":1488.855036,"f":"1488,855036"}]},{"c":[{"v":49.0,"f":"49"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Indonesia.png"},{"v":"Indonesia"},{"v":9.0,"f":"9"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.4444,"f":"44,44%"},{"v":1488.418855,"f":"1488,418855"}]},{"c":[{"v":50.0,"f":"50"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Armenia.png"},{"v":"Armenia"},{"v":4.0,"f":"4"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":3.0,"f":"3"},{"v":0.25,"f":"25,00%"},{"v":1488.122168,"f":"1488,122168"}]},{"c":[{"v":51.0,"f":"51"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Ecuador.png"},{"v":"Ecuador"},{"v":34.0,"f":"34"},{"v":16.0,"f":"16"},{"v":0.0,"f":"0"},{"v":18.0,"f":"18"},{"v":0.4706,"f":"47,06%"},{"v":1486.099142,"f":"1486,099142"}]},{"c":[{"v":52.0,"f":"52"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Malaysia-Singapore.png"},{"v":"Malaysia/Singapore"},{"v":6.0,"f":"6"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0"},{"v":4.0,"f":"4"},{"v":0.3333,"f":"33,33%"},{"v":1485.633148,"f":"1485,633148"}]},{"c":[{"v":53.0,"f":"53"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Latvia.png"},{"v":"Latvia"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0,00%"},{"v":1485.335547,"f":"1485,335547"}]},{"c":[{"v":54.0,"f":"54"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Montenegro.png"},{"v":"Montenegro"},{"v":29.0,"f":"29"},{"v":13.0,"f":"13"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.4483,"f":"44,83%"},{"v":1484.085028,"f":"1484,085028"}]},{"c":[{"v":55.0,"f":"55"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Finland.png"},{"v":"Finland"},{"v":33.0,"f":"33"},{"v":16.0,"f":"16"},{"v":0.0,"f":"0"},{"v":17.0,"f":"17"},{"v":0.4848,"f":"48,48%"},{"v":1481.351586,"f":"1481,351586"}]},{"c":[{"v":56.0,"f":"56"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Macedonia.png"},{"v":"Macedonia"},{"v":8.0,"f":"8"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0"},{"v":6.0,"f":"6"},{"v":0.25,"f":"25,00%"},{"v":1481.232326,"f":"1481,232326"}]},{"c":[{"v":57.0,"f":"57"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Guyana.png"},{"v":"Guyana"},{"v":7.0,"f":"7"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.2857,"f":"28,57%"},{"v":1480.273912,"f":"1480,273912"}]},{"c":[{"v":58.0,"f":"58"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Algeria.png"},{"v":"Algeria"},{"v":10.0,"f":"10"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":7.0,"f":"7"},{"v":0.3,"f":"30,00%"},{"v":1479.313672,"f":"1479,313672"}]},{"c":[{"v":59.0,"f":"59"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Albania.png"},{"v":"Albania"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0,00%"},{"v":1479.112177,"f":"1479,112177"}]},{"c":[{"v":60.0,"f":"60"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Chile.png"},{"v":"Chile"},{"v":47.0,"f":"47"},{"v":22.0,"f":"22"},{"v":0.0,"f":"0"},{"v":25.0,"f":"25"},{"v":0.4681,"f":"46,81%"},{"v":1478.942456,"f":"1478,942456"}]},{"c":[{"v":61.0,"f":"61"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Uruguay.png"},{"v":"Uruguay"},{"v":38.0,"f":"38"},{"v":17.0,"f":"17"},{"v":0.0,"f":"0"},{"v":21.0,"f":"21"},{"v":0.4474,"f":"44,74%"},{"v":1478.323805,"f":"1478,323805"}]},{"c":[{"v":62.0,"f":"62"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-South-Africa.png"},{"v":"South Africa"},{"v":30.0,"f":"30"},{"v":13.0,"f":"13"},{"v":0.0,"f":"0"},{"v":17.0,"f":"17"},{"v":0.4333,"f":"43,33%"},{"v":1476.988946,"f":"1476,988946"}]},{"c":[{"v":63.0,"f":"63"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Taiwan-Hong-Kong.png"},{"v":"Taiwan/Hong Kong"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0,00%"},{"v":1476.547522,"f":"1476,547522"}]},{"c":[{"v":64.0,"f":"64"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Azerbaijan.png"},{"v":"Azerbaijan"},{"v":13.0,"f":"13"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.3077,"f":"30,77%"},{"v":1474.894805,"f":"1474,894805"}]},{"c":[{"v":65.0,"f":"65"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Swaziland.png"},{"v":"Swaziland"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0,00%"},{"v":1474.588386,"f":"1474,588386"}]},{"c":[{"v":66.0,"f":"66"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Hungary.png"},{"v":"Hungary"},{"v":12.0,"f":"12"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":8.0,"f":"8"},{"v":0.3333,"f":"33,33%"},{"v":1473.747949,"f":"1473,747949"}]},{"c":[{"v":67.0,"f":"67"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Côte-d-Ivoire.png"},{"v":"Côte d\u0027Ivoire"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0,00%"},{"v":1472.5236,"f":"1472,5236"}]},{"c":[{"v":68.0,"f":"68"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Poland.png"},{"v":"Poland"},{"v":14.0,"f":"14"},{"v":6.0,"f":"6"},{"v":0.0,"f":"0"},{"v":8.0,"f":"8"},{"v":0.4286,"f":"42,86%"},{"v":1472.495313,"f":"1472,495313"}]},{"c":[{"v":69.0,"f":"69"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Costa-Rica.png"},{"v":"Costa Rica"},{"v":34.0,"f":"34"},{"v":16.0,"f":"16"},{"v":0.0,"f":"0"},{"v":18.0,"f":"18"},{"v":0.4706,"f":"47,06%"},{"v":1472.117232,"f":"1472,117232"}]},{"c":[{"v":70.0,"f":"70"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Croatia.png"},{"v":"Croatia"},{"v":25.0,"f":"25"},{"v":12.0,"f":"12"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.48,"f":"48,00%"},{"v":1471.093722,"f":"1471,093722"}]},{"c":[{"v":71.0,"f":"71"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Bangladesh.png"},{"v":"Bangladesh"},{"v":14.0,"f":"14"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":10.0,"f":"10"},{"v":0.2857,"f":"28,57%"},{"v":1470.491572,"f":"1470,491572"}]},{"c":[{"v":72.0,"f":"72"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Ukraine.png"},{"v":"Ukraine"},{"v":8.0,"f":"8"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":7.0,"f":"7"},{"v":0.125,"f":"12,50%"},{"v":1470.263851,"f":"1470,263851"}]},{"c":[{"v":73.0,"f":"73"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Canada.png"},{"v":"Canada"},{"v":24.0,"f":"24"},{"v":10.0,"f":"10"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.4167,"f":"41,67%"},{"v":1469.933286,"f":"1469,933286"}]},{"c":[{"v":74.0,"f":"74"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Tunisia.png"},{"v":"Tunisia"},{"v":13.0,"f":"13"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.3077,"f":"30,77%"},{"v":1468.174487,"f":"1468,174487"}]},{"c":[{"v":75.0,"f":"75"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Pakistan.png"},{"v":"Pakistan"},{"v":26.0,"f":"26"},{"v":10.0,"f":"10"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.3846,"f":"38,46%"},{"v":1466.044834,"f":"1466,044834"}]},{"c":[{"v":76.0,"f":"76"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Syria.png"},{"v":"Syria"},{"v":13.0,"f":"13"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":10.0,"f":"10"},{"v":0.2308,"f":"23,08%"},{"v":1462.634125,"f":"1462,634125"}]},{"c":[{"v":77.0,"f":"77"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Malaysia.png"},{"v":"Malaysia"},{"v":22.0,"f":"22"},{"v":8.0,"f":"8"},{"v":0.0,"f":"0"},{"v":14.0,"f":"14"},{"v":0.3636,"f":"36,36%"},{"v":1461.601185,"f":"1461,601185"}]},{"c":[{"v":78.0,"f":"78"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Nicaragua.png"},{"v":"Nicaragua"},{"v":32.0,"f":"32"},{"v":10.0,"f":"10"},{"v":0.0,"f":"0"},{"v":22.0,"f":"22"},{"v":0.3125,"f":"31,25%"},{"v":1460.450115,"f":"1460,450115"}]},{"c":[{"v":79.0,"f":"79"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Morocco.png"},{"v":"Morocco"},{"v":18.0,"f":"18"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":13.0,"f":"13"},{"v":0.2778,"f":"27,78%"},{"v":1459.954,"f":"1459,954"}]},{"c":[{"v":80.0,"f":"80"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Switzerland.png"},{"v":"Switzerland"},{"v":25.0,"f":"25"},{"v":7.0,"f":"7"},{"v":0.0,"f":"0"},{"v":18.0,"f":"18"},{"v":0.28,"f":"28,00%"},{"v":1456.547326,"f":"1456,547326"}]},{"c":[{"v":81.0,"f":"81"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Singapore.png"},{"v":"Singapore"},{"v":11.0,"f":"11"},{"v":2.0,"f":"2"},{"v":0.0,"f":"0"},{"v":9.0,"f":"9"},{"v":0.1818,"f":"18,18%"},{"v":1455.22005,"f":"1455,22005"}]},{"c":[{"v":82.0,"f":"82"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Slovakia.png"},{"v":"Slovakia"},{"v":6.0,"f":"6"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.1667,"f":"16,67%"},{"v":1453.631694,"f":"1453,631694"}]},{"c":[{"v":83.0,"f":"83"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Macau.png"},{"v":"Macau"},{"v":11.0,"f":"11"},{"v":3.0,"f":"3"},{"v":0.0,"f":"0"},{"v":8.0,"f":"8"},{"v":0.2727,"f":"27,27%"},{"v":1450.815821,"f":"1450,815821"}]},{"c":[{"v":84.0,"f":"84"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Czech-Republic.png"},{"v":"Czech Republic"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":5.0,"f":"5"},{"v":0.0,"f":"0,00%"},{"v":1448.929643,"f":"1448,929643"}]},{"c":[{"v":85.0,"f":"85"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Cyprus.png"},{"v":"Cyprus"},{"v":21.0,"f":"21"},{"v":6.0,"f":"6"},{"v":0.0,"f":"0"},{"v":15.0,"f":"15"},{"v":0.2857,"f":"28,57%"},{"v":1443.619679,"f":"1443,619679"}]},{"c":[{"v":86.0,"f":"86"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Honduras.png"},{"v":"Honduras"},{"v":22.0,"f":"22"},{"v":6.0,"f":"6"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.2727,"f":"27,27%"},{"v":1441.661753,"f":"1441,661753"}]},{"c":[{"v":87.0,"f":"87"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-New-Zealand.png"},{"v":"New Zealand"},{"v":9.0,"f":"9"},{"v":1.0,"f":"1"},{"v":0.0,"f":"0"},{"v":8.0,"f":"8"},{"v":0.1111,"f":"11,11%"},{"v":1431.198699,"f":"1431,198699"}]},{"c":[{"v":88.0,"f":"88"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Dominican-Republic.png"},{"v":"Dominican Republic"},{"v":33.0,"f":"33"},{"v":9.0,"f":"9"},{"v":0.0,"f":"0"},{"v":24.0,"f":"24"},{"v":0.2727,"f":"27,27%"},{"v":1428.629291,"f":"1428,629291"}]},{"c":[{"v":89.0,"f":"89"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Panama.png"},{"v":"Panama"},{"v":20.0,"f":"20"},{"v":4.0,"f":"4"},{"v":0.0,"f":"0"},{"v":16.0,"f":"16"},{"v":0.2,"f":"20,00%"},{"v":1428.282766,"f":"1428,282766"}]},{"c":[{"v":90.0,"f":"90"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-India.png"},{"v":"India"},{"v":32.0,"f":"32"},{"v":10.0,"f":"10"},{"v":0.0,"f":"0"},{"v":22.0,"f":"22"},{"v":0.3125,"f":"31,25%"},{"v":1428.012518,"f":"1428,012518"}]},{"c":[{"v":91.0,"f":"91"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Greece.png"},{"v":"Greece"},{"v":26.0,"f":"26"},{"v":6.0,"f":"6"},{"v":0.0,"f":"0"},{"v":20.0,"f":"20"},{"v":0.2308,"f":"23,08%"},{"v":1427.942264,"f":"1427,942264"}]},{"c":[{"v":92.0,"f":"92"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Ireland.png"},{"v":"Ireland"},{"v":12.0,"f":"12"},{"v":0.0,"f":"0"},{"v":0.0,"f":"0"},{"v":12.0,"f":"12"},{"v":0.0,"f":"0,00%"},{"v":1418.292405,"f":"1418,292405"}]},{"c":[{"v":93.0,"f":"93"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Belgium.png"},{"v":"Belgium"},{"v":32.0,"f":"32"},{"v":8.0,"f":"8"},{"v":0.0,"f":"0"},{"v":24.0,"f":"24"},{"v":0.25,"f":"25,00%"},{"v":1412.24154,"f":"1412,24154"}]},{"c":[{"v":94.0,"f":"94"},{"v":"https://res.cloudinary.com/marsiglia/clash-royale/flags-full/flag-of-Paraguay.png"},{"v":"Paraguay"},{"v":34.0,"f":"34"},{"v":7.0,"f":"7"},{"v":0.0,"f":"0"},{"v":27.0,"f":"27"},{"v":0.2059,"f":"20,59%"},{"v":1406.4712,"f":"1406,4712"}]}],"parsedNumHeaders":1}};
        return data;
    }
	
	function getRankingsInfo(){
        var data = [ { "lastUpdate": "2019-12-31T19:36:01.000Z", "mediaElo": 1500, "battleCount": 18818, "lastBattleDate": "2019-12-28T00:59:18.000Z", "firstBattleDate": "2018-11-25T16:12:50.000Z", "maxEloRecord": "1790.18 by TNT", "minEloRecord": "1262.86 by XQ_\u5C0F\u7AE0\u9C7C" }, { "lastUpdate": "2019-12-31T19:36:13.000Z", "mediaElo": 1500, "battleCount": 1579, "lastBattleDate": "2019-12-08T01:19:59.000Z", "firstBattleDate": "2019-03-22T10:42:24.000Z", "maxEloRecord": "1615.66 by FNC Fei", "minEloRecord": "1382.34 by JDG_\u8A00\u8449" }, { "lastUpdate": "2020-01-03T19:00:00.000Z", "mediaElo": 1500, "battleCount": 1042, "lastBattleDate": "2019-12-08T20:06:40.000Z", "firstBattleDate": "2017-05-12T19:00:00.000Z", "maxEloRecord": "Unavailable for now", "minEloRecord": "Unavailable for now" } ];
		return data;
    }
	
	function getNationsSpecialInfo() {
    var data = [ { "n": 1, "info": "*Scandinavia (European region formed by Denmark, Sweden and Norway) participated on WRL Season 1 and MGL Season 2" }, { "n": 2, "info": "*Czech Republic/Slovakia participated on MGL Season 2" }, { "n": 3, "info": "*Malaysia/Singapore participated on MGL Season 2" }, { "n": 4, "info": "*Taiwan/Hong Kong participated on MGL Season 2" }, { "n": 5, "info": "*TWHKMYSG (Team formed by Taiwan, Hong Kong, Malaysia and Singapore) participated on MGL Season 1 (CR Worlds)" } ];
    return data;
}