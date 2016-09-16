var n = 10, // how many bars?
    random = function() { return Math.floor(Math.random() * 100); }, // randomize some numbers for data
    data = d3.range(n).map(random); // an array of randomized datapoints

var barChart = {
  init: function() {
    this.height = 100;
    this.width = 220;
    this.padding = 12;
    this.el = ".bar-chart"; // where we'll put our svg 

    // calculate the bar width from the total chart width
    barWidth = Math.floor((this.width - (this.padding * (data.length - 1))) / data.length);
    barHeight = this.height - 20;


    this.svg = d3.select(this.el).insert('svg', ':first-child')
      .attr('width', this.width)
      .attr("height", this.height);
    
    this.draw();
  },
    draw: function() {
    this.meters = this.svg
      .append("g")
        .attr("class", "meter")
        .selectAll("rect")
          .data(data)
          .enter()
          .append('g')
            .attr("class", "bar");

    this.drawBar().attr("class", "background").attr("y", 0).attr("height", barHeight);
    this.drawBar().attr("class", "foreground").attr("y", barHeight).attr("height", 0);
  },
    // this actually draws a bar
  drawBar: function () {
    var self = this;

    return this.meters.append("rect")
      .attr("x", function (d, i) {
        return i * (barWidth + self.padding);
      })
      .attr("width", barWidth);
  },
 update: function () {
      var self = this;
      // select the foreground bars and call the animate method on them
      d3.selectAll("rect.foreground").each(self.animate);
  },

  animate: function (d, i) {
    var total = data[i];
    var bar = d3.select(this);
    if (barHeight - total != bar.attr("y")) {
      bar.transition().duration(1500).attr("height", total).attr("y", barHeight - total);
    }
  }
}

barChart.init();

// In this example, every couple seconds update the bar chart with new numbers!
setInterval(function() {
  data = d3.range(n).map(random); // get new random numbers
  barChart.update();
}, 2000);