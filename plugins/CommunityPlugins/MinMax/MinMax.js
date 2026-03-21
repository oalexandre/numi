numi.addFunction({ "id": "nmin", "phrases": "nmin" }, function(values) {
	return { "double": Math.min(...values.map(value => value.double)) };
});

numi.addFunction({ "id": "nmax", "phrases": "nmax" }, function(values) {
	return { "double": Math.max(...values.map(value => value.double)) };
});

numi.addHelp({
  title: "Min / Max",
  description: "Find the minimum or maximum of a set of values",
  examples: [
    { input: "nmin(3, 7, 1, 5)", output: "1" },
    { input: "nmax(3, 7, 1, 5)", output: "7" },
  ],
});
