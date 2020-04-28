const baseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'


//TODO: The following functions:

// async function yearCollectedData() {
//   let id = 255
//   const response = await fetch(`https://api.geome-db.org/records/Sample/json?limit=10000&page=0&networkId=1&q=_projects_:${id}_select_:%5BEvent,Sample%5D+&source=Event.yearCollected,expeditionCode`)
//   const data = await response.json()

// console.log(data.content)
// let event = data.content.Event
// let yearCollected = []

// event.forEach(entry => {
//   //console.log(entry.yearCollected)
// })
// }
// yearCollectedData()

// async function getCountryCountByProject() {
//   let id = 255
//   const response = await fetch(`https://api.geome-db.org/records/Sample/json?limit=10000&page=0&networkId=1&q=_projects_:${id}+_select_:%5BEvent%5D+&source=Event.country,expeditionCode`)
//   const data = await response.json()

//   let country = []

//   let event = data.content.Event
//   event.forEach(entry => {
//     console.log(entry.country)
//     country.push(entry.country)
//   })
//   return { country }
// }

async function countryCountByProject() {
  let ctx = document.getElementById('dashboardChart').getContext('2d');
  let data = await getCountryCountByProject()

  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.country,
      datasets: [
        {
          label: 'Countries Sampled Count',
          data: data.country,
          backgroundColor: 'rgb(255, 99, 132)',
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    }
  });

}
// getCountryCountByProject()

// Fetch Bsal by Country
async function getBsalByCountryData() {
  const response = await fetch(`${baseURL}country_Bsal.json`)
  const data = await response.json()

  let country = []
  let bsalCount = []

  data.forEach(entry => {
    country.push(entry.country)
    bsalCount.push(entry.value)
  })
  return { country, bsalCount}
}

// Display Bsal by Country Chart
async function bsalByCountry() {
  let ctx = document.getElementById('dashboardChart').getContext('2d');
  let data = await getBsalByCountryData()

  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.country,
      datasets: [
        {
          label: 'Bsal',
          data: data.bsalCount,
          backgroundColor: 'rgb(255, 99, 132)',
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    }
  });

}

// Bd Samples by Country
async function getBdByCountryData() {
  const response = await fetch(`${baseURL}country_Bd.json`)
  const data = await response.json()

  let country = []
  let bdCount = []

  data.forEach(entry => {
    country.push(entry.country)
    bdCount.push(entry.value)
  })
  return { country, bdCount }
}

async function bdByCountry() {
  let ctx = document.getElementById('dashboardChart').getContext('2d');
  let data = await getBdByCountryData()

  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.country,
      datasets: [
        {
          label: 'Bd',
          data: data.bdCount,
          backgroundColor: 'rgb(255, 99, 132)',
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    }
  });

}

// Get totals together for both pathogens
async function getDataBothPathogens() {
  const response = await fetch(`${baseURL}country_Both.json`)
  const data = await response.json()

  let country = []
  let totalSamples = []

  data.forEach(event => {
    country.push(event.country)
    totalSamples.push(event.value)
  })
  return { country, totalSamples }
  
}

async function bothPathogens() {
  let ctx = document.getElementById('dashboardChart').getContext('2d');
  let data = await getDataBothPathogens()

  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.country,
      datasets: [
        {
          label: 'Total Bd and Bsal Samples Collected By Country',
          data: data.totalSamples,
          backgroundColor: 'rgb(255, 99, 132)',
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    }
  });

}

// Stacked Data for Bd and Bsal by country
async function getStackedBdBsalData() {
  const response = await fetch(`${baseURL}country_Both_stacked.json`)
  const data = await response.json()
  
  let countries = []
  let bdCounts = []
  let bsalCounts = []

  data.forEach(entry => {
    countries.push(entry.country)
    bdCounts.push(entry.Bd)
    bsalCounts.push(entry.Bsal)
  })
  return { countries, bdCounts, bsalCounts }
}

// Display data for both Bd and Bsal Stacked
async function bothStacked() {
let ctx = document.getElementById('dashboardChart').getContext('2d');
let data = await getStackedBdBsalData()

  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.countries,
      datasets: [
        {
          label: 'Bd Samples Collected',
          data: data.bdCounts,
          backgroundColor: '#FAEBCC',
        },
        {
          label: 'Bsal Samples Collected',
          data: data.bsalCounts,
          backgroundColor: '#EBCCD1',
        }
      ],
    },
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      },
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    }
  });
      }



class Dashboard{
    // Build the dashboard chart interface
    constructor() {
      let mychart = this;
  
      // TODO: create method to select projects that are part of the AD portal team (see /project/stats JSON call)
      // For now, the uploaded project identifiers are hard-coded right here, see
      // https://github.com/jdeck88/AmphibiaWebDiseasePortal/issues/6
      this.projectIds = "255"
      

      $('#dashboardSelect').change(function(mychart) {
        const selectedVariable = $('#dashboardSelect').val().trim()
        if (selectedVariable == "country") {
          dashboard.countryCount()
          // countryCountByProject()
        } else if (selectedVariable == "yearCollected"){
          dashboard.yearCollectedCount();
        } else if ((selectedVariable == "bdByCountry")) {
          bdByCountry()
        } else if (selectedVariable == 'bsalByCountry') {
          bsalByCountry()
        } else if (selectedVariable == 'bothByCountry') {
          bothPathogens()
        } else if (selectedVariable == 'bothStacked') {
          bothStacked()
        }
      })

    }

    // Count of records by country
    countryCount() {
      d3
      .json("https://api.geome-db.org/records/Sample/json?limit=10000&page=0&networkId=1&q=_projects_:" + this.projectIds + "+" +
          "_select_:%5BEvent%5D+&source=Event.country,expeditionCode")
      .then(function(samples) {
        let metrics = d3.nest()
        .key(function(d) { return (d.country); })
        .rollup(function(v) { return {
          count: v.length
          //total: d3.sum(v, function(d) { return d.yearCollected; }),
          //avg: d3.mean(v, function(d) { return d.yearCollected; })
        }; })
        .entries(samples.content.Event);
  
        let labels = metrics.map(function(d) {
          return d.key;
        });
        let codes = metrics.map(function(d) {
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
        let metrics = d3.nest()
        .key(function(d) { return (d.yearCollected); })
        .rollup(function(v) { 
          console.log(v.length)
          return {
          count: v.length
        }; })
        .entries(samples.content.Event);
  
        let labels = metrics.map(function(d) {
          return d.key;
        });
        let codes = metrics.map(function(d) {
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
      let chart = new Chart('dashboardChart', {
        type: "bar",
        options: {
          maintainAspectRatio: false,
          legend: {
            display: true
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
