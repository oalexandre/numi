numi.addUnit({
   "id": "horsepower",
   "phrases": "hp, horsepower",
   "baseUnitId": "second",
   "format" : "hp",
   "ratio" : 1,
});

numi.addUnit({
   "id": "kw",
   "phrases": "kw, KW, kilowatts",
   "baseUnitId": "w",
   "format" : "kw",
   "ratio" : 1.341,
});

numi.addHelp({
  title: "Engine Power",
  description: "Convert between horsepower and kilowatts",
  examples: [
    { input: "150 hp to kw", output: "111.86 kw" },
    { input: "100 kw to hp", output: "134.1 hp" },
  ],
});
