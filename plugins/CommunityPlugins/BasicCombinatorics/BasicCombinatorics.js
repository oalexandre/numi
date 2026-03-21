function fact(num) {
  if (num < 0) return -1;
  if (num === 0) return 1;

  return num * fact(num - 1);
}

function permute(values) {
  const [n, r] = values;

  return {double: fact(n.double) / fact(n.double - r.double)};
}

function choose(values) {
  const [, r] = values;

  return {double: permute(values).double / fact(r.double)};
}

numi.addFunction({id: 'choose', phrases: 'choose'}, choose);

numi.addFunction({id: 'permute', phrases: 'permute'}, permute);

numi.addHelp({
  title: "Combinatorics",
  description: "Combinations and permutations",
  examples: [
    { input: "choose(10, 3)", output: "120", desc: "10 choose 3 (C(n,r))" },
    { input: "permute(5, 2)", output: "20", desc: "Permutations of 5 taken 2 at a time" },
  ],
});
