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
	$.getJSON("./data/data_nations.json", function(json) {
		var data = json; 
		return data;
	});
}

function getRankingsInfo(){
	$.getJSON("./data/elo_rankings_info.json", function(json) {
		var data = json; 
		return data;
	});
}
	
function getNationsSpecialInfo() {
    $.getJSON("./data/data_nations.json", function(json) {
		var data = json; 
		return data;
	});
}