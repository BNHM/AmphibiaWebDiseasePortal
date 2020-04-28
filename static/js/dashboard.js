const baseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'

// Function for making a generic bar chart
function makeBarChart(chartLabel, dataLabel, values) {
  let ctx = document.getElementById('dashboardChart').getContext('2d');

   return new Chart(ctx, {
    type: "bar",
    options: {
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    },
    data: {
      labels: chartLabel,
      datasets: [
        {
          label: dataLabel,
          data: values,
          backgroundColor: 'rgb(255, 99, 132)'
        }
      ]
    }
  });
}

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
  let data = await getBsalByCountryData()
  makeBarChart(data.country, 'Bsal', data.bsalCount)
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
  // let ctx = document.getElementById('dashboardChart').getContext('2d');
  let data = await getBdByCountryData()
  makeBarChart(data.country, 'Bd', data.bdCount)
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
  let data = await getDataBothPathogens()
  makeBarChart(data.country, 'Total Bd and Bsal Samples Collected By Country', data.totalSamples)
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

  let dataChart = new Chart(ctx, {
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

      $('#dashboardSelect').change(function(mychart) {
        const selectedVariable = $('#dashboardSelect').val().trim()
        if (selectedVariable == "country") {
          // countryCountByProject()
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
  }
