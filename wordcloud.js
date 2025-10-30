const drawViz = (data, element) => {
  element.innerHTML = "";
  const width = element.offsetWidth, height = element.offsetHeight;
  const svg = d3.select(element).append("svg").attr("width", width).attr("height", height);
  const layout = d3.layout.cloud()
    .size([width, height])
    .words(data.map(d => ({ text: d.word, size: d.frequency * 2, sentiment: d.sentiment })))
    .padding(3)
    .rotate(() => 0)
    .fontSize(d => d.size)
    .on("end", words => {
      svg.append("g")
        .attr("transform", `translate(${width/2},${height/2})`)
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", d => d.sentiment === "positive" ? "green" :
                           d.sentiment === "negative" ? "red" : "gray")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
    });
  layout.start();
};

// Listen for data updates
google.visualization.events.addListener(window, 'data', (e) => {
  const data = e.data.tables.DEFAULT.map(row => ({
    word: row.word,
    frequency: row.frequency,
    sentiment: row.sentiment
  }));
  drawViz(data, document.getElementById('container'));
});
