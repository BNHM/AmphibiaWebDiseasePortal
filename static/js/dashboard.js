let baseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'

class Dashboard{
    // Build the dashboard chart interface
    constructor() {
      var mychart = this;
  
      // TODO: create method to select projects that are part of the AD portal team (see /project/stats JSON call)
      // For now, the uploaded project identifiers are hard-coded right here, see
      // https://github.com/jdeck88/AmphibiaWebDiseasePortal/issues/6
      this.projectIds = "255"
      
      // First dropdown
      var dashboardForm = $('#dashboardForm');
      var dashboardSelect = $('<select>').appendTo(dashboardForm);
  
      dashboardSelect.attr("id", "dashboardSelect")
      dashboardSelect.append($("<option>").attr("value","").text("-- Choose a Value --"));
      dashboardSelect.append($("<option>").attr("value","country").text("Country Count"));
      dashboardSelect.append($("<option>").attr("value","yearCollected").text("Year Collected Count"));
      dashboardSelect.append($("<option>").attr("value","bdByCountry").text("Bd Counts By Country"));
      dashboardSelect.append($("<option>").attr("value","bsalByCountry").text("Bsal Counts By Country"));
      dashboardSelect.append($("<option>").attr("value","bothByCountry").text("Both Bsal and Bd Counts By Country"));
      dashboardSelect.append($("<option>").attr("value","bothStacked").text("Both Bsal and Bd Counts Stacked By Country"));



  
      dashboardForm.append(document.createTextNode("Choose a chart:"));
      dashboardForm.append(dashboardSelect);

      $('#dashboardSelect').change(function(mychart) {
        var selectedVariable = $('#dashboardSelect').val().trim()
        if (selectedVariable == "country") {
          dashboard.countryCount();
        } else if (selectedVariable == "yearCollected"){
          dashboard.yearCollectedCount();
        } else if ((selectedVariable == "bdByCountry")) {
          dashboard.bdByCountry()
        } else if (selectedVariable == 'bsalByCountry') {
          dashboard.bsalByCountry()
        } else if (selectedVariable == 'bothByCountry') {
          dashboard.bothByCountry()
        } else if (selectedVariable == 'bothStacked') {
          dashboard.bothStacked()
        }
      })

      // project Dropdown
      // let projectDash = $('#project-dash')
      // let projectDashSelect = $('<select>').appendTo(projectDash)

      // projectDashSelect.attr('id', 'projectDashSelect')
      // projectDashSelect.append($("<option>").attr("value","").text("-- Select By Project --"))
      // projectDashSelect.append($("<option>").attr("value","sample").text("Testing"))

      // projectDash.append(document.createTextNode('View Data By Individual Project:'))
      // projectDash.append(projectDashSelect)

      // document.querySelector('#projectDashSelect').addEventListener('change', function() {
      //   let selectedOption = document.querySelector('#projectDashSelect').value
        
      //   if (selectedOption == 'sample') {
      //     console.log(selectedOption)
      //   }
      // })

    }
    
    // BD samples by country chart
    bdByCountry() {
      d3.json(`${baseURL}country_Bd.json`)
      .then(samples => {
        //console.log(samples)
        let data = d3.nest()
        .key(function(d) { return (d.country) })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.value })})
        .entries(samples)
    
        var labels = data.map(function(d) {
          console.log(d.key)
          return d.key
        })
        var codes = data.map(function(d) {
          console.log(d.value)
          return d.value
        })
        dashboard.makeGenericChart(labels, codes)
      })
    }

    // BSAL by country chart
    bsalByCountry() {
      d3.json(`${baseURL}country_Bsal.json`)
      .then(samples => {
        //console.log(samples)
        let data = d3.nest()
        .key(function(d) { return (d.country) })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.value })})
        .entries(samples)
    
        var labels = data.map(function(d) {
          console.log(d.key)
          return d.key
        })
        var codes = data.map(function(d) {
          console.log(d.value)
          return d.value
        })
        dashboard.makeGenericChart(labels, codes)
      })
    }

    bothByCountry() {
      d3.json(`${baseURL}country_Both.json`)
      .then(samples => {
        //console.log(samples)
        let data = d3.nest()
        .key(function(d) { return (d.country) })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.value })})
        .entries(samples)
    
        var labels = data.map(function(d) {
          console.log(d.key)
          return d.key
        })
        var codes = data.map(function(d) {
          console.log(d.value)
          return d.value
        })
        dashboard.makeGenericChart(labels, codes)
      })
    }

    bothStacked() {
      var ctx = document.getElementById('dashboardChart').getContext('2d');

      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Risk Level', 'Another Label'],
          datasets: [
            {
              label: 'Low',
              data: [67.8],
              backgroundColor: '#D6E9C6',
            },
            {
              label: 'Moderate',
              data: [20.7],
              backgroundColor: '#FAEBCC',
            },
            {
              label: 'High',
              data: [11.4],
              backgroundColor: '#EBCCD1',
            }
          ],
        
          
          
        },
        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }]
          },
            responsive: false
        }
      });
          }
    
  
    // Count of records by country
    countryCount() {
      d3
      .json("https://api.geome-db.org/records/Sample/json?limit=10000&page=0&networkId=1&q=_projects_:" + this.projectIds + "+" +
          "_select_:%5BEvent%5D+&source=Event.country,expeditionCode")
      .then(function(samples) {
        var metrics = d3.nest()
        .key(function(d) { return (d.country); })
        .rollup(function(v) { return {
          count: v.length
          //total: d3.sum(v, function(d) { return d.yearCollected; }),
          //avg: d3.mean(v, function(d) { return d.yearCollected; })
        }; })
        .entries(samples.content.Event);
  
        var labels = metrics.map(function(d) {
          return d.key;
        });
        var codes = metrics.map(function(d) {
          return d.value.count;
        });
        dashboard.makeGenericChart(labels, codes);
        ;
      }
      );
    }
    // Count of records by yearCollected by projectId
    yearCollectedCount() {
      d3
      .json("https://api.geome-db.org/records/Sample/json?limit=10000&page=0&networkId=1&q=_projects_:" + this.projectIds +"+" +
          "_select_:%5BEvent,Sample%5D+&source=Event.yearCollected,expeditionCode")
      .then(function(samples) {
        var metrics = d3.nest()
        .key(function(d) { return (d.yearCollected); })
        .rollup(function(v) { return {
          count: v.length
        }; })
        .entries(samples.content.Event);
  
        var labels = metrics.map(function(d) {
          return d.key;
        });
        var codes = metrics.map(function(d) {
          return d.value.count;
        });
        dashboard.makeGenericChart(labels, codes);
      }
      );
    }
  
    /*
    Pass an object to a generic function for mapping
    */
    makeGenericChart(labels, values) {
      var chart = new Chart('dashboardChart', {
        type: "bar",
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          }
        },
        data: {
          labels: labels,
          datasets: [
            {
              data: values
            }
          ]
        }
      });
    }
  }
