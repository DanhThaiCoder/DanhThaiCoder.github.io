createTable = (a, b) => {
    var tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';
    for (let i = 1; i < a; i++) {
        var row = document.createElement('tr');
        for (let j = 1; j <= b; j++) {
            let cell = document.createElement('td');
            cell.textContent = i * j;
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}
createTable(10, 5);