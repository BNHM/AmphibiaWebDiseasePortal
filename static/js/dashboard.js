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
        <td><a href='https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}' target='_blank'>${entry.scientificName} <i class="fa fa-external-link"></i></a></td>
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

//LIST TAB

// Builds List of species sampled by Scientific Name & organize alphabetically
async function buildTaxonomyList() {
  const data = await getBothScientificNameStackedData()
  let names = data.scientificName

  names.forEach(name => {
    let li = document.createElement('li')

    let arr = name.split(' ')
    let genus = arr[0]
    let species = arr[1]

    let aNames = document.querySelector('#sort-a ul')
    let bNames = document.querySelector('#sort-b ul')
    let cNames = document.querySelector('#sort-c ul')
    let dNames = document.querySelector('#sort-d ul')
    let eNames = document.querySelector('#sort-e ul')
    let fNames = document.querySelector('#sort-f ul')
    let gNames = document.querySelector('#sort-g ul')
    let hNames = document.querySelector('#sort-h ul')
    let iNames = document.querySelector('#sort-i ul')
    let jNames = document.querySelector('#sort-j ul')
    let kNames = document.querySelector('#sort-k ul')
    let lNames = document.querySelector('#sort-l ul')
    let mNames = document.querySelector('#sort-m ul')
    let nNames = document.querySelector('#sort-n ul')
    let oNames = document.querySelector('#sort-o ul')
    let pNames = document.querySelector('#sort-p ul')
    let qNames = document.querySelector('#sort-q ul')
    let rNames = document.querySelector('#sort-r ul')
    let sNames = document.querySelector('#sort-s ul')
    let tNames = document.querySelector('#sort-t ul')
    let uNames = document.querySelector('#sort-u ul')
    let vNames = document.querySelector('#sort-v ul')
    let wNames = document.querySelector('#sort-w ul')
    let xNames = document.querySelector('#sort-x ul')
    let yNames = document.querySelector('#sort-y ul')
    let zNames = document.querySelector('#sort-z ul')

    if (name.startsWith('A') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
        `
      aNames.appendChild(li)
    } else if (name.startsWith('B') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      bNames.appendChild(li)
    } else if (name.startsWith('C') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      cNames.appendChild(li)
    } else if (name.startsWith('D') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      dNames.appendChild(li)
    } else if (name.startsWith('E') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      eNames.appendChild(li)
    } else if (name.startsWith('F') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      fNames.appendChild(li)
    } else if (name.startsWith('G') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      gNames.appendChild(li)
    } else if (name.startsWith('H') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      hNames.appendChild(li)
    } else if (name.startsWith('I') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      iNames.appendChild(li)
    } else if (name.startsWith('J') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      jNames.appendChild(li)
    } else if (name.startsWith('K') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      kNames.appendChild(li)
    } else if (name.startsWith('L') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      lNames.appendChild(li)
    }else if (name.startsWith('M') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      mNames.appendChild(li)
    } else if (name.startsWith('N') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      nNames.appendChild(li)
    } else if (name.startsWith('O') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      oNames.appendChild(li)
    }else if (name.startsWith('P') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      pNames.appendChild(li)
    } else if (name.startsWith('Q') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      qNames.appendChild(li)
    } else if (name.startsWith('R') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      rNames.appendChild(li)
    } else if (name.startsWith('S') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      sNames.appendChild(li)
    } else if (name.startsWith('T') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      tNames.appendChild(li)
    } else if (name.startsWith('U') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      uNames.appendChild(li)
    } else if (name.startsWith('V') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      vNames.appendChild(li)
    } else if (name.startsWith('W') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      wNames.appendChild(li)
    } else if (name.startsWith('X') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      xNames.appendChild(li)
    } else if (name.startsWith('Y') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      yNames.appendChild(li)
    } else if (name.startsWith('Z') === true) {
      li.innerHTML = `
        ${name} <a href="https://amphibiaweb.org/cgi/amphib_query?where-genus=${genus}&where-species=${species}" target="_blank">View in AmphibiaWeb <i class="fa fa-external-link"></i></a>
      `
      zNames.appendChild(li)
    }

  })
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
    yearCollected.push(entry.yearCollected)
    trueValue.push(entry.True)
    falseValue.push(entry.False)
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
makeStackedBarChart(data.genus, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
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
makeStackedBarChart(data.genus, 'Negative', data.falseValue, negColor, 'Positive', data.trueValue, posColor)
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

async function bothPathogens() {
  let data = await getDataBothPathogens()
  makeBarChart(data.country, 'Total Bd and Bsal Samples Collected By Country', data.totalSamples, genericColor)
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

    canvas.addEventListener('click', function(event) {
      let firstPoint = barChart.getElementAtEvent(event)[0]
      if (firstPoint) {
        let label = barChart.data.labels[firstPoint._index];
        // let value = barChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
        
        bsalObj.forEach(entry => {
          if (label == entry.scientificName) {
            let modalTitle = document.getElementById('insert-label')
            modalTitle.innerHTML = `${label}`

            displayDataModal('Bsal Detected', 'Bsal Not Detected', entry.True, entry.False)
          }
        })

        bdObj.forEach(entry => {
          if (label == entry.scientificName) {
            // console.log(label)
            // console.log(entry)

            let modalTitle = document.getElementById('insert-label')
            modalTitle.innerHTML = `${label}`

            displayDataModal('Bd Detected', 'Bd Not Detected', entry.True, entry.False)
          }
        })

        // console.log('Label: ' + label + "\nValue: " + value);
      }
    })
  
  }

  // MODAL WITH PIE CHART
  function displayDataModal(dataLabel, dataLabelTwo, valuesOne, valuesTwo) {
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
              labels: [dataLabel, dataLabelTwo],
              datasets: [{
                  backgroundColor: [posColor, negColor],
                  data: [valuesOne, valuesTwo]
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

// LIST SCROLL TO TOP 
const scrollToTop = () => {
  // variable for the number of pixels we are from the top of the document.
  const c = document.documentElement.scrollTop || document.body.scrollTop;
   
  // If that number is greater than 0, we'll scroll back to 0, or the top of the document.
  // We'll also animate that scroll with requestAnimationFrame:
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    // ScrollTo takes an x and a y coordinate.
    // Increase the '10' value to get a smoother/slower scroll
    window.scrollTo(0, c - c / 15);
  }
};

  // // GENERIC PIE CHART SAVE FOR REFERENCE
  // function makePieChart(chartLabel, dataLabel, values) {
  //   let chartContainer = document.getElementById('chart-container')

  //   // Removes the previously existing canvas
  //   let element = document.getElementById('dashboardChart');
  //   element.parentNode.removeChild(element)

  //   // Creates a new canvas
  //   let canvas = document.createElement('canvas')
  //   canvas.id = 'dashboardChart'
  //   canvas.width = '1000px'
  //   canvas.height = '600px'
  //   chartContainer.appendChild(canvas)

  //   let ctx = document.getElementById('dashboardChart').getContext('2d');
      
  //    let pieChart = new Chart(ctx, {
  //     type: 'pie',
  //     options: {
  //       maintainAspectRatio: false,
  //       legend: {
  //         display: true
  //       }
  //     },
  //     data: {
  //       labels: chartLabel,
  //       datasets: [
  //         {
  //           label: dataLabel,
  //           data: values,
  //           backgroundColor: ['#b3cde3', '#fbb4ae']
  //         }
  //       ]
  //     }
  //   });
  // }
