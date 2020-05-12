const baseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'

class Dashboard{
  constructor() {
    let mychart = this;
    buildSummaryTable()
    buildSpeciesTable()
    buildCountryTable()
    buildPathogenSummaryTable()

    const resultSelect = document.getElementById('result-select')
    const byYearSelect = document.getElementById('by-year-select')
    const speciesSelect = document.getElementById('by-species-select')
   
    resultSelect.addEventListener('change', function() {
      byYearSelect.value = ''
      speciesSelect.value = ''

       if (this.value == 'bothDetected') {
        bothDetected()
      } else if (this.value == 'bdDetectedByCountry') {
        bdDetectedByCountry()
      } else if (this.value == 'bsalDetectedByCountry') {
        bsalDetectedByCountry()
      } else if (this.value == 'bothDetectedByCountry') {
        bothDetectedByCountry()
      }  else if (this.value == 'bdDetectedByGenus') {
        bdDetectedByGenus()
      } else if (this.value == 'bsalDetectedByGenus') {
        bsalDetectedByGenus()
      } else if (this.value == 'bothDetectedByGenus') {
        bothDetectedByGenus()
      } else if (this.value == 'bdDetectedByScientificName') {
        bdDetectedByScientificName()
      } else if (this.value == 'bsalDetectedByScientificName') {
        bsalDetectedByScientificName()
      } else if (this.value == 'bothDetectedByScientificName') {
        bothDetectedByScientificName()
      }
    })

    byYearSelect.addEventListener('change', function() {
      speciesSelect.value = ''
      resultSelect.value = ''

     if (this.value == 'bdDetectedByYear') {
        bdDetectedByYear()
      } else if (this.value == 'bsalDetectedByYear') {
        bsalDetectedByYear()
      } else if (this.value == 'bothDetectedByYear') {
        bothDetectedByYear()
      } 
    })

    speciesSelect.addEventListener('change', function() {
      resultSelect.value = ''
      byYearSelect.value = ''

      if (this.value == 'bdGenus') {
        bdGenus()
      } else if (this.value == 'bsalGenus') {
        bsalGenus()
      } else if (this.value == 'bothGenus') {
        bothGenus()
      } else if (this.value == 'bothGenusStacked') {
        bothStackedGenus()
      } else if (this.value == 'bdScientificName') {
        bdScientificName()
      } else if (this.value == 'bsalScientificName') {
        bsalScientificName()
      } else if (this.value == 'bothScientificName') {
        bothScientificName()
      } else if (this.value == 'bothScientificNameStacked') {
        bothScientificNameStacked()
      }
    })
  }
}

async function buildSpeciesTable() {
  let data = await getBothScientificNameData()
  let objectArray = data.nameAndValue

  let sortedArray = objectArray.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value)
  });

  let tenItems = sortedArray.slice(0, 10)

  return tenItems.forEach(entry => {
    let table = document.getElementById('species-table')
    let tr = document.createElement('tr')

      tr.innerHTML = `
        <td>${entry.scientificName}</td>
        <td>${entry.value}</td>
      `
      table.appendChild(tr)
  })
}

async function buildCountryTable() {
  let data = await getDataBothPathogens()

  let objectArray = data.countryAndValue

  let sortedArray = objectArray.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value)
  });

  let tenItems = sortedArray.slice(0, 10)
  
  return tenItems.forEach(entry => {
    let table = document.getElementById('country-table')
    let tr = document.createElement('tr')

      tr.innerHTML = `
        <td>${entry.country}</td>
        <td>${entry.value}</td>
      `
      table.appendChild(tr)
  })
}

//TODO: FINSIH THIS TABLE
async function buildPathogenSummaryTable() {
  const bothTestedData = await getDiseaseTestedBothData()
  const bdData = await getBdDetectedData()
  const bsalData = await getBsalDetectedData()

  let bothTestedObj = bothTestedData.obj
  let bdObj = bdData.bdResultObj
  let bsalObj


  bothTestedObj.forEach(entry => {
    let table = document.getElementById('pathogen-summary-table')
    let tr = document.createElement('tr')  

    tr.innerHTML = `
    <td>${entry.diseaseTested}</td>
    <td>${entry.value}</td>
    `
    table.appendChild(tr)
  })

  // bdObj.forEach(entry => {
  //   console.log(entry)
  //   let table = document.getElementById('pathogen-summary-table')
  //   let tr = document.createElement('tr')  

  //   tr.innerHTML = `
  //   <td>${entry.diseaseDetected}</td>
  //   <td>${entry.value}</td>
  //   `
  //   table.appendChild(tr)
  // })
}

async function buildSummaryTable() {
  let countryData = await getDataBothPathogens()
  let speciesData = await getBothScientificNameData()

  let summaryTable = document.getElementById('summary-data-table')
  let tr = document.createElement('tr')

  // Data from fetch function for country count
  let totalSamples = countryData.totalSamples
  let countries = countryData.country

  // Data from fetch function for species count
  let species = speciesData.scientificName

  let countryCount = 0
  let speciesCount = 0

  let sampleSum = totalSamples.reduce(function(a,b) {
    return a + b
  }, 0)

  countries.forEach(entry => {
    countryCount++
  })

  species.forEach(item => {
    speciesCount++
  })

  tr.innerHTML = `
  <td>${sampleSum}</td>
  <td>${speciesCount}</td>
  <td>${countryCount}</td>
  `
  summaryTable.appendChild(tr)
}

// Colors to use in building charts based on what data is used.

// Orange
const bdColor = '#feb24c'
// Lavender
const bsalColor = '#bcbddc'
// Light Pink
const posColor = '#fbb4ae'
// Light Blue
const negColor = '#a6cee3'
// Grey
const genericColor = '#bdbdbd'


//FETCH Bd Detected by Scientific Name
async function getBdDetectedByScientificName() {
  const response = await fetch(`${baseURL}scientificName_diseaseDetected_Bd.json`)
  const data = await response.json()

  let scientificName = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    scientificName.push(entry.scientificName)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })
  return { scientificName, trueValue, falseValue }
}
// CHART Display Bd Detected By Scientific Name
async function bdDetectedByScientificName() {
  let data = await getBdDetectedByScientificName()
  makeStackedBarChart(data.scientificName, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

//FETCH Bsal Detected by Scientific Name
async function getBsalDetectedByScientificName() {
  const response = await fetch(`${baseURL}scientificName_diseaseDetected_Bsal.json`)
  const data = await response.json()

  let scientificName = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    scientificName.push(entry.scientificName)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })
  return { scientificName, trueValue, falseValue }

}

// CHART Display Bsal Detected By Scientific Name
async function bsalDetectedByScientificName() {
  let data = await getBsalDetectedByScientificName()
  makeStackedBarChart(data.scientificName, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH Both Detected by Scientific Name
async function getBothDetectedByScientificName() {
  const response = await fetch(`${baseURL}scientificName_diseaseDetected_Both.json`)
  const data = await response.json()

  let scientificName = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    scientificName.push(entry.scientificName)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })
  return { scientificName, trueValue, falseValue }

}

// CHART Display Both Detected by Scientific Name
async function bothDetectedByScientificName() {
  let data = await getBothDetectedByScientificName()
  makeStackedBarChart(data.scientificName, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)

}

// FETCH
async function getBdScientificNameData() {
  const response = await fetch(`${baseURL}scientificName_Bd.json`)
  const data = await response.json()

  let scientificName = []
  let value = []

  data.forEach(entry => {
    scientificName.push(entry.scientificName)
    value.push(entry.value)
  })
  return { scientificName, value }
}

// CHART
async function bdScientificName() {
  const data = await getBdScientificNameData()
makeBarChart(data.scientificName, 'Bd by Scientific Name', data.value, bdColor)
}

// FETCH
async function getBsalScientificNameData() {
  const response = await fetch(`${baseURL}scientificName_Bsal.json`)
  const data = await response.json()

  let scientificName = []
  let value = []

  data.forEach(entry => {
    scientificName.push(entry.scientificName)
    value.push(entry.value)
  })
  return { scientificName, value }

}

// CHART
async function bsalScientificName() {
  const data = await getBsalScientificNameData()
  makeBarChart(data.scientificName, 'Bsal by Scientific Name', data.value, bsalColor)  
}

// FETCH
async function getBothScientificNameData() {
  const response = await fetch(`${baseURL}scientificName_Both.json`)
  const data = await response.json()

  let scientificName = []
  let value = []
  let nameAndValue = []

  data.forEach(entry => {
    nameAndValue.push(entry)
    scientificName.push(entry.scientificName)
    value.push(entry.value)
  })
  return { scientificName, value, nameAndValue }

}

// CHART
async function bothScientificName() {
  const data = await getBothScientificNameData()
  makeBarChart(data.scientificName, 'Both by Scientific Name', data.value, bsalColor)
}

// FETCH
async function getBothScientificNameStackedData() {
  const response = await fetch(`${baseURL}scientificName_Both_stacked.json`)
  const data = await response.json()

  let scientificName = []
  let bdValue = []
  let bsalValue = []

  data.forEach(entry => {
    scientificName.push(entry.scientificName)
    bdValue.push(entry.Bd)
    bsalValue.push(entry.Bsal)
  })
  return { scientificName, bdValue, bsalValue }

}

// CHART
async function bothScientificNameStacked() {
  const data = await getBothScientificNameStackedData()
makeStackedBarChart(data.scientificName, 'Bd', data.bdValue, bdColor, 'Bsal', data.bsalValue, bsalColor)  
  
}

// FETCH
async function bdDetectedByYearData() {
  const response = await fetch(`${baseURL}yearCollected_diseaseDetected_Bd.json`)
  const data = await response.json()

  let yearCollected = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    yearCollected.push(entry.yearCollected)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { yearCollected, trueValue, falseValue }
}

// CHART
async function bdDetectedByYear() {
  let data = await bdDetectedByYearData()
makeStackedBarChart(data.yearCollected, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH
async function bsalDetectedByYearData() {
  const response = await fetch(`${baseURL}yearCollected_diseaseDetected_Bsal.json`)
  const data = await response.json()

  let yearCollected = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    yearCollected.push(entry.yearCollected)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { yearCollected, trueValue, falseValue }
}

// CHART
async function bsalDetectedByYear() {
  let data = await bsalDetectedByYearData()
makeStackedBarChart(data.yearCollected, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH
async function bothDetectedByYearData() {
  const response = await fetch(`${baseURL}yearCollected_diseaseDetected_Both.json`)
  const data = await response.json()

  let yearCollected = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    yearCollected.push(entry.yearCollected)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { yearCollected, trueValue, falseValue }
}

// CHART
async function bothDetectedByYear() {
  let data = await bothDetectedByYearData()
makeStackedBarChart(data.yearCollected, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH
async function bdDetectedByGenusData() {
  const response = await fetch(`${baseURL}genus_diseaseDetected_Bd.json`)
  const data = await response.json()

  let genus = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    genus.push(entry.genus)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { genus, trueValue, falseValue }
}

// CHART
async function bdDetectedByGenus() {
  let data = await bdDetectedByGenusData()
makeStackedBarChart(data.genus, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH
async function bsalDetectedByGenusData() {
  const response = await fetch(`${baseURL}genus_diseaseDetected_Bsal.json`)
  const data = await response.json()

  let genus = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    genus.push(entry.genus)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { genus, trueValue, falseValue }
}

// CHART
async function bsalDetectedByGenus() {
  let data = await bsalDetectedByGenusData()
makeStackedBarChart(data.genus, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH
async function bothDetectedByGenusData() {
  const response = await fetch(`${baseURL}genus_diseaseDetected_Both.json`)
  const data = await response.json()

  let genus = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    genus.push(entry.genus)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { genus, trueValue, falseValue }
}

// CHART
async function bothDetectedByGenus() {
  let data = await bothDetectedByGenusData()
makeStackedBarChart(data.genus, 'Positive', data.trueValue, posColor, 'Negative', data.falseValue, negColor)
}

// FETCH
async function getBdGenusData() {
  const response = await fetch(`${baseURL}genus_Bd.json`)
  const data = await response.json()

  let genus = []
  let value = []

  data.forEach(entry => {
    genus.push(entry.genus)
    value.push(entry.value)
  })

  return { genus, value }
}

// CHART
async function bdGenus() {
  let data = await getBdGenusData()
makeBarChart(data.genus, 'Bd By Genus', data.value, bdColor)
}

// FETCH
async function getBsalGenusData() {
  const response = await fetch(`${baseURL}genus_Bsal.json`)
  const data = await response.json()

  let genus = []
  let value = []

  data.forEach(entry => {
    genus.push(entry.genus)
    value.push(entry.value)
  })

  return { genus, value }
}

// CHART
async function bsalGenus() {
  let data = await getBsalGenusData()
  makeBarChart(data.genus, 'Bsal By Genus', data.value, bsalColor)
}

// FETCH
async function getBothGenusData() {
  const response = await fetch(`${baseURL}genus_Both.json`)
  const data = await response.json()

  let genus = []
  let value = []

  data.forEach(entry => {
    genus.push(entry.genus)
    value.push(entry.value)
  })

  return { genus, value }
}
 
// CHART
async function bothGenus() {
  let data = await getBothGenusData()
  makeBarChart(data.genus, 'Both By Genus', data.value, genericColor)
}

// FETCH
async function getBothStackedGenusData() {
  const response = await fetch(`${baseURL}genus_Both_stacked.json`)
  const data = await response.json()

  let genus = []
  let bdValue = []
  let bsalValue = []

  data.forEach(entry => {
    genus.push(entry.genus)
    bdValue.push(entry.Bd)
    bsalValue.push(entry.Bsal)
  })

  return { genus, bdValue, bsalValue }
}
// CHART
async function bothStackedGenus() {
  let data = await getBothStackedGenusData()
makeStackedBarChart(data.genus, 'Bd', data.bdValue, bdColor, 'Bsal', data.bsalValue, bsalColor)
  
}

//Fetch Disease Tested Data
async function getDiseaseTestedBothData() {
  const response = await fetch(`${baseURL}diseaseTested_Both.json`)
  const data = await response.json()

  let obj = []

  data.forEach(entry => {
    obj.push(entry)
  })
  return { obj }
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
  makeStackedBarChart(data.country, 'Both Positive', data.trueCount, posColor, 'Both Negative', data.falseCount, negColor)
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
  makeStackedBarChart(data.country, 'Bsal Positive', data.trueCount, posColor, 'Bsal Negative', data.falseCount, negColor)
}

// Bd Detected by country
async function getBdDetectedByCountryData() {
  const response = await fetch(`${baseURL}country_diseaseDetected_Bd.json`)
  const data = await response.json()
  
  let country = []
  let trueCount = []
  let falseCount = []
  let countryObj = []

  data.forEach(entry => {
    countryObj.push(entry)
    country.push(entry.country)
    trueCount.push(entry.True)
    falseCount.push(entry.False)
  })
  return { country, trueCount, falseCount, countryObj }
}

// Stacked Bd by Country Bar Chart
async function bdDetectedByCountry() {
  let data = await getBdDetectedByCountryData()
  makeStackedBarChart(data.country, 'Bd Positive', data.trueCount, posColor, 'Bd Negative', data.falseCount, negColor)
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

// Fetch Bd Detected Data
async function getBdDetectedData() {
  const response = await fetch(`${baseURL}diseaseDetected_Bd.json`)
  const data = await response.json()

  let bdResultObj = []

  data.forEach(entry => {
    bdResultObj.push(entry)
  })
  return { bdResultObj }
}


// Get totals together for both pathogens
async function getDataBothPathogens() {
  const response = await fetch(`${baseURL}country_Both.json`)
  const data = await response.json()

  let country = []
  let totalSamples = []
  let countryAndValue = []

  data.forEach(event => {
    countryAndValue.push(event)
    country.push(event.country)
    totalSamples.push(event.value)
  })
  return { country, totalSamples, countryAndValue }
  
}

async function bothPathogens() {
  let data = await getDataBothPathogens()
  makeBarChart(data.country, 'Total Bd and Bsal Samples Collected By Country', data.totalSamples, genericColor)
}


  // Function for making a generic Stacked bar chart
  function makeStackedBarChart(xLabel, valueLabelOne, valuesOne, colorOne, valueLabelTwo, valuesTwo, colorTwo) {
    let chartContainer = document.getElementById('chart-container')
    let element = document.getElementById('dashboardChart');
    chartContainer.removeChild(element)

    let canvas = document.createElement('canvas')
    canvas.id = 'dashboardChart'
    canvas.width = '1000px'
    canvas.height = '600px'
    chartContainer.appendChild(canvas)
    let ctx = document.getElementById('dashboardChart').getContext('2d');
  
    let dataChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: xLabel,
        datasets: [
          {
            label: valueLabelOne,
            data: valuesOne,
            backgroundColor: colorOne,
          },
          {
            label: valueLabelTwo,
            data: valuesTwo,
            backgroundColor: colorTwo,
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

    canvas.addEventListener('click', function(event) {
      let firstPoint = dataChart.getElementAtEvent(event)[0]
      if (firstPoint) {
        let label = dataChart.data.labels[firstPoint._index];
        let value = dataChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    
        console.log('Label: ' + label + "\nValue: " + value);
        displayDataModal(label, value)
      }
    })
  }
  
  // Function for making a generic bar chart
  function makeBarChart(xLabel, dataLabel, values, color) {
    let chartContainer = document.getElementById('chart-container')
    let element = document.getElementById('dashboardChart');
    element.parentNode.removeChild(element)

    let canvas = document.createElement('canvas')
    canvas.id = 'dashboardChart'
    canvas.width = '1000px'
    canvas.height = '600px'
    chartContainer.appendChild(canvas)
    let ctx = document.getElementById('dashboardChart').getContext('2d');
  
     let barChart = new Chart(ctx, {
      type: 'bar',
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
            backgroundColor: color
          }
        ]
      }
    });

    canvas.addEventListener('click', function(event) {
      let firstPoint = barChart.getElementAtEvent(event)[0]
      if (firstPoint) {
        let label = barChart.data.labels[firstPoint._index];
        let value = barChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    
        console.log('Label: ' + label + "\nValue: " + value);
      }
    })
  
  }
  
  // Function for making a generic pie chart
  function makePieChart(chartLabel, dataLabel, values) {
    let chartContainer = document.getElementById('chart-container')

    // Removes the previously existing canvas
    let element = document.getElementById('dashboardChart');
    element.parentNode.removeChild(element)

    // Creates a new canvas
    let canvas = document.createElement('canvas')
    canvas.id = 'dashboardChart'
    canvas.width = '1000px'
    canvas.height = '600px'
    chartContainer.appendChild(canvas)

    let ctx = document.getElementById('dashboardChart').getContext('2d');
      
     let pieChart = new Chart(ctx, {
      type: 'pie',
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
            backgroundColor: ['#b3cde3', '#fbb4ae']
          }
        ]
      }
    });
  }

  function toggleTableButton() {
    let div = document.getElementById('topten-data-table-container')
    if (div.style.display === 'none') {
      div.style.display = 'flex'
    } else {
      div.style.display = 'none'
    }
  }

  function displayDataModal(label, datavalue) {
    let modal = document.getElementById('modal-container')
    let span = document.getElementsByClassName('close')[0]

    if (modal.style.display === 'none') {
      modal.style.display = 'block'
    }

    span.onclick = function() {
      modal.style.display = 'none'
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none'
      }
    }

    let modalChartContainer = document.getElementById('modal-chart-container')

    let canvas = document.createElement('canvas')
    canvas.id = 'modalChart'
    canvas.width = '500px'
    canvas.height = '300px'
    modalChartContainer.appendChild(canvas)
  
    let ctx = document.getElementById('modalChart').getContext('2d')
    let chart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: [label],
              datasets: [{
                  // label: 'Random Fake Data Set',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: [datavalue]
              }]
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: true
            }
          }
      });

  }
