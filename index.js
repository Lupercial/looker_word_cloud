// Listen for data updates from Looker Studio
looker.plugins.visualizations.add({
  id: "wordcloud_viz",
  label: "Sentiment Word Cloud",
  create: function(element, config) {
    element.innerHTML = "<div id='wordcloud-container'></div>";
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    // Clear previous
    element.innerHTML = "<svg id='wordcloud-svg' width='800' height='400'></svg>";

    // Extract data
    const words = [];
    data.tables.DEFAULT.forEach(row => {
      words.push({
        text: row.word,
        size: row.frequency * 10,
        sentiment: row.sentiment
      });
    });

    // Set up SVG
    const svg = d3.select("#wordcloud-svg");
    const layout = d3.layout.cloud()
      .size([800, 400])
      .words(words)
      .padding(2)
      .rotate(0)
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      svg.append("g")
        .attr("transform", "translate(400,200)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", d => {
          if (d.sentiment === "positive") return "#2ecc71";
          else if (d.sentiment === "negative") return "#e74c3c";
          else return "#999";
        })
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text);
    }

    done();
  }
});
