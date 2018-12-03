window.onload = function() {
    window.g = new graph(document.getElementById('graph'), 100, 10, 'Graph Title Here');
    document.getElementById('ttl').value = g.title;
    document.getElementById('rng').value = g.unitsx;
    document.getElementById('tck').value = g.ticks_at;
};

function add() {
    let min, q1, q2, q3, max, ttl;
    min = parseInt(document.getElementById('min').value);
    q1 = parseInt(document.getElementById('q1').value);
    q2 = parseInt(document.getElementById('q2').value);
    q3 = parseInt(document.getElementById('q3').value);
    max = parseInt(document.getElementById('max').value);
    ttl = document.getElementById('ttl_p').value;
    
    if(isNaN(min) || isNaN(q1) || isNaN(q2) || isNaN(q3) || isNaN(max))
        return;
    
    g.add_boxplot(min, q1, q2, q3, max, ttl);
}

function clear() {
    g.clear();
}

function update_graph() {
    let ttl, tck, rng;
    ttl = document.getElementById('ttl').value;
    rng = parseInt(document.getElementById('rng').value);
    tck = parseInt(document.getElementById('tck').value);
    
    if(isNaN(rng) || isNaN(tck) || ttl === '')
        return;
    
    g.title = ttl;
    g.unitsx = rng;
    g.ticks_at = tck;
    
    g.draw();
}