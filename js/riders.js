async function loadRiders() {

    let riders = await loadCSV("riders.csv");

    if (riders.length === 0) return;

    //-------------------------------------------------------
    // Construction automatique des colonnes
    //-------------------------------------------------------

    const columns = [
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

    // Colonnes E1, E2, E3, ...
    Object.keys(riders[0]).forEach(key => {

        if (key.startsWith("E")) {

            columns.push({
                title: key,
                data: key,
                defaultContent: 0
            });

        }

    });

    //-------------------------------------------------------
    // Création du DataTable
    //-------------------------------------------------------

    new DataTable("#ridersTable", {

        data: riders,

        columns: columns,

        pageLength: 25,

        order: [[3, "desc"]],

        responsive: true,

        language: {

            search: "Recherche :",


            lengthMenu: "Afficher _MENU_ coureurs",

            info: "_START_ à _END_ sur _TOTAL_",

            paginate: {

                first: "Premier",

                last: "Dernier",

                next: "Suivant",

                previous: "Précédent"

            }

        }

    });

}

window.addEventListener("load", loadRiders);	
