
Master Branch Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/23d9985e-54ca-4f1e-9acb-72998d516f11/deploy-status)](https://app.netlify.com/sites/amphibiandiseaseportal/deploys)

Develop Branch Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/b68a24b3-fd2d-4499-adf0-4917402d68e7/deploy-status)](https://app.netlify.com/sites/amphibiandisease-develop/deploys)


# Amphibian Disease Portal

New portal design built in Hugo and Javascript with GEOME backend.  Commits to the master and develop branch are watched by netlify and deployed at the following URL addresses:

Master Branch URL: https://amphibiandisease.org

Develop Branch URL: https://amphibiandisease-develop.netlify.com/

Site v2.0 went live May 28th on Netlify!

# Developers

You can update content in 3 general areas:

 * To customize text content on pages goto the ```content``` folder and update the relevant markdown files. This section contains markdown
 * To customize and create javascript functions goto static/js/{file}.js   This section contains javascript.
 * To customize the behavior of pages, update content in layouts/{section title}/single or list.html . This section contains mainly go syntax
 
Data for the dashboard is served by the AD Portal API: https://github.com/BNHM/AmphibiaWebDiseasePortalAPI

# Running locally
if you have hugo installed you should be able to just type the following at the root directory:

```
hugo server
```
