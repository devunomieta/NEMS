import { ElectionType } from './types'

export const ELECTION_TYPES: Record<ElectionType, string> = {
  presidential: "Presidential Election",
  governorship: "Governorship Election",
  senate: "Senate Election",
  house_of_reps: "House of Representatives Election",
  state_assembly: "State House of Assembly Election"
}

export const PARTIES = [
  { id: 'apc', name: 'APC', fullName: 'All Progressives Congress', color: '#00aae4', flagUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/All_Progressives_Congress_logo.svg/200px-All_Progressives_Congress_logo.svg.png', websiteUrl: 'https://inecnigeria.org/?page_id=27' },
  { id: 'pdp', name: 'PDP', fullName: 'Peoples Democratic Party', color: '#006400', flagUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Peoples_Democratic_Party_%28Nigeria%29_logo.svg/200px-Peoples_Democratic_Party_%28Nigeria%29_logo.svg.png', websiteUrl: 'https://inecnigeria.org/?page_id=27' },
  { id: 'lp', name: 'LP', fullName: 'Labour Party', color: '#ff0000', flagUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Labour_Party_Nigeria_logo.png/200px-Labour_Party_Nigeria_logo.png', websiteUrl: 'https://inecnigeria.org/?page_id=27' },
  { id: 'nnpp', name: 'NNPP', fullName: 'New Nigeria Peoples Party', color: '#000080', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/New_Nigeria_Peoples_Party_logo.svg/200px-New_Nigeria_Peoples_Party_logo.svg.png', websiteUrl: 'https://inecnigeria.org/?page_id=27' },
  { id: 'adc', name: 'ADC', fullName: 'African Democratic Congress', color: '#008000', flagUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/African_Democratic_Congress.jpg/200px-African_Democratic_Congress.jpg', websiteUrl: 'https://inecnigeria.org/?page_id=27' },
  { id: 'ndc', name: 'NDC', fullName: 'National Democratic Congress', color: '#800080', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_the_National_Democratic_Congress_%28Ghana%29.svg/200px-Flag_of_the_National_Democratic_Congress_%28Ghana%29.svg.png', websiteUrl: 'https://inecnigeria.org/?page_id=27' }
]

export const STATES = [
  { id: 1, name: "Abia", geo_zone: "South East" },
  { id: 2, name: "Adamawa", geo_zone: "North East" },
  { id: 3, name: "Akwa Ibom", geo_zone: "South South" },
  { id: 4, name: "Anambra", geo_zone: "South East" },
  { id: 5, name: "Bauchi", geo_zone: "North East" },
  { id: 6, name: "Bayelsa", geo_zone: "South South" },
  { id: 7, name: "Benue", geo_zone: "North Central" },
  { id: 8, name: "Borno", geo_zone: "North East" },
  { id: 9, name: "Cross River", geo_zone: "South South" },
  { id: 10, name: "Delta", geo_zone: "South South" },
  { id: 11, name: "Ebonyi", geo_zone: "South East" },
  { id: 12, name: "Edo", geo_zone: "South South" },
  { id: 13, name: "Ekiti", geo_zone: "South West" },
  { id: 14, name: "Enugu", geo_zone: "South East" },
  { id: 15, name: "FCT - Abuja", geo_zone: "North Central" },
  { id: 16, name: "Gombe", geo_zone: "North East" },
  { id: 17, name: "Imo", geo_zone: "South East" },
  { id: 18, name: "Jigawa", geo_zone: "North West" },
  { id: 19, name: "Kaduna", geo_zone: "North West" },
  { id: 20, name: "Kano", geo_zone: "North West" },
  { id: 21, name: "Katsina", geo_zone: "North West" },
  { id: 22, name: "Kebbi", geo_zone: "North West" },
  { id: 23, name: "Kogi", geo_zone: "North Central" },
  { id: 24, name: "Kwara", geo_zone: "North Central" },
  { id: 25, name: "Lagos", geo_zone: "South West" },
  { id: 26, name: "Nasarawa", geo_zone: "North Central" },
  { id: 27, name: "Niger", geo_zone: "North Central" },
  { id: 28, name: "Ogun", geo_zone: "South West" },
  { id: 29, name: "Ondo", geo_zone: "South West" },
  { id: 30, name: "Osun", geo_zone: "South West" },
  { id: 31, name: "Oyo", geo_zone: "South West" },
  { id: 32, name: "Plateau", geo_zone: "North Central" },
  { id: 33, name: "Rivers", geo_zone: "South South" },
  { id: 34, name: "Sokoto", geo_zone: "North West" },
  { id: 35, name: "Taraba", geo_zone: "North East" },
  { id: 36, name: "Yobe", geo_zone: "North East" },
  { id: 37, name: "Zamfara", geo_zone: "North West" }
]
