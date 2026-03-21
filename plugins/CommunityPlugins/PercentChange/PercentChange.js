numi.addFunction({ "id": "pc", "phrases": "pc" }, (values) => {
    if (values.length !== 2) {
        return;
    }

    const [initial, final] = values.map(v => v.double);

    if(initial === 0) {
        return;
    }

    return { double: (final-initial)/initial*100, unitId: "percent" };
});

numi.addHelp({
  title: "Percent Change",
  description: "Calculate the percentage change between two values",
  examples: [
    { input: "pc(50, 75)", output: "50%", desc: "50 to 75 is a 50% increase" },
    { input: "pc(200, 150)", output: "-25%", desc: "200 to 150 is a 25% decrease" },
  ],
});