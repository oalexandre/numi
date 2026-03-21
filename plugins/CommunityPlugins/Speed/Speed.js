numi.addUnit({
    "id": "kmh",
    "phrases": "kmh, kmph, khm, kph, klicks, kilometers per hour",
    "baseUnitId": "second",
    "format": "km/h",
    "ratio": 1
});

numi.addUnit({
    "id": "mph",
    "phrases": "mph, miles per hour",
    "baseUnitId": "second",
    "format": "mph",
    "ratio": 1.609344
});

numi.addUnit({
    "id": "meterspersecond",
    "phrases": "mps, meters per second",
    "baseUnitId": "second",
    "format": "m/s",
    "ratio": 3.6
});

numi.addUnit({
    "id": "feetpersecond", // allow for "frames per second" elsewhere
    "phrases": "fps, ftps, ft per sec, ft per second, feet per second",
    "baseUnitId": "second",
    "format": "ft/s",
    "ratio": 1.097
});

numi.addUnit({
    "id": "knots",
    "phrases": "kts, knots",
    "baseUnitId": "second",
    "format": "kt",
    "ratio": 1.852
});

numi.addTest({ description: "100 kmh ≈ 62.14 mph", input: "100 kmh to mph", expected: 62.137, tolerance: 0.1 });
numi.addTest({ description: "1 mps = 3.6 kmh", input: "1 mps to kmh", expected: 3.6, tolerance: 0.01 });
