function loadScores() {
    $.ajax({
        url: 'get_scores.php',
        type: 'get',
        success: function(response) {
            const scores = JSON.parse(response);

            let table = '<table><h2>Leader Board';
            table += '<tr><th>Name</th><th>Score</th></tr>';

            for (let i = 0; i < scores.length; i++) {
                table += '<tr><td>' + scores[i].name + '</td><td>' + scores[i].score + '</td></tr>';
            }

            table += '</table>';

            document.getElementById('leaderBoard').innerHTML = table;
            
        }
    });
}

// Load scores initially
loadScores();

// Update the scores every 5 seconds
setInterval(loadScores, 5000);