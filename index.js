const agent = require('superagent').agent();

async function printResults(country, month) {
  const population = await getCountryPopulation(country);
  const cases = await getMonthlyCasesForCountry(country, month);
  const vaccines = await getVaccinationInfo(country);

  console.log(`For the month ${month} there were ${cases} confirmed COVID cases in ${country} which is ${(cases/population * 100).toFixed(2)} percent of the total population`);
  console.log(`They are currently using the following vaccines: ${vaccines}`);
}

async function getVaccinationInfo(country) {
  const upperCaseCountry = country.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  const data = await agent.get(`https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/${upperCaseCountry}.csv`);
  const arr = data.text.split('\n');
  const match = arr[arr.length - 2].match(/"(.*?)"/gm);
  return match[0].replace('"', "").replace('"', "");
}

async function getCountryPopulation(country) {
  const data = await agent.get(`https://restcountries.com/v3.1/name/${country}`)
  return data.body[0].population;
}

async function getMonthlyCasesForCountry(country, month) {
  const range = {
    start: '',
    end: ''
  }

  month = month.toLowerCase();

  switch (month) {
    case 'january':
      range.start = '01';
      range.end = '02';
      break;
    case 'february':
      range.start = '02';
      range.end = '03';
      break;
    case 'march':
      range.start = '03';
      range.end = '04';
      break;
    case 'april':
      range.start = '04';
      range.end = '05';
      break;
    case 'may':
      range.start = '05';
      range.end = '06';
      break;
    case 'june':
      range.start = '06';
      range.end = '07';
      break;
    case 'july':
      range.start = '07';
      range.end = '08';
      break;
    case 'august':
      range.start = '08';
      range.end = '09';
      break;
    case 'september':
      range.start = '09';
      range.end = '10';
      break;
    case 'october':
      range.start = '10';
      range.end = '11';
      break;
    case 'november':
      range.start = '11';
      range.end = '12';
      break;
    case 'december':
      range.start = '12';
      range.end = '01';
      break;
    default:
      throw new Error('Learn to spell your months correctly')
  }

  let data;
  if(month != 'december') {
    data = await agent.get(`https://api.covid19api.com/country/${country}/status/confirmed?from=2020-${range.start}-01T00:00:00Z&to=2020-${range.end}-01T00:00:00Z`);
  } else {
    data = await agent.get(`https://api.covid19api.com/country/${country}/status/confirmed?from=2020-${range.start}-01T00:00:00Z&to=2021-${range.end}-01T00:00:00Z`);
  }
  monthlyCases = data.body[data.body.length-1].Cases - data.body[0].Cases;
  return monthlyCases;
}

printResults('south africa', 'december');
printResults('belgium', 'october');
printResults('france', 'july');
