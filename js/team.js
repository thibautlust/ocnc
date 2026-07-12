// ======================================================
// Chargement de l'équipe optimale
// ======================================================

async function loadTeam() {

    
    const riders = await loadCSV("riders.csv");

    const team = riders.filter(r => Number(r.selected) === 1);

    if (team.length === 0)
        return;

    //-----------------------------------------------------
    // Calculs
    //-----------------------------------------------------

    let totalPoints = 0;
    let totalCost = 0;

    team.forEach(r => {

        totalPoints += Number(r.points);
        totalCost += Number(r.poids);

    });

    document.getElementById("teamScore").innerHTML = totalPoints;
    document.getElementById("teamBudget").innerHTML = totalCost;
    document.getElementById("teamSize").innerHTML = team.length;
    document.getElementById("averageCost").innerHTML =
        (totalCost / team.length).toFixed(1);

    //-----------------------------------------------------
    // Tableau
    //-----------------------------------------------------

    let columns = [

        {
            title: "Coureur",
            data: "Rider"
        },

        {
            title: "Equipe",
            data: "Team"
        },

        {
            title: "Prix",
            data: "poids"
        },

        {
            title: "Total",
            data: "points"
        }

    ];

    // Colonnes E1 E2 E3 ...

    Object.keys(team[0]).forEach(key => {

        if (key.startsWith("E")) {

            columns.push({

                title: key,

                data: key,

                defaultContent: 0

            });

        }

    });

    new DataTable("#bestTeamTable", {

        data: team,

        columns: columns,

        pageLength: 20,

        paging: false,

        info: false,

        searching: false,

        order: [[3, "desc"]]

    });

    //-----------------------------------------------------
    // Graphique
    //-----------------------------------------------------

    drawTeamChart(team);

}


// ======================================================
// Evolution des points
// ======================================================

function drawTeamChart(team) {

    let labels = [];
    let values = [];

    let stage = 1;

    while (("E" + stage) in team[0]) {

        labels.push("E" + stage);

        let pts = 0;

        team.forEach(r => {

            pts += Number(r["E" + stage]);

        });

        values.push(pts);

        stage++;

    }

    new Chart(document.getElementById("teamChart"), {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Points de l'équipe",

                    data: values,

                    borderWidth: 3,

                    fill: false,

                    tension: 0.25

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}


// ======================================================
// Initialisation
// ======================================================

window.addEventListener("load", loadTeam);
