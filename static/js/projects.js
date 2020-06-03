// Base URL for fetching all projects from GEOME
const baseURL = 'https://api.geome-db.org/projects/stats?'

// Initialize local storage variable
let bigdatafile

// API URL
const apiBaseURL = 'https://raw.githubusercontent.com/BNHM/AmphibiaWebDiseasePortalAPI/master/data/'

function byProjectId(id) {
  fetch(`${apiBaseURL}scientificName_projectId_${id}.json`)
  .then(res => res.json())
  .then(function(data) {

    let scientificName = []
    let value = []
    
    data.forEach(entry => {
      scientificName.push(entry.scientificName)
      value.push(entry.value)
    })
    return makeBarChart(scientificName, 'Samples Collected', value)
  })
}

// Recovers link from the fetch using the project id, creates an anchor for it and clicks it.
function downloadDataFile(id) {
  fetch (`https://api.geome-db.org/records/Sample/excel?networkId=1&q=_projects_:${id}`)
  .then(res => res.json())
  .then(function(data) {
    let a = document.createElement('a')
    let downloadLink = data.url
    a.href = downloadLink
    console.log(downloadLink)
    console.log(a)
    a.click()
  })
  .catch(err => {
    alert('something went wrong '+ err)
  })
}

// Uses Regex to find partial matches 
function findMatches(wordToMatch, projectData) {

  return projectData.filter(project => {
    // Global insensitive
    const regex = new RegExp(wordToMatch, 'gi')
    // Amphibian Disease Team ID is 45, only searches public projects.
    if(project.projectConfiguration.id == 45 && project.public == true) {
      // Checks to see which radio button is selected to do the search
      const radioPI = document.getElementById('rad-proj-pi').checked
      const radioName = document.getElementById('rad-proj-name').checked
      const radioAffiliation = document.getElementById('rad-proj-affiliation').checked
      
      //TODO: Needs handling if PI and affiliation are null but there is a title

      // Checks for which radio button is selected, if PI or Affiliation is null, excludes from search
      if (radioPI == true && radioName == false && radioAffiliation == false && project.principalInvestigator != null) {
          return project.principalInvestigator.match(regex)
      } if (radioName == true && radioPI == false && radioAffiliation == false) {
        return project.projectTitle.match(regex)
      } if (radioAffiliation == true && radioPI == false && radioName == false && project.principalInvestigatorAffiliation != null) {
        return project.principalInvestigatorAffiliation.match(regex)
      }
    }
  })
}

// Displays Search Results in a table
function displayMatches() {
  let allProjTable = document.getElementById('projects-display')
  let tr = document.createElement('tr') // Table row

  bigdatafile = JSON.parse(localStorage.getItem("bigdatafile"))

  const matchArray = findMatches(this.value, bigdatafile.value)

  const html = matchArray.map(project => {
      const regex = new RegExp(this.value, 'gi')
      const projName = project.projectTitle == null ? 'None Found' : project.projectTitle.replace(regex, `<span class="hl">${this.value}</span>`);
      const projPI = project.principalInvestigator == null ? 'None Found': project.principalInvestigator.replace(regex, `<span class="hl">${this.value}</span>`)
      const projAffiliation = project.principalInvestigatorAffiliation == null ? 'None Found' : project.principalInvestigatorAffiliation.replace(regex, `<span class="hl">${this.value}</span>`)


      return tr.innerHTML = `
      <tr>
      <td> <i id="pubglobe" class="fa fa-globe"></i> </td>
      <td> ${projName} </td>
      <td> ${projPI} </td>
      <td> ${projAffiliation} </td>
      <td><button onclick="window.location.href = '/projects/?id=${project.projectId}'" class="detailsBtn" 
          id='project${project.projectId}'
          >Details</button></td>
          </tr>
      `
    
  }).join('')
  allProjTable.appendChild(tr)
  allProjTable.innerHTML = html
  } 
  
  // FETCH ALL PROJECT DATA AND STORE LOCALLY WITH EXPIRY
  function fetchProjectsStoreLocally() {

    fetch(baseURL)
    .then((res) => res.json())
    .then(data => {
      showLoader()
      // Setting local storage to expire in 24 hrs (approx)
      // Could be more precise but I don't think it really matters here 
      // as long as the data is refreshed about once a day.
      let oneDay = 1000 * 60 * 60 * 24
      bigdatafile = data
      setWithExpiry('bigdatafile', bigdatafile, oneDay)
      getWithExpiry(bigdatafile)
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
        hideLoader()
        displayProjects()
    })
  }

  function checkLocalStorage() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(bigdatafile) === null) {
        resolve(fetchProjectsStoreLocally())
      } else {
        reject('An error occured')
      }
    })
    }

  checkLocalStorage()


// Displays the data in a table.
function displayProjects() {
  let projectId = getUrlVars().id
  
  // If no project id is defined display project table using local storage
  if (projectId === undefined) { 
    hideDetailTable()

    const searchInput = document.querySelector('.search')

    searchInput.addEventListener('change', displayMatches)
    searchInput.addEventListener('keyup', displayMatches)

    bigdatafile = JSON.parse(localStorage.getItem("bigdatafile")).value

    return bigdatafile.forEach(function(project) {
      // 45 is the Amphibian Disease Portal TEAM configuration ID.
      if(project.projectConfiguration.id == 45 && project.public == true) {

        let allProjTable = document.getElementById('projects-display')
        let tr = document.createElement('tr') // Table row

              tr.innerHTML = `
                <td> <i id="pubglobe" class="fa fa-globe"></i> </td>
                <td> ${project.projectTitle} </td>
                <td> ${project.principalInvestigator == null ? 'None Listed' : project.principalInvestigator} </td>
                <td> ${project.principalInvestigatorAffiliation == null ? 'None Listed' : project.principalInvestigatorAffiliation} </td>
                <td><button class="detailsBtn" data-id='${project.projectId}' 
                    id='project${project.projectId}'
                    >Details</button></td>
                `
              allProjTable.appendChild(tr)
              document.getElementById(`project${project.projectId}`).addEventListener('click', function() {
                window.location.href = `/projects/?id=${project.projectId}`
                // console.log(`This button's ID: ${project.projectId}`)
              })
      }
    })

  } else {
    bigdatafile = JSON.parse(localStorage.getItem("bigdatafile")).value
    hideMainTable()

    // Loops through the objects in localstorage
    for (let i = 0; i < bigdatafile.length; i++) {
      let local = bigdatafile[i]
      // Makes sure the project is public, is the right team (45), and that the project id matches.
      if (local.projectConfiguration.id == 45 && local.public == true && local.projectId == projectId) {
        let div = document.getElementById('project')
        let p = document.createElement('p')
        let sampleData = local.entityStats

        // Check if date data last modified is null.
        let checkForModificationDate = () => {
          let modificationDate = local.latestDataModification
          let date = new Date(modificationDate).toDateString()

          if (modificationDate == null) {
            return 'Data Last Modified: Unavailable'
          } else {
            return `Data Last Modified: ${date}`
            
          }
        }
        
        // Check if dataset DOI is null.
        let checkForDataDoi =  () => {
          if (local.projectDataGuid == null) {
            return 'None Available'
          } else {
            return `<a href="${local.projectDataGuid}" target="_blank">${local.projectDataGuid}</a> `
          }
        } 

        // Check if Publication DOI is null.
        let checkForPublicationDoi = () => {
          if (local.publicationGuid == null) {
            return 'None Available'
          } else {
            return `<a href="${local.publicationGuid}" target="_blank">${local.publicationGuid}</a>`
          }
        }
        

        // Checks to see if there is event & sample data
        let handleSamples = () => {
          if (sampleData.EventCount == 0 || sampleData.EventCount == null) {
            return `No Sample Data Available<br>`
          } else {
            byProjectId(local.projectId)

            return `
            Events: ${sampleData.EventCount} || 
            Samples Collected: ${sampleData.SampleCount} 
            <br>
            ( Click on each bar for more details )
            <div id="sample-chart" >
            <canvas id="sampleChart" height="600px" width="1000px" style="margin: auto;"></canvas>
            </div> 
            <br>

            <button id="data-btn" onclick="window.open('https://geome-db.org/query?q=_projects_:${local.projectId}')" target="_blank">Query Dataset in GEOME <i class="fa fa-external-link"></i></button>
            <button id="download-btn" onclick="downloadDataFile(${local.projectId})"><i class="fa fa-download"></i>Download Newest Datafile</button>
    
            `
          }
        }

        p.innerHTML = `
        <h2>${local.projectTitle}</h2>
        <h6 style="font-size:12px;">Recommended Citation: </h6>
        <h6 id="date">${local.recommendedCitation == null ? 'No Citation Available.' : local.recommendedCitation} <br> ${checkForModificationDate()}</h6>

        
        <h3>Project Description</h3>
        <hr>
        ${local.description == null ? 'No Description Availabe' : local.description}

        <h3>Information</h3>
        <hr>
        Project PI: ${local.principalInvestigator == null ? 'None' : local.principalInvestigator} <br>
        Project Contact: ${local.projectContact} <a href="mailto:${local.projectContactEmail}" target="_blank"><i class="fa fa-envelope"></i> </a><br>
        Dataset DOI: ${checkForDataDoi()}
        
        <br>
        Publication DOI: ${checkForPublicationDoi()} <br>

        <h3 style="margin-top: 15px;">Project Data - Public <i class="fa fa-globe"></i></h3> 
        <hr>
        ${handleSamples()}

        <button id="view-btn" onclick="window.open('https://geome-db.org/workbench/project-overview?projectId=${local.projectId}')">View Project in GEOME <i class="fa fa-external-link"></i></button>

        <button id="back-btn" onclick="location.href='/projects'">Back to Projects</button>

        `
        div.appendChild(p)

        console.log(local)
        console.log(local.entityStats)
      }
    }
    //console.log("fetching project at id " + projectId)
  }
}

  // Displays "Loading Data..." while it is being fetched
  function showLoader() {
    const p = document.createElement('p')
    const searchDiv = document.getElementById('search-container')

    p.innerHTML = `Loading Data.....`
    p.setAttribute('id', 'loader')
    searchDiv.appendChild(p)
  }
  // Hides "Loading Data..." after data has been fetched.
  function hideLoader() {
    const p = document.getElementById('loader')
    p.style.display = 'none'
  }

// SET LOCALSTORAGE WITH TIME LIMIT
function setWithExpiry(key, value, ttl) {
  const now = new Date()

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl
  }
  localStorage.setItem(key, JSON.stringify(item))
}

// GET FROM LOCAL STORAGE
function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key)

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key)
    return null
  }
  return item.value
}


function getUrlVars() {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

function hideMainTable() {
  let container = document.getElementById('table-container')
  container.style.display = "none"
  let searchbar = document.getElementById('search-container')
  searchbar.style.display = "none"
}

function hideDetailTable() {
  let container = document.getElementById('detail-container')
  container.style.display = "none"
}

function makeBarChart(xLabel, dataLabel, values) {
  let canvas = document.getElementById('sampleChart')
  let ctx = document.getElementById('sampleChart').getContext('2d');

   let samplesChart = new Chart(ctx, {
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
          backgroundColor: '#b3cde3'
        }
      ]
    }
  });

  canvas.addEventListener('mouseover', function(e) {
      e.target.style.cursor = 'pointer'
  })

  canvas.addEventListener('click', function(event) {
    let firstPoint = samplesChart.getElementAtEvent(event)[0]

    if(firstPoint) {
      let label = samplesChart.data.labels[firstPoint._index];
      let arr = label.split(' ')
      let genus = arr[0]
      let species = arr[1]

      window.location.href = `/dashboard/?id=${genus}+${species}`
    }
  })
}