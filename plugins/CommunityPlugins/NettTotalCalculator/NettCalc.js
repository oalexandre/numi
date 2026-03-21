// Find nett of gross amount including tax

// Function to find the nett figure of a gross input amount
numi.addFunction({ "id" : "nett", "phrases" : "nett" }, function(values) {
    
    // You can change `20` to your tax amount to set as default
    var vat = values[1]?.double ?? 20;
    
    return { "double": (values[0].double/(vat+100)) * 100 };

});

numi.addHelp({
  title: "Nett Calculator",
  description: "Calculate the net amount from a gross amount including tax",
  examples: [
    { input: "nett(120)", output: "100", desc: "Net from gross at default 20% tax" },
    { input: "nett(110, 10)", output: "100", desc: "Net from gross at 10% tax" },
  ],
});

