numi.addUnit({
    "id": "milliwatt",
    "phrases": "milliwatt, mW",
    "baseUnitId": "watt",
    "format": "mW",
    "ratio": 0.001,
});
numi.addUnit({
    "id": "watt",
    "phrases": "watt, W",
    "format": "W",
    "ratio": 1,
});
numi.addUnit({
    "id": "kilowatt",
    "phrases": "kilowatt, kW",
    "baseUnitId": "watt",
    "format": "kW",
    "ratio": 1000,
});
numi.addUnit({
    "id": "megawatt",
    "phrases": "megawatt, MW",
    "baseUnitId": "watt",
    "format": "MW",
    "ratio": 1000000,
});
numi.addUnit({
    "id": "gigawatt",
    "phrases": "gigawatt, GW",
    "baseUnitId": "watt",
    "format": "GW",
    "ratio": 1000000000,
});

numi.addTest({ description: "1 kW = 1000 W", input: "1 kW to W", expected: 1000 });
numi.addTest({ description: "1 MW = 1000 kW", input: "1 MW to kW", expected: 1000 });
numi.addTest({ description: "1 W = 1000 mW", input: "1 W to mW", expected: 1000 });