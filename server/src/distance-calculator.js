// Source: https://gist.github.com/caseyjustus/1166258
var median = (values) => {
    values.sort((a, b) => {
        return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
}

var isDistanceDeviating = (values) => {
    // Using 10 for no real reason, as program is developed a more suitable number will be used.
    // NOTE: The value of the distance sensor alternates between ~371 and ~357cm which has a deviation
    // of about 7, so 10 for now is a good number. In the future, a LIDAR could be used.
    console.log("DEVIATION: ", standardDeviation(values).toFixed(2));
    return standardDeviation(values) > 10 ? true : false;
}

/**
 * Use standard deviation to check if a value deviates from the polled distances
 */
var standardDeviation = (values) => {
    var avg = average(values);

    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

var average = (data) => {
    var sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    return sum / data.length;
}

module.exports = {
    isDistanceDeviating: isDistanceDeviating,
    median: median
}