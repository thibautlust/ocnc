// =======================================================
// Chargement des données
// =======================================================

async function loadStats() {

   
    
    const riders = await loadCSV("riders.csv");

    const team = riders.filter(r => Number(r.selected) === 1);

    if (riders.length === 0)
        return;

    drawTopChart(riders);
    drawRatioChart(riders);
    drawTeamPie(team);
    drawHistory(team);

}

window.addEventListener("load", loadStats);


// =======================================================
// Top 10 des meilleurs scoreurs
// =======================================================

function drawTopChart(riders){

    riders.sort((a,b)=>Number(b.points)-Number(a.points));

    const top = riders.slice(0,10);

    new Chart(document.getElementById("topPointsChart"),{

        type:"bar",

        data:{

            labels:top.map(r=>r.Rider),

            datasets:[{

                label:"Points",

                data:top.map(r=>Number(r.points))

            }]

        },

        options:{

            responsive:true,

            indexAxis:'y',

            plugins:{
                legend:{display:false}
            }

        }

    });

}


// =======================================================
// Rendement points / prix
// =======================================================

function drawRatioChart(riders){

    riders.forEach(r=>{

        r.ratio = Number(r.points)/Number(r.poids);

    });

    riders.sort((a,b)=>b.ratio-a.ratio);

    const top=riders.slice(0,10);

    new Chart(document.getElementById("ratioChart"),{

        type:"bar",

        data:{

            labels:top.map(r=>r.Rider),

            datasets:[{

                label:"Points / Prix",

                data:top.map(r=>r.ratio.toFixed(2))

            }]

        },

        options:{

            responsive:true,

            indexAxis:'y',

            plugins:{
                legend:{display:false}
            }

        }

    });

}



// =======================================================
// Répartition des points de l'équipe optimale
// =======================================================

function drawTeamPie(team){

    team.sort((a,b)=>Number(b.points)-Number(a.points));

    new Chart(document.getElementById("teamPieChart"),{

        type:"pie",

        data:{

            labels:team.map(r=>r.Rider),

            datasets:[{

                data:team.map(r=>Number(r.points))

            }]

        },

        options:{

            responsive:true

        }

    });

}



