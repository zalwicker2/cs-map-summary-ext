let test = document.createElement('div')
test.innerText = 'Copy Link to Data';
document.querySelector('body').appendChild(test);
test.addEventListener('click', function () {
    navigator.clipboard.writeText('https://steamcommunity.com/my/gcpd/730?tab=matchhistorycompetitivepermap')
    test.innerText = 'Copied!'
});