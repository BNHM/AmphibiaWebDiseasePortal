const baseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'

class Dashboard{
  constructor() {
    let mychart = this;

    $('#dashboardSelect').change(function(mychart) {
      const selectedValue = $('#dashboardSelect').val().trim()
      if (selectedValue == "country") {
        // countryCountByProject()
      } else if ((selectedValue == "bdByCountry")) {
        bdByCountry()
      } else if (selectedValue == 'bsalByCountry') {
        bsalByCountry()
      } else if (selectedValue == 'bothByCountry') {
        bothPathogens()
      } else if (selectedValue == 'bothStacked') {
        bothStacked()
      }
    })

    $('#result-select').change(function(mychart) {
      const selectedValue = $('#result-select').val().trim()
      if (selectedValue == 'bdDetected') {
        bdDetected()
      } else if (selectedValue == 'bsalDetected') {
        bsalDetected()
      } else if (selectedValue == 'bothDetected') {
        bothDetected()
      } else if (selectedValue == 'bdDetectedByCountry') {
        bdDetectedByCountry()
      } else if (selectedValue == 'bsalDetectedByCountry') {
        bsalDetectedByCountry()
      } else if (selectedValue == 'bothDetectedByCountry') {
        bothDetectedByCountry()
      } 
    })

    $('#byYear-select').change(function(mychart) {
      const selectedValue = $('#byYear-select').val().trim()
      if (selectedValue == 'bdByYear') {
        bdByYear()
      } else if (selectedValue == 'bsalByYear') {
        bsalByYear()
      } else if (selectedValue == 'bothByYear') {
        bothByYear()
      } else if (selectedValue == 'bothByYearStacked') {
        bothByYearStacked()
      }
    })

  }
}

// Fetch data for both stacked
async function getBothByYearStackedData() {
  const response = await fetch(`${baseURL}yearCollected_Both_stacked.json`)
  const data = await response.json()

  let year = []
  let bd = []
  let bsal = []

  data.forEach(entry => {
    year.push(entry.yearCollected)
    bd.push(entry.Bd)
    bsal.push(entry.Bsal)
  })
  return { year, bd, bsal }
}

//Both by year stacked Chart
async function bothByYearStacked() {
let data = await getBothByYearStackedData()
makeStackedBarChart(data.year, 'Bd', data.bd, 'Bsal', data.bsal)
}

// Fetch Both By year collected
async function getBothByYearData() {
  const response = await fetch(`${baseURL}yearCollected_Both.json`)
  const data = await response.json()

  let yearCollected = []
  let value = []

  data.forEach(entry => {
    yearCollected.push(entry.yearCollected)
    value.push(entry.value)
  })
  return { yearCollected, value }
}

// Build Bar chart for both by year collected
async function bothByYear() {
  let data = await getBsalByYearData()
  makeBarChart(data.yearCollected, 'Both by Year Collected', data.value)
}

// Fetch Bsal By year collected
async function getBsalByYearData() {
  const response = await fetch(`${baseURL}yearCollected_Bsal.json`)
  const data = await response.json()

  let yearCollected = []
  let value = []

  data.forEach(entry => {
    yearCollected.push(entry.yearCollected)
    value.push(entry.value)
  })
  return { yearCollected, value }
}

// Build Bar chart for bsal by year collected
async function bsalByYear() {
  let data = await getBsalByYearData()
  makeBarChart(data.yearCollected, 'Bsal by Year Collected', data.value)
}

// Fetch Bd By year collected
async function getBdByYearData() {
  const response = await fetch(`${baseURL}yearCollected_Bd.json`)
  const data = await response.json()
  let yearCollected = []
  let value = []

  data.forEach(entry => {
    yearCollected.push(entry.yearCollected)
    value.push(entry.value)
  })
  return { yearCollected, value }
}

// Build Bar chart for bd by year collected
async function bdByYear() {
  let data = await getBdByYearData()
  makeBarChart(data.yearCollected, 'Bd by Year Collected', data.value)
}

// Both Detected by country
async function getBothDetectedByCountryData() {
  const response = await fetch(`${baseURL}country_diseaseDetected_Both.json`)
  const data = await response.json()
  
  let country = []
  let trueCount = []
  let falseCount = []

  data.forEach(entry => {
    country.push(entry.country)
    trueCount.push(entry.True)
    falseCount.push(entry.False)
  })
  return { country, trueCount, falseCount }
}

// Stacked Both by Country Bar Chart
async function bothDetectedByCountry() {
  let data = await getBothDetectedByCountryData()
  makeStackedBarChart(data.country, 'Both True', data.trueCount, 'Both False', data.falseCount)
}

// Bsal Detected by country
async function getBsalDetectedByCountryData() {
  const response = await fetch(`${baseURL}country_diseaseDetected_Bsal.json`)
  const data = await response.json()
  
  let country = []
  let trueCount = []
  let falseCount = []

  data.forEach(entry => {
    country.push(entry.country)
    trueCount.push(entry.True)
    falseCount.push(entry.False)
  })
  return { country, trueCount, falseCount }
}

// Stacked Bsal by Country Bar Chart
async function bsalDetectedByCountry() {
  let data = await getBsalDetectedByCountryData()
  makeStackedBarChart(data.country, 'Bsal True', data.trueCount, 'Bsal False', data.falseCount)
}

// Bd Detected by country
async function getBdDetectedByCountryData() {
  const response = await fetch(`${baseURL}country_diseaseDetected_Bd.json`)
  const data = await response.json()
  
  let country = []
  let trueCount = []
  let falseCount = []

  data.forEach(entry => {
    country.push(entry.country)
    trueCount.push(entry.True)
    falseCount.push(entry.False)
  })
  return { country, trueCount, falseCount }
}

// Stacked Bd by Country Bar Chart
async function bdDetectedByCountry() {
  let data = await getBdDetectedByCountryData()
  makeStackedBarChart(data.country, 'Bd True', data.trueCount, 'Bd False', data.falseCount)
}

// Fetch data for both detected
async function getBothDetectedData() {
  const response = await fetch(`${baseURL}diseaseDetected_Both.json`)
  const data = await response.json()

  let detectedLabel = []
  let detectedValue = []

  data.forEach(entry => {
    detectedValue.push(entry.value)
    detectedLabel.push(entry.diseaseDetected)
  })
  return { detectedValue, detectedLabel }
}

// Both Detected Pie Chart
async function bothDetected() {
  let data = await getBothDetectedData()
  makePieChart(data.detectedLabel, 'Both Detected', data.detectedValue)
}

//Fetch Bsal Detected By Country Data
async function getBsalDetectedData() {
  const response = await fetch(`${baseURL}diseaseDetected_Bsal.json`)
  const data = await response.json()

  let detectedLabel = []
  let detectedValue = []

  data.forEach(entry => {
    detectedValue.push(entry.value)
    detectedLabel.push(entry.diseaseDetected)
  })

  return { detectedLabel, detectedValue }
}

// Display bsal detected in pie chart
async function bsalDetected() {
  let data = await getBsalDetectedData()
makePieChart(data.detectedLabel, 'Bsal Detected', data.detectedValue)
}

// Fetch Bd Detected Data
async function getBdDetectedData() {
  const response = await fetch(`${baseURL}diseaseDetected_Bd.json`)
  const data = await response.json()

  let detectedLabel = []
  let detectedValue = []

  data.forEach(entry => {
    detectedValue.push(entry.value)
    detectedLabel.push(entry.diseaseDetected)
  })
  return { detectedLabel, detectedValue }
}

// Display bd detected pie chart
async function bdDetected() {
  let data = await getBdDetectedData()
makePieChart(data.detectedLabel, 'Bd Detected', data.detectedValue)
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

  // Function for making a generic Stacked bar chart
  function makeStackedBarChart(xLabel, valueLabelOne, valuesOne, valueLabelTwo, valuesTwo) {
    let ctx = document.getElementById('dashboardChart').getContext('2d');
  
    let dataChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: xLabel,
        datasets: [
          {
            label: valueLabelOne,
            data: valuesOne,
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            label: valueLabelTwo,
            data: valuesTwo,
            backgroundColor: 'rgb(54,162,235)',
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
  
  // Function for making a generic bar chart
  function makeBarChart(xLabel, dataLabel, values) {
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
        labels: xLabel,
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
  
  // Function for making a generic pie chart
  function makePieChart(chartLabel, dataLabel, values) {
    let ctx = document.getElementById('dashboardChart').getContext('2d');
  
     return new Chart(ctx, {
      type: "pie",
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
            backgroundColor: ['rgb(54,162,235)', 'rgb(255, 99, 132)']
          }
        ]
      }
    });
  }
