numi.addUnit({
    "id": "FiveCents",
    "phrases": "nickel, Nickel, nickels, Nickels, FiveCent, FiveCents",
    "baseUnitId": "CAD",
    "format" : "Nickels",
    "ratio" : 0.05,
});

numi.addUnit({
    "id": "TenCents",
    "phrases": "dime, Dime, dimes, Dimes, TenCent, TenCents",
    "baseUnitId": "CAD",
    "format" : "Dimes",
    "ratio" : 0.1,
});

numi.addUnit({
    "id": "TwentyFiveCents",
    "phrases": "quarter, Quarter, quarters, Quarters, TwentyFiveCent, TwentyFiveCents",
    "baseUnitId": "CAD",
    "format" : "Quarters",
    "ratio" : 0.25,
});

numi.addUnit({
    "id": "OneDollars",
    "phrases": "loonie, Loonie, loonies, Loonies, OneDollar, OneDollars",
    "baseUnitId": "CAD",
    "format" : "Loonies",
    "ratio" : 1,
});

numi.addUnit({
    "id": "TwoDollars",
    "phrases": "toonie, Toonie, toonies, Toonies, TwoDollar, TwoDollars",
    "baseUnitId": "CAD",
    "format" : "Toonies",
    "ratio" : 2,
});

numi.addHelp({
  title: "Canadian Coins",
  description: "Convert between CAD and Canadian coin denominations",
  examples: [
    { input: "5 CAD to quarters", output: "20 Quarters" },
    { input: "10 loonies to toonies", output: "5 Toonies" },
    { input: "100 nickels to CAD", output: "5 CAD" },
  ],
});
