function getBaseLog(x, y) {
    const res = Math.log(y) / Math.log(x);
    return res !== Infinity ? res : 1;
};

numi.addFunction({ "id": "log", "phrases": "log" }, function(values) {
    if (values.length === 1) {
        return { "double": getBaseLog(values[0].double, 2) };
    } else if(values.length === 2 ) {
        return { "double": getBaseLog(values[0].double, values[1].double) };
    }
    return { "double": values[0].double };
});

numi.addHelp({
  title: "Logarithm",
  description: "Calculate logarithms with a custom base",
  examples: [
    { input: "log(2)", output: "1", desc: "Base-2 logarithm (default)" },
    { input: "log(10, 1000)", output: "3", desc: "Log base 10 of 1000" },
  ],
});