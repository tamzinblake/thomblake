/* global d3 $ */
$(function () {
  var margin = {top: 40 ,right: 40 ,bottom: 180 ,left: 80}
    , width = 960 - margin.left - margin.right
    , height = 500 - margin.top - margin.bottom

  var data

  var x = d3.scale.ordinal()
          .rangeRoundBands([0 ,width] ,.1)

  var y = d3.scale.linear()
          .range([height ,0])

  var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom')
              .tickFormat(function (d) { return data[d].data.course_name
                                       })

  var yAxis = d3.svg.axis()
              .scale(y)
              .orient('left')

  var svg = d3.select('body').append('svg')
            .attr('width' ,width + margin.left + margin.right)
            .attr('height' ,height + margin.top + margin.bottom)
            .append('g')
            .attr('transform' ,'translate(' + margin.left + ','
                              + margin.top + ')')

  var visualize = function (sent_data) {
    data = sent_data.data
    x.domain(data.map(function(d, i) { return i }))
    y.domain([0 ,d3.max(data ,function(d) { return d.data.students.length })])

    svg.append('g')
    .attr('class' ,'x axis')
    .attr('transform' ,'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor' ,'end')
    .attr('dx' ,'-.8em')
    .attr('dy' ,'.15em')
    .attr('transform' ,function(d) {
      return 'rotate(-65)'
    })

    svg.append('g')
    .attr('class' ,'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform' ,'rotate(-90)')
    .attr('y' ,6)
    .attr('dy' ,'.71em')
    .style('text-anchor' ,'end')
    .text('Number of students')

    svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class' ,'bar')
    .attr('x' ,function(d ,i) { return x(i) })
    .attr('width' ,x.rangeBand())
    .attr('y' ,function(d) { return y(d.data.students.length) })
    .attr('height' ,function(d) { return height - y(d.data.students.length) })
  }

  $.ajax( 'http://thomblake.me/v1.1/sections'
        , { success: visualize }
        )
})
