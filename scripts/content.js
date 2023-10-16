let output = {};

async function LoadPage() {
    return new Promise(async resolve => {
        let clickBtn = document.querySelector('#load_more_clickable');
        let loader = document.querySelector('#inventory_history_loading');
        while (clickBtn.offsetParent != null) {
            clickBtn.click();
            await new Promise(resolve => {
                let interval = setInterval(() => {
                    if (clickBtn.offsetParent != null || (clickBtn.offsetParent == null && loader.offsetParent == null)) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            })
        }
        resolve();
    })
}

function GetChildIndex(child) {
    let parent = child.parentNode;
    return Array.prototype.indexOf.call(parent.children, child)
}

function OutputToTable(output) {
    let html = '<table style="width: 100%"><tr><th>Map</th><th>Wins</th><th>Ties</th><th>Losses</th></tr>'
    for (const [key, value] of Object.entries(output)) {
        html += `<tr><td>${key}</td><td>${value.wins}</td><td>${value.ties}</td><td>${value.losses}</td></tr>`
    }
    html += '</table>'
    return html;
}

async function CreateTable(userId) {
    console.log(userId);

    document.querySelectorAll('.csgo_scoreboard_root > tbody > tr').forEach(item => {
        let i = item.querySelector('.csgo_scoreboard_inner_left td');
        if (i) {
            let mapName = i.innerText.trim().match(/\s([\w\s]+)/)[1];
            let score = item.querySelector('.csgo_scoreboard_score')
            let scoreMatch = score.innerText.match(/(\d+) : (\d+)/);
            let win = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]);

            let playerRoot = item.querySelector(`.playerAvatar a[href="https://steamcommunity.com/id/${userId}"]`).parentNode.parentNode.parentNode
            let index = GetChildIndex(playerRoot);
            if (index > 6) {
                win = !win;
            }

            if (output[mapName] == null) {
                output[mapName] = { wins: 0, ties: 0, losses: 0 };
            }
            if (scoreMatch[1] == scoreMatch[2]) {
                output[mapName].ties++;
            } else {
                if (win) {
                    output[mapName].wins++;
                } else {
                    output[mapName].losses++;
                }
            }
        }
    });

    let tableHTML = OutputToTable(output);
    document.querySelector('#subtabs').insertAdjacentHTML('afterend', tableHTML)
}

LoadPage().then(async () => {
    let url = window.location.href;
    let match = url.match(/id\/(.+)\/gcpd/);
    if (match) {
        CreateTable(match[1]);
    }
})