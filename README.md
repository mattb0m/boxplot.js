# boxplot.js
HTML (canvas) and JS based tool for drawing box-and-whisker plots form existing five-number summaries.

## To launch the tool
1. Open boxplot.html in a Web browser

## To update the graph
1. Complete the title
2. Complete the x-axis range
3. Complete the x-axis tick spacing
4. Click the "Update Graph" button

## To add a box plot
1. Optionally complete the plot title
2. Complete the five-number summary
3. Click the "Add" button

## To reset the graph
1. Refresh the Web page in your browser

## To save the graph
1. Right-click the graph
2. Select "Save Image As"
3. Save the image to your machine

## Jmeter sample configuration
This tool was initially developped as an aid to Apache Jmeter to illustrate five-number summeries output by a load test. 
In order to generate the proper percentiles in that tool's Aggregate Report, the following lines can be added to its configuration file: 

    # First percentile to display, Q1
    aggregate_rpt_pct1=25
    # Second percentile to display, Q3
    aggregate_rpt_pct2=75
    # Third percentile to display, 90%
    aggregate_rpt_pct3=90
