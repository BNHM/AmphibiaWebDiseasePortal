const baseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'

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

class Dashboard{
  constructor() {
    let mychart = this;
    buildSummaryTable()
    buildSpeciesTable()
    buildCountryTable()
    buildPathogenSummaryTable()
    buildTaxonomyList()

    const resultSelect = document.getElementById('result-select')
    const byYearSelect = document.getElementById('by-year-select')
    const speciesSelect = document.getElementById('by-species-select')
   
    resultSelect.addEventListener('change', function() {
      byYearSelect.value = ''
      speciesSelect.value = ''

     if (this.value == 'bdDetectedByCountry') {
        bdDetectedByCountry()
      } else if (this.value == 'bsalDetectedByCountry') {
        bsalDetectedByCountry()
      } else if (this.value == 'bdDetectedByGenus') {
        bdDetectedByGenus()
      } else if (this.value == 'bsalDetectedByGenus') {
        bsalDetectedByGenus()
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
      } else if (this.value == 'bothGenusStacked') {
        bothStackedGenus()
      } else if (this.value == 'bdScientificName') {
        bdScientificName()
      } else if (this.value == 'bsalScientificName') {
        bsalScientificName()
      } else if (this.value == 'bothScientificNameStacked') {
        bothScientificNameStacked()
      }
    })
  }
}

// TABLES TAB

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

    let arr = entry.scientificName.split(' ')
    let genus = arr[0]
    let species = arr[1]

      tr.innerHTML = `
        <td><a href='/dashboard/?id=${genus}+${species}'>${entry.scientificName}</a>
        </td>
        <td>${entry.value} </td>
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


async function buildPathogenSummaryTable() {
  const bothTestedData = await getDiseaseTestedBothData()
  const bdData = await getBdDetectedData()
  const bsalData = await getBsalDetectedData()
  const bothDetectedData = await getBothDetectedData()

 let diseaseTested = bothTestedData.diseaseTested
 let testedValue = bothTestedData.testedValue
 let bdDetectedValue = bdData.resultValueBd
 let bsalDetectedValue = bsalData.detectedValue
 let bothDetectedValue = bothDetectedData.detectedValue

 let checkBsalCounts = bsalDetectedValue[1] === undefined ? 0 : bsalDetectedValue[1]

 let table = document.getElementById('pathogen-summary-table')
 let trOne = document.createElement('tr')  
 let trTwo = document.createElement('tr')
 let trThree = document.createElement('tr')

 trOne.innerHTML = `
 <td>${diseaseTested[0]}</td>
 <td>${testedValue[0]}</td>
 <td>${bdDetectedValue[1]}</td>
 <td>${bdDetectedValue[0]}</td>
 `
 
 trTwo.innerHTML = `
 <td>${diseaseTested[1]}</td>
 <td>${testedValue[1]}</td>
 <td>${checkBsalCounts}</td>
 <td>${bsalDetectedValue}</td>
 `

 trThree.innerHTML = `
 <td>Both</td>
 <td>${bothDetectedValue[0] + bothDetectedValue[1]}</td>
 <td>${bothDetectedValue[1]}</td>
 <td>${bothDetectedValue[0]}</td>
 `
table.appendChild(trOne)
table.appendChild(trTwo)
table.appendChild(trThree)
}

async function buildSummaryTable() {
  const countryData = await getDataBothPathogens()
  const speciesData = await getBothScientificNameData()

  const summaryTable = document.getElementById('summary-data-table')
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

//CHARTS TAB

//FETCH Bd Detected by Scientific Name
async function getBdDetectedByScientificName() {
  const response = await fetch(`${baseURL}scientificName_diseaseDetected_Bd.json`)
  const data = await response.json()

  let scientificName = []
  let trueValue = []
  let falseValue = []
  let bdObj = []

  data.forEach(entry => {
    bdObj.push(entry)
  })

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.True) - parseFloat(a.True) || parseFloat(b.False) - parseFloat(a.False)
  })

  sortedDescending.forEach(entry => {
    scientificName.push(entry.scientificName)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { scientificName, trueValue, falseValue, bdObj }
}
// CHART Display Bd Detected By Scientific Name
async function bdDetectedByScientificName() {
  let data = await getBdDetectedByScientificName()
  makeStackedBarChart(data.scientificName, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
}

//FETCH Bsal Detected by Scientific Name
async function getBsalDetectedByScientificName() {
  const response = await fetch(`${baseURL}scientificName_diseaseDetected_Bsal.json`)
  const data = await response.json()

  let scientificName = []
  let trueValue = []
  let falseValue = []
  let bsalObj = []

  data.forEach(entry => {
    bsalObj.push(entry)
  })

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.True) - parseFloat(a.True) || parseFloat(b.False) - parseFloat(a.False)
  })

  sortedDescending.forEach(entry => {
    scientificName.push(entry.scientificName)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })
  return { scientificName, trueValue, falseValue, bsalObj }

}

// CHART Display Bsal Detected By Scientific Name
async function bsalDetectedByScientificName() {
  let data = await getBsalDetectedByScientificName()
  makeStackedBarChart(data.scientificName, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
}


// FETCH
async function getBdScientificNameData() {
  const response = await fetch(`${baseURL}scientificName_Bd.json`)
  const data = await response.json()

  let scientificName = []
  let value = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.value) - parseFloat(a.value)
  })

  sortedDescending.forEach(entry => {
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

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.value) - parseFloat(a.value)
  })

  sortedDescending.forEach(entry => {
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

// FETCH
async function getBothScientificNameStackedData() {
  const response = await fetch(`${baseURL}scientificName_Both_stacked.json`)
  const data = await response.json()

  let scientificName = []
  let bdValue = []
  let bsalValue = []
  let stackedObj = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.Bd) - parseFloat(a.Bd) || parseFloat(b.Bsal) - parseFloat(a.Bsal)
  })

  sortedDescending.forEach(entry => {
    scientificName.push(entry.scientificName)
    bdValue.push(entry.Bd)
    bsalValue.push(entry.Bsal)
    stackedObj.push(entry)
  })

  return { scientificName, bdValue, bsalValue, stackedObj }
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
    if (!entry.yearCollected.includes('unknown')) {
      yearCollected.push(entry.yearCollected)
      trueValue.push(entry.True)
      falseValue.push(entry.False)
    } 
  })

  return { yearCollected, trueValue, falseValue }
}

// CHART
async function bdDetectedByYear() {
  let data = await bdDetectedByYearData()
makeStackedBarChart(data.yearCollected, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
}

// FETCH
async function bsalDetectedByYearData() {
  const response = await fetch(`${baseURL}yearCollected_diseaseDetected_Bsal.json`)
  const data = await response.json()

  let yearCollected = []
  let trueValue = []
  let falseValue = []

  data.forEach(entry => {
    if (!entry.yearCollected.includes('unknown')) {
    yearCollected.push(entry.yearCollected)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
    }
  })

  return { yearCollected, trueValue, falseValue }
}

// CHART
async function bsalDetectedByYear() {
  let data = await bsalDetectedByYearData()
makeStackedBarChart(data.yearCollected, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
}

// FETCH
async function bdDetectedByGenusData() {
  const response = await fetch(`${baseURL}genus_diseaseDetected_Bd.json`)
  const data = await response.json()

  let genus = []
  let trueValue = []
  let falseValue = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.True) - parseFloat(a.True) || parseFloat(b.False) - parseFloat(a.False)
  })

  sortedDescending.forEach(entry => {
    genus.push(entry.genus)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { genus, trueValue, falseValue }
}

// CHART
async function bdDetectedByGenus() {
  let data = await bdDetectedByGenusData()
makeStackedBarChart(data.genus, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
}

// FETCH
async function bsalDetectedByGenusData() {
  const response = await fetch(`${baseURL}genus_diseaseDetected_Bsal.json`)
  const data = await response.json()

  let genus = []
  let trueValue = []
  let falseValue = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.True) - parseFloat(a.True) || parseFloat(b.False) - parseFloat(a.False)
  })

  sortedDescending.forEach(entry => {
    genus.push(entry.genus)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
  })

  return { genus, trueValue, falseValue }
}

// CHART
async function bsalDetectedByGenus() {
  let data = await bsalDetectedByGenusData()
makeStackedBarChart(data.genus, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
}

// FETCH
async function getBdGenusData() {
  const response = await fetch(`${baseURL}genus_Bd.json`)
  const data = await response.json()

  let genus = []
  let value = []

  let sortedDescending = data.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value)
  })

  sortedDescending.forEach(entry => {
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

  let sortedDescending = data.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value)
  })

  sortedDescending.forEach(entry => {
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
async function getBothStackedGenusData() {
  const response = await fetch(`${baseURL}genus_Both_stacked.json`)
  const data = await response.json()

  let genus = []
  let bdValue = []
  let bsalValue = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.Bd) - parseFloat(a.Bd) || parseFloat(b.Bsal) - parseFloat(a.Bsal)
  })

  sortedDescending.forEach(entry => {
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

  let diseaseTested = []
  let testedValue = []

  data.forEach(entry => {
    diseaseTested.push(entry.diseaseTested)
    testedValue.push(entry.value)
  })
  return { diseaseTested, testedValue }
}

// Bsal Detected by country
async function getBsalDetectedByCountryData() {
  const response = await fetch(`${baseURL}country_diseaseDetected_Bsal.json`)
  const data = await response.json()
  
  let country = []
  let trueCount = []
  let falseCount = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.True) - parseFloat(a.True) || parseFloat(b.False) - parseFloat(a.False)
  })

  sortedDescending.forEach(entry => {
    country.push(entry.country)
    trueCount.push(entry.True)
    falseCount.push(entry.False)
  })
  return { country, trueCount, falseCount }
}

// Stacked Bsal by Country Bar Chart
async function bsalDetectedByCountry() {
  let data = await getBsalDetectedByCountryData()
  makeStackedBarChart(data.country, 'Bsal Negative', data.falseCount, negColor, 'Bsal Positive', data.trueCount, posColor)
}

// Bd Detected by country
async function getBdDetectedByCountryData() {
  const response = await fetch(`${baseURL}country_diseaseDetected_Bd.json`)
  const data = await response.json()
  
  let country = []
  let trueCount = []
  let falseCount = []
  let countryObj = []

  let sortedDescending = data.sort(function(a,b) {
    return parseFloat(b.True) - parseFloat(a.True) || parseFloat(b.False) - parseFloat(a.False)
  })

  sortedDescending.forEach(entry => {
    country.push(entry.country)
    trueCount.push(entry.True)
    falseCount.push(entry.False)
  })
  return { country, trueCount, falseCount, countryObj }
}

// Stacked Bd by Country Bar Chart
async function bdDetectedByCountry() {
  let data = await getBdDetectedByCountryData()
  makeStackedBarChart(data.country, 'Bd Negative', data.falseCount, negColor, 'Bd Positive', data.trueCount, posColor)
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
  let diseaseDetectedBd = []
  let resultValueBd = []

  data.forEach(entry => {
    bdResultObj.push(entry)
    diseaseDetectedBd.push(entry.diseaseDetected)
    resultValueBd.push(entry.value)
  })
  return { bdResultObj, diseaseDetectedBd, resultValueBd }
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

  // GENERIC STACKED BAR CHART
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
  }
  
  // GENERIC BAR CHART
  async function makeBarChart(xLabel, dataLabel, values, color) {
    let chartContainer = document.getElementById('chart-container')
    // Removed the previously existing canvas
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

    const bdData = await getBdDetectedByScientificName()
    const bsalData = await getBsalDetectedByScientificName()

    let bdObj = bdData.bdObj
    let bsalObj = bsalData.bsalObj

    // canvas.addEventListener('click', function(event) {
    //   let firstPoint = barChart.getElementAtEvent(event)[0]
    //   if (firstPoint) {
    //     let label = barChart.data.labels[firstPoint._index];
    //     // let value = barChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
        
    //     bsalObj.forEach(entry => {
    //       if (label == entry.scientificName) {
    //         let modalTitle = document.getElementById('insert-label')
    //         modalTitle.innerHTML = `${label}`

    //         displayDataModal('Bsal Detected', 'Bsal Not Detected', entry.True, entry.False)
    //       }
    //     })

    //     bdObj.forEach(entry => {
    //       if (label == entry.scientificName) {
    //         // console.log(label)
    //         // console.log(entry)

    //         let modalTitle = document.getElementById('insert-label')
    //         modalTitle.innerHTML = `${label}`

    //         displayDataModal('Bd Detected', 'Bd Not Detected', entry.True, entry.False)
    //       }
    //     })

    //     // console.log('Label: ' + label + "\nValue: " + value);
    //   }
    // })
  
  }

  // // MODAL WITH PIE CHART
  // function displayDataModal(dataLabel, dataLabelTwo, valuesOne, valuesTwo) {
  //   let modal = document.getElementById('modal-container')
  //   let span = document.getElementsByClassName('close')[0]

  //   if (modal.style.display === 'none') {
  //     modal.style.display = 'block'
  //   }

  //   span.onclick = function() {
  //     modal.style.display = 'none'
  //   }

  //   window.onclick = function(event) {
  //     if (event.target == modal) {
  //       modal.style.display = 'none'
  //     }
  //   }

  //   let modalChartContainer = document.getElementById('modal-chart-container')

  //   let canvas = document.createElement('canvas')
  //   canvas.id = 'modalChart'
  //   canvas.width = '500px'
  //   canvas.height = '300px'
  //   modalChartContainer.appendChild(canvas)
  
  //   let ctx = document.getElementById('modalChart').getContext('2d')
  //   let chart = new Chart(ctx, {
  //         type: 'pie',
  //         data: {
  //             labels: [dataLabel, dataLabelTwo],
  //             datasets: [{
  //                 backgroundColor: [posColor, negColor],
  //                 data: [valuesOne, valuesTwo]
  //             }]
  //         },
  //         options: {
  //           maintainAspectRatio: false,
  //           legend: {
  //             display: true
  //           }
  //         }
  //     });

  // }

  // TABS
function toggleData(evt, tabType) {
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabType).style.display = "block";
  evt.currentTarget.className += " active";
}

  //LIST TAB
  async function getSpeciesAssociatedProject() {
    const response = await fetch(`${baseURL}scientificName_listing.json`)
    const data = await response.json()

    let obj = []
    data.forEach(x => {
      obj.push(x)
    })
    return { obj }
  }

// Builds List of species sampled by Scientific Name & organize alphabetically
async function buildTaxonomyList() {
  const allStacked = await getBothScientificNameStackedData()
  const bdData = await getBdDetectedByScientificName()
  const bsalData = await getBsalDetectedByScientificName()
  const allData = await getBothScientificNameData()
  const projData = await getSpeciesAssociatedProject()
  const txtData = await getTxtData()
  
  let urlName = getUrlVars().id
  let bdObj = bdData.bdObj
  let bsalObj = bsalData.bsalObj
  let names = allData.scientificName
  let stackedData = allStacked.stackedObj
  let projects = projData.obj
  let txt = txtData.newArr

  // If there is no scientific name in URL, load entire list.
  if (urlName === undefined) {
    hideInfoDash()
    names.forEach(name => {
      let arr = name.split(' ')
      let genus = arr[0]
      let species = arr[1]
    
        const aNames = document.querySelector('#sort-a ul')
        const bNames = document.querySelector('#sort-b ul')
        const cNames = document.querySelector('#sort-c ul')
        const dNames = document.querySelector('#sort-d ul')
        const eNames = document.querySelector('#sort-e ul')
        const fNames = document.querySelector('#sort-f ul')
        const gNames = document.querySelector('#sort-g ul')
        const hNames = document.querySelector('#sort-h ul')
        const iNames = document.querySelector('#sort-i ul')
        const jNames = document.querySelector('#sort-j ul')
        const kNames = document.querySelector('#sort-k ul')
        const lNames = document.querySelector('#sort-l ul')
        const mNames = document.querySelector('#sort-m ul')
        const nNames = document.querySelector('#sort-n ul')
        const oNames = document.querySelector('#sort-o ul')
        const pNames = document.querySelector('#sort-p ul')
        const qNames = document.querySelector('#sort-q ul')
        const rNames = document.querySelector('#sort-r ul')
        const sNames = document.querySelector('#sort-s ul')
        const tNames = document.querySelector('#sort-t ul')
        const uNames = document.querySelector('#sort-u ul')
        const vNames = document.querySelector('#sort-v ul')
        const wNames = document.querySelector('#sort-w ul')
        const xNames = document.querySelector('#sort-x ul')
        const yNames = document.querySelector('#sort-y ul')
        const zNames = document.querySelector('#sort-z ul')
    
        listBuilder(name, 'A', aNames, genus, species)
        listBuilder(name, 'B', bNames, genus, species)
        listBuilder(name, 'C', cNames, genus, species)
        listBuilder(name, 'D', dNames, genus, species)
        listBuilder(name, 'E', eNames, genus, species)
        listBuilder(name, 'F', fNames, genus, species)
        listBuilder(name, 'G', gNames, genus, species)
        listBuilder(name, 'H', hNames, genus, species)
        listBuilder(name, 'I', iNames, genus, species)
        listBuilder(name, 'J', jNames, genus, species)
        listBuilder(name, 'K', kNames, genus, species)
        listBuilder(name, 'L', lNames, genus, species)
        listBuilder(name, 'M', mNames, genus, species)
        listBuilder(name, 'N', nNames, genus, species)
        listBuilder(name, 'O', oNames, genus, species)
        listBuilder(name, 'P', pNames, genus, species)
        listBuilder(name, 'Q', qNames, genus, species)
        listBuilder(name, 'R', rNames, genus, species)
        listBuilder(name, 'S', sNames, genus, species)
        listBuilder(name, 'T', tNames, genus, species)
        listBuilder(name, 'U', uNames, genus, species)
        listBuilder(name, 'V', vNames, genus, species)
        listBuilder(name, 'W', wNames, genus, species)
        listBuilder(name, 'X', xNames, genus, species)
        listBuilder(name, 'Y', yNames, genus, species)
        listBuilder(name, 'Z', zNames, genus, species)
      })
      // If there is a name in the URL, load stats for the name
    } else {
      hideAllTabs()
      const speciesDiv = document.getElementById('species-stats')
      const bdDiv = document.getElementById('bd-chart-container')
      const bsalDiv = document.getElementById('bsal-chart-container')
      const bsalCanvas = document.getElementById('bsal-chart')
      const bdCanvas = document.getElementById('bd-chart')
      const projectsUl = document.getElementById('associated-projects')

      let displayName = urlName.replace('+', ' ')
      let nameArr = displayName.split(' ')
      let genus = nameArr[0]
      let species = nameArr[1]
    
      let commonName = []
      // TO DO: Sort by order or family. having issues parsing the txt file
      txt.map(item => {
        console.log(item.order);
        
        if (item.species == species && item.genus == genus) {
          commonName.push(item.common_name)
        } else {
          return `No info found -- check AmphibiaWeb for more.`
        }
      })
      
      console.log(commonName);
      
      speciesDiv.innerHTML = `
      <p></p>
      <h3><em>${displayName}</em></h3>
      ${commonName} <br> 
 
      <button class="species-detail-btn" type="submit" onclick="location.href='https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}'">View in AmphibiaWeb</button>
      <button class="species-detail-btn" onclick="location.href='/dashboard'">Back to Dashboard</button>      
      `

      // For Associated Projects DIV
      let titles = []
      function returnTitle(id) {
        bigdatafile = JSON.parse(localStorage.getItem("bigdatafile")).value

        for (let i = 0; i < bigdatafile.length; i++) {
          let local = bigdatafile[i]

          if(local.projectId == id) {
            titles.push(local.projectTitle)
          }
        }
      }

      // Stores IDs of each associated project
      let idParam = []
      projects.map(x => {
        if(x.scientificName === displayName) {
          let projObj = x.associatedProjects

          projObj.forEach(y => {
            idParam.push(y.projectId)
          })
        }
       })

       // Uses the Ids to return titles and links associated with the ID
       let links = []
       idParam.forEach(num => {
        returnTitle(num)
        links.push(`/projects/?id=${num}`)
       })

       // Combines ID, title and Link into new arrays
       let mixed = idParam.map(function(x, i) {
         return [x, titles[i], links[i]]
       })

       mixed.forEach(item => {
        let li = document.createElement('li')
        li.className = 'li-detail'
        li.innerHTML = `<td><a href="${item[2]}">${item[1]}</a></td>`

        projectsUl.appendChild(li)
       })
      
      // Totals div for displaying bd/bsal tested
      stackedData.forEach(x => {
        if(x.scientificName === displayName) {
          makePieChart('totals-chart-container', 'both-chart', 'Bd', 'Bsal', x.Bd, x.Bsal, bdColor, bsalColor)
        }        
      })
      
      // Checks for and displays Bd data
     let checkBd = () => bdObj.map(x => {
        if(x.scientificName === displayName) {
          makePieChart('bd-chart-container', 'bd-chart', 'Bd Positive', 'Bd Negative', x.True, x.False, posColor, negColor)
        } else {
          return false
        }
      })

      // Janky fix for displaying 'No Data available'
      if (!checkBd().includes(undefined)) {
        bdCanvas.style.display = 'none'
        let p = document.createElement('p')
        p.className = 'detail-p'
        p.innerHTML = `No Bd data available for ${displayName}`
        bdDiv.appendChild(p)
      }
      
      // Checks for and displays Bsal Data
      let checkBsal = () => bsalObj.map(x => {
        if (x.scientificName === displayName) {  
          makePieChart('bsal-chart-container', 'bsal-chart', 'Bsal Positive', 'Bsal Negative', x.True, x.False, posColor, negColor)
        } else {          
          return false
        }
      })

      if (!checkBsal().includes(undefined)) {
        bsalCanvas.style.display = 'none'
        let p = document.createElement('p')
        p.className = 'detail-p'
        p.innerHTML = `No Bsal data available for ${displayName}`
        bsalDiv.appendChild(p)
      }

    }
}

// AmphibiaWeb txt file
async function getTxtData() {
  const res = await fetch('https://amphibiaweb.org/amphib_names.txt')
  const data = await res.text()

  let parsed = Papa.parse(data)
  let arrays = parsed.data

  let categories = parsed.data[0] 
  let newArr = []

  arrays.forEach(arr => {
    let result = arr.reduce(function(result, field, index) {
      result[categories[index]] = field
      return result
    }, {})
    newArr.push(result)

  })
  newArr.shift()
  return { newArr }
}

// GENERIC PIE CHART
function makePieChart(containerId, canvasId, labelOne, labelTwo, valuesOne, valuesTwo, colorOne, colorTwo) {
  const container = document.getElementById(containerId)

  let canvas = document.createElement('canvas')
  canvas.id = canvasId
  canvas.width = '300px'
  canvas.height = '300px'
  container.appendChild(canvas)

  let ctx = document.getElementById(canvasId).getContext('2d')
  return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [labelOne, labelTwo],
            datasets: [{
                backgroundColor: [colorOne, colorTwo],
                data: [valuesOne, valuesTwo]
            }]
        },
        options: {
          maintainAspectRatio: true,
          legend: {
            display: true
          },
          tooltips: {
            bodyFontSize: 12
          }
        }
    });
}

function hideAllTabs() {
  let p = document.getElementById('description')
  let tabNav = document.getElementById('tab-nav')
  let tableTab = document.getElementById('table-tab')
  let chartTab = document.getElementById('chart-tab')
  let listTab = document.getElementById('list-tab')

  p.style.display = 'none'
  tabNav.style.display = 'none'
  tableTab.style.display = 'none'
  chartTab.style.display = 'none'
  listTab.style.display = 'none'
}

function hideInfoDash() {
  const dash = document.getElementById('info-dash')
  dash.style.display = 'none'
}

function listBuilder(name, str, selector, genus, species) {
  let li = document.createElement('li')
  if (name.startsWith(str) === true) {
    li.innerHTML = `
      <span>${name}</span>
      <button class="species-btn" type="submit" onclick="location.href='https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}'">View in AmphibiaWeb</button>
      <button id="${name}" class="species-btn">Portal Stats</button>
      <div class="clear"></div>
      `
    selector.appendChild(li)

    document.getElementById(`${name}`).addEventListener('click', function() {
      window.location.href = `/dashboard/?id=${genus}+${species}`
    })
  }
}

// LIST SCROLL TO TOP 
const scrollToTop = () => {
  // number of pixels we are from the top of the document.
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  // If that number is greater than 0 - scroll back to 0, or the top of the document.
  // Animate scroll
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    // ScrollTo takes an x and a y coordinate.
    // Increase the '10' value to get a smoother/slower scroll
    window.scrollTo(0, c - c / 15);
  }
};

  // Get url variable
  function getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }