// =======================================================
// Chargement des données
// =======================================================

async function loadStats() {

    const riders = await loadCSV("points_par_etape.csv");

    if (riders.length === 0)
        return;

    drawTopChart(riders);
    drawRatioChart(riders);
}

window.addEventListener("load", loadStats);

window.addEventListener("load", loadStats);


// =======================================================
// Top 10 des meilleurs scoreurs
// =======================================================

function drawTopChart(riders){

    riders.sort((a,b)=>Number(b.points)-Number(a.points));

    const top = riders.slice(0,50);

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
            
            maintainAspectRatio: false,

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

    const top=riders.slice(0,50);

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
            
            maintainAspectRatio: false,

            indexAxis:'y',

            plugins:{
                legend:{display:false}
            }

        }

    });

}




