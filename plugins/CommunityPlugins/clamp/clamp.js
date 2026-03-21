numi.addFunction({
	"id": "clamp",
	"phrases": "clamp"
}, function (values) {
	return {
		"double": values[0].double > values[2].double ? values[2].double : (values[0].double < values[1].double ? values[1].double : values[0].double)
	};
});

numi.addHelp({
  title: "Clamp",
  description: "Clamp a value between a minimum and maximum",
  examples: [
    { input: "clamp(15, 0, 10)", output: "10", desc: "15 clamped to max 10" },
    { input: "clamp(-5, 0, 100)", output: "0", desc: "-5 clamped to min 0" },
    { input: "clamp(50, 0, 100)", output: "50", desc: "50 is within range" },
  ],
});