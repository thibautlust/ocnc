// ======================================================
// Configuration
// ======================================================

const DATA_PATH = "data/";


// ======================================================
// Lecture d'un CSV avec PapaParse
// ======================================================

async function loadCSV(filename) {

    return new Promise((resolve, reject) => {

        Papa.parse(DATA_PATH + filename, {

            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,

            complete: function(results) {
                resolve(results.data);
            },

            error: function(err) {
                reject(err);
            }

        });

    });

}


// ======================================================
// Nombre d'étapes présentes
// ======================================================

function numberOfStages(data){

    let n = 0;

    Object.keys(data[0]).forEach(col =>{

        if(col.startsWith("E"))
            n++;

    });

    return n;

}


// ======================================================
// Somme des points d'un coureur
// ======================================================

function totalPoints(rider){

    let total = 0;

    Object.keys(rider).forEach(col =>{

        if(col.startsWith("E"))
            total += Number(rider[col]);

    });

    return total;

}


// ======================================================
// Couleur du score
// ======================================================

function scoreClass(score){

    if(score>=100)
        return "score-high";

    if(score>=50)
        return "score-medium";

    return "score-low";

}


// ======================================================
// Affichage des cartes du haut
// ======================================================

async function updateDashboard(){

    try{

        const riders = await loadCSV("riders.csv");

        document.getElementById("nbRiders").innerHTML =
            riders.length;

        document.getElementById("lastStage").innerHTML =
            numberOfStages(riders);

        let best = 0;

        riders.forEach(r=>{

            let t = totalPoints(r);

            if(t>best)
                best=t;

        });

        document.getElementById("bestScore").innerHTML = best;

    }

    catch(e){

        console.log(e);

    }

}


// ======================================================
// Lecture de la meilleure équipe
// ======================================================

async function loadBestTeam(){

    const riders = await loadCSV("riders.csv");

    return riders.filter(r => Number(r.selected) === 1);

}


// ======================================================
// Remplissage du tableau équipe
// ======================================================

async function fillBestTeamTable(){

    const riders = await loadBestTeam();

    let tbody =
        document.querySelector("#teamTable tbody");

    tbody.innerHTML="";

    riders.forEach(r=>{

        let tr=document.createElement("tr");

        tr.innerHTML=`

        <td class="rider">${r.Rider}</td>

        <td>${r.Team}</td>

        <td>${r.poids}</td>

        <td class="${scoreClass(r.points)}">

            ${r.points}

        </td>

        `;

        tbody.appendChild(tr);

    });

    new DataTable('#teamTable');

}


// ======================================================
// Evolution du score
// ======================================================

async function drawScoreChart(){

    const riders =
        await loadBestTeam();

    let labels=[];

    let values=[];

    let nb = numberOfStages(riders);

    for(let e=1;e<=nb;e++){

        labels.push("E"+e);

        let s=0;

        riders.forEach(r=>{

            s += Number(r["E"+e]);

        });

        values.push(s);

    }

    const ctx =
        document.getElementById("scoreChart");

    new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Equipe optimale",

                data:values,

                fill:false,

                tension:0.2

            }]

        },

        options:{

            responsive:true,

            plugins:{
                legend:{
                    display:false
                }
            }

        }

    });

}


// ======================================================
// Top 10 coureurs
// ======================================================

async function drawTopChart(){

    let riders = await loadCSV("riders.csv");

    riders.forEach(r=>{

        r.total=totalPoints(r);

    });

    riders.sort((a,b)=>b.total-a.total);

    riders=riders.slice(0,10);

    const ctx =
        document.getElementById("topChart");

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:riders.map(r=>r.Rider),

            datasets:[{

                data:riders.map(r=>r.total)

            }]

        },

        options:{

            indexAxis:"y",

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}


// ======================================================
// Initialisation
// ======================================================

window.onload = async function(){

    await updateDashboard();

    if(document.getElementById("teamTable"))
        await fillBestTeamTable();

    if(document.getElementById("scoreChart"))
        await drawScoreChart();

    if(document.getElementById("topChart"))
        await drawTopChart();

}
