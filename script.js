// Initialize time values (t) for the full range
let t = Array.from({length: 10000}, (v, i) => i * 0.001);

// Function to calculate position, velocity, and acceleration
function computeCurves(A, k, m) {
    const omega = Math.sqrt(k / m);
    const position = t.map(t => A * Math.cos(omega * t));
    const velocity = t.map(t => -A * omega * Math.sin(omega * t));
    const acceleration = t.map(t => -A * omega**2 * Math.cos(omega * t));
    return {position, velocity, acceleration, omega};
}

// Initial values
let A = 2, k = 5, m = 1.5;
let curves = computeCurves(A, k, m);

// Fixed axis ranges for both graphs
const fixedXRange = [0, 10]; // Fixed x-axis range from 0 to 10 seconds
const fixedYRange = [-10, 10]; // Fixed y-axis range from -10 to 10

// Layout configuration for both graphs
const layoutFixed = {
    xaxis: { visible: false,
            showgrid: false,
            zeroline: false,
            range: fixedXRange },
    yaxis: { visible: false,
        showgrid: false,
        zeroline: false,
        range: fixedYRange },
    showlegend: false
};


function v_a_POI(start, end) {
    let POIs = [];
    for (let i = 1; i < t.length; i++) {
        if (t[i] < start) continue;
        if (t[i] > end) break;
        if ((curves.velocity[i - 1] - curves.acceleration[i - 1]) * (curves.velocity[i] - curves.acceleration[i]) <= 0) {
            POIs.push(t[i]);
        }
    }
    return POIs;
}

function p_a_POI(start, end) {
    let POIs = [];
    for (let i = 1; i < t.length; i++) {
        if (t[i] < start) continue;
        if (t[i] > end) break;
        if ((curves.position[i - 1] - curves.acceleration[i - 1]) * (curves.position[i] - curves.acceleration[i]) <= 0) {
            POIs.push(t[i]);
        }
    }
    return POIs;
}

function p_v_POI(start, end) {
    let POIs = [];
    for (let i = 1; i < t.length; i++) {
        if (t[i] < start) continue;
        if (t[i] > end) break;
        if ((curves.position[i - 1] - curves.velocity[i - 1]) * (curves.position[i] - curves.velocity[i]) <= 0) {
            POIs.push(t[i]);
        }
    }
    return POIs;
}


function addPositionSegment(letter, start, end){
    const segmentX = [];
    const segmentY = [];
    for (let i = 0; i < t.length; i++) {
        //if (t[i] > firstPeriodEnd) break;
        if (t[i] >= start && t[i] <= end) {
            segmentX.push(t[i]);
            segmentY.push(curves.position[i]);
        }
    }
    letter.push({x: segmentX, y: segmentY, mode: 'lines',
        name: 'Position (x)',
        line: {color: 'blue'} });
}

function addVelocitySegment(letter, start, end){
    const segmentX = [];
    const segmentY = [];
    for (let i = 0; i < t.length; i++) {
        if (t[i] >= start && t[i] <= end) {
            segmentX.push(t[i]);
            segmentY.push(curves.velocity[i]);
        }
    }
    letter.push({x: segmentX, y: segmentY, mode: 'lines',
        name: 'Velocity (x)',
        line: {color: 'red'} });
}

function addAccelerationSegment(letter, start, end){
    const segmentX = [];
    const segmentY = [];
    for (let i = 0; i < t.length; i++) {
        if (t[i] >= start && t[i] <= end) {
            segmentX.push(t[i]);
            segmentY.push(curves.acceleration[i]);
        }
    }
    letter.push({x: segmentX, y: segmentY, mode: 'lines',
        name: 'Acceleration (x)',
        line: {color: 'green'} });
}


// Function to plot the graphs
function plotGraphs() {
    const omega = curves.omega;
    const firstPeriodEnd = 2 * Math.PI / omega;

    // // Find intersections between position and acceleration
    // const intersectTimes = findIntersections(curves.position, curves.acceleration, 0, firstPeriodEnd);

    // // Extract the segments of position that intersect with acceleration for the first graph
    // const intersectSegmentX = [];
    // const intersectSegmentY = [];
    // for (let i = 0; i < t.length; i++) {
    //     if (t[i] >= intersectTimes[0] && t[i] <= intersectTimes[intersectTimes.length - 1]) {
    //         intersectSegmentX.push(t[i]);
    //         intersectSegmentY.push(curves.position[i]);
    //     }
    // }

    const masterData = [
        {
          x: t,
          y: curves.position,
          mode: 'lines',
          name: 'Position',
          line: {color: 'blue'}
        },
        {
          x: t,
          y: curves.velocity,
          mode: 'lines',
          name: 'Velocity',
          line: {color: 'red'}
        },
        {
          x: t,
          y: curves.acceleration,
          mode: 'lines',
          name: 'Acceleration',
          line: {color: 'green'}
        }
      ];
    Plotly.newPlot('master', masterData, layoutFixed);

    letter_A = [];
    addAccelerationSegment(letter_A, 0, 2 * Math.PI / omega);
    addPositionSegment(letter_A, Math.PI/(2*omega), 3*Math.PI/(2*omega));
    Plotly.newPlot('graph_A', letter_A, layoutFixed);

    letter_B = [];
    addAccelerationSegment(letter_B, Math.PI/omega, 5*Math.PI/(2*omega));
    addPositionSegment(letter_B, 3*Math.PI/(2*omega), 5*Math.PI/(2*omega));
    Plotly.newPlot('graph_B', letter_B, layoutFixed);


    letter_C = [];
    addAccelerationSegment(letter_C, 3*Math.PI/(2*omega), 2*Math.PI/omega);
    addPositionSegment(letter_C, 3*Math.PI/(2*omega), 2*Math.PI/omega);
    Plotly.newPlot('graph_C', letter_C, layoutFixed);


    letter_D = [];
    addAccelerationSegment(letter_D, 3*Math.PI/(2*omega), 3*Math.PI/omega);
    addPositionSegment(letter_D, 3*Math.PI/(2*omega), 5*Math.PI/(2*omega));
    Plotly.newPlot('graph_D', letter_D, layoutFixed);

    letter_E = [];
    POI0_E = v_a_POI(Math.PI/omega, 2*Math.PI/omega)[0];
    POI1_E = p_v_POI(Math.PI/omega, 5*Math.PI/(2*omega))[0];
    addAccelerationSegment(letter_E, POI0_E, 5*Math.PI/(2*omega));
    addVelocitySegment(letter_E, POI0_E, POI1_E)
    addPositionSegment(letter_E, 3*Math.PI/(2*omega), POI1_E);
    Plotly.newPlot('graph_E', letter_E, layoutFixed);


    letter_F = [];
    addAccelerationSegment(letter_F, 0, Math.PI/omega);
    addPositionSegment(letter_F, Math.PI/(4*omega), 3*Math.PI/(4*omega));
    Plotly.newPlot('graph_F', letter_F, layoutFixed);

    letter_G = [];
    POI0_G = p_v_POI(3*Math.PI/(2*omega), 5*Math.PI/(2*omega))[0];
    POI1_G = v_a_POI(3*Math.PI/(2*omega), 5*Math.PI/(2*omega))[0];
    addAccelerationSegment(letter_G, 3*Math.PI/(2*omega), 5*Math.PI/(2*omega));
    addVelocitySegment(letter_G, POI0_G, POI1_G)
    addPositionSegment(letter_G, POI0_G, 5*Math.PI/(2*omega));
    Plotly.newPlot('graph_G', letter_G, layoutFixed);


    letter_H = [];
    addAccelerationSegment(letter_H, Math.PI/omega, 2*Math.PI/omega);
    addPositionSegment(letter_H, 3*Math.PI/(2*omega), 3*Math.PI/omega);
    Plotly.newPlot('graph_H', letter_H, layoutFixed);


    letter_I = [];
    addAccelerationSegment(letter_I, 0, Math.PI/omega);
    Plotly.newPlot('graph_I', letter_I, layoutFixed);


    letter_J = [];
    addAccelerationSegment(letter_J, 3*Math.PI/(2*omega), 3*Math.PI/omega);
    Plotly.newPlot('graph_J', letter_J, layoutFixed);

    letter_K = [];
    POI0_K = v_a_POI(Math.PI/omega, 2*Math.PI/omega)[0];
    POI1_K = p_v_POI(Math.PI/omega, 2*Math.PI/omega)[0];
    addAccelerationSegment(letter_K, Math.PI/omega, 2*Math.PI/omega);
    addVelocitySegment(letter_K, POI0_K, POI1_K)
    addPositionSegment(letter_K, 3*Math.PI/(2*omega), 3*Math.PI/omega);
    Plotly.newPlot('graph_K', letter_K, layoutFixed);


    letter_L = [];
    addAccelerationSegment(letter_L, Math.PI/omega, 5*Math.PI/(2*omega));
    Plotly.newPlot('graph_L', letter_L, layoutFixed);


    letter_M = [];
    addAccelerationSegment(letter_M, 0, 4*Math.PI/(omega));
    Plotly.newPlot('graph_M', letter_M, layoutFixed);


    letter_N = [];
    addAccelerationSegment(letter_N, Math.PI/omega, 4*Math.PI/omega);
    Plotly.newPlot('graph_N', letter_N, layoutFixed);


    letter_O = [];
    addAccelerationSegment(letter_O, Math.PI/(2*omega), 3*Math.PI/(2*omega));
    addPositionSegment(letter_O, Math.PI/(2*omega), 3*Math.PI/(2*omega));
    Plotly.newPlot('graph_O', letter_O, layoutFixed);

    letter_P = [];
    POI0_P = v_a_POI(Math.PI/omega, 2*Math.PI/omega)[0];
    POI1_P = p_v_POI(3*Math.PI/(2*omega), 5*Math.PI/(2*omega))[0];
    addAccelerationSegment(letter_P, POI0_P, 2*Math.PI/omega);
    addVelocitySegment(letter_P, POI0_P, POI1_P)
    addPositionSegment(letter_P, 3*Math.PI/(2*omega), POI1_P);
    Plotly.newPlot('graph_P', letter_P, layoutFixed);

    letter_Q = [];
    POI0_Q = p_v_POI(Math.PI/(2*omega), 3*Math.PI/(2*omega))[0];
    POI1_Q = v_a_POI(Math.PI/(2*omega), 3*Math.PI/(2*omega))[0];
    addAccelerationSegment(letter_Q, POI1_Q, 5*Math.PI/(2*omega));
    addVelocitySegment(letter_Q, POI0_Q, POI1_Q)
    addPositionSegment(letter_Q, POI0_Q, 3*Math.PI/(2*omega));
    Plotly.newPlot('graph_Q', letter_Q, layoutFixed);


    letter_R = [];
    POI0_R = v_a_POI(Math.PI/omega, 2*Math.PI/omega)[0];
    POI1_R = p_v_POI(Math.PI/omega, 2*Math.PI/omega)[0];
    addAccelerationSegment(letter_R, POI0_R, 2*Math.PI/omega);
    addVelocitySegment(letter_R, POI0_R, POI1_R)
    addPositionSegment(letter_R, 3*Math.PI/(2*omega), 3*Math.PI/omega);
    Plotly.newPlot('graph_R', letter_R, layoutFixed);

    letter_S = [];
    addAccelerationSegment(letter_S, 7*Math.PI/(4*omega), 13*Math.PI/(4*omega));
    Plotly.newPlot('graph_S', letter_S, layoutFixed);


    letter_T = [];
    addAccelerationSegment(letter_T, Math.PI/omega, 2*Math.PI/omega);
    addPositionSegment(letter_T, 5*Math.PI/(4*omega), 7*Math.PI/(4*omega));
    Plotly.newPlot('graph_T', letter_T, layoutFixed);


    letter_U = [];
    addAccelerationSegment(letter_U, 3*Math.PI/(2*omega), 5*Math.PI/(2*omega));
    Plotly.newPlot('graph_U', letter_U, layoutFixed);


    letter_V = [];
    addAccelerationSegment(letter_V, Math.PI/omega, 3*Math.PI/omega);
    Plotly.newPlot('graph_V', letter_V, layoutFixed);


    letter_W = [];
    addAccelerationSegment(letter_W, Math.PI/omega, 5*Math.PI/omega);
    Plotly.newPlot('graph_W', letter_W, layoutFixed);


    letter_X = [];
    addAccelerationSegment(letter_X, 0, Math.PI/omega);
    addPositionSegment(letter_X, 0, Math.PI/omega);
    Plotly.newPlot('graph_X', letter_X, layoutFixed);

    letter_Y = [];
    POI0_Y = v_a_POI(3*Math.PI/(2*omega), 3*Math.PI/omega)[0];
    addAccelerationSegment(letter_Y, 7*Math.PI/(4*omega), 3*Math.PI/omega);
    addVelocitySegment(letter_Y, 3*Math.PI/(2*omega), POI0_Y)
    Plotly.newPlot('graph_Y', letter_Y, layoutFixed);


    letter_Z = [];
    addAccelerationSegment(letter_Z, 3*Math.PI/(4*omega), 9*Math.PI/(4*omega));
    Plotly.newPlot('graph_Z', letter_Z, layoutFixed);
}

// Function to update the graphs when sliders are changed
function updateGraphs() {
    A = parseFloat(document.getElementById('A').value);
    k = parseFloat(document.getElementById('k').value);
    m = parseFloat(document.getElementById('m').value);

    // Update the slider display values
    document.getElementById('A-val').textContent = A;
    document.getElementById('k-val').textContent = k;
    document.getElementById('m-val').textContent = m;

    // Recompute the curves
    curves = computeCurves(A, k, m);

    // Update both graphs
    plotGraphs();
}

// Initial plot
plotGraphs();
