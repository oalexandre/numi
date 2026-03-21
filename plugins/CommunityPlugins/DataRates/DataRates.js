let UNITS = ['', 'kilo', 'Mega', 'Giga', 'Tera'];

let ratio = 1;
for (let unit of UNITS){
    let id = unit.substring(0,1) + "bps";
    let phrase1 = unit.substring(0,1) + "bps";
    let phrase2 = unit + "bits per second";
    let format = unit + "bits/s";
    numi.addUnit({
        "id": id,
        "phrases": phrase1 + ", " + phrase2,
        "baseUnitId": "second",
        "format" : format,
        "ratio" : ratio,
    });

    id = unit.substring(0,1) + "Bps";
    phrase1 = unit.substring(0,1) + "Bps";
    phrase2 = unit + "bytes per second";
    format = unit + "bytes/s";
    numi.addUnit({
        "id": id,
        "phrases": phrase1 + ", " + phrase2,
        "baseUnitId": "second",
        "format" : format,
        "ratio" : ratio * 8,
    });
    ratio = ratio * 1000;
}

// Almost the same, but for powers of 1024 (starting at kibibits)
UNITS = ['kibi', 'Mibi', 'Gibi', 'Tibi'];

ratio = 1024;
for (let unit of UNITS){
    let id = unit.substring(0,2) + "bps";
    let phrase1 = unit.substring(0,2) + "bps";
    let phrase2 = unit + "bits per second";
    let format = unit + "bits/s";
    numi.addUnit({
        "id": id,
        "phrases": phrase1 + ", " + phrase2,
        "baseUnitId": "second",
        "format" : format,
        "ratio" : ratio,
    });

    id = unit.substring(0,2) + "Bps";
    phrase1 = unit.substring(0,2) + "Bps";
    phrase2 = unit + "bytes per second";
    format = unit + "bytes/s";
    numi.addUnit({
        "id": id,
        "phrases": phrase1 + ", " + phrase2,
        "baseUnitId": "second",
        "format" : format,
        "ratio" : ratio * 8,
    });
    ratio = ratio * 1024;
}

numi.addTest({ description: "1 kbps = 1000 bps", input: "1 kbps to bps", expected: 1000 });
numi.addTest({ description: "1 Mbps = 1000 kbps", input: "1 Mbps to kbps", expected: 1000 });

numi.addHelp({
  title: "Data Rates",
  description: "Convert between data transfer rate units (bits and bytes per second)",
  examples: [
    { input: "100 Mbps to kbps", output: "100,000 kilobits/s" },
    { input: "1 Gbps to MBps", output: "125 Megabytes/s", desc: "Bits to bytes" },
    { input: "1 Kibps to bps", output: "1,024 bits/s", desc: "Binary prefix (1024-based)" },
  ],
});
