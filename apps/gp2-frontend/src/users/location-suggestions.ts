const locationSuggestions = [
  {
    shortName: 'Afghanistan',
    longName: 'Islamic Republic of Afghanistan',
    capital: 'Kabul',
  },
  {
    shortName: 'Albania',
    longName: 'Republic of Albania',
    capital: 'Tirana',
  },
  {
    shortName: 'Algeria',
    longName: 'People’s Democratic Republic of Algeria',
    capital: 'Algiers',
  },
  {
    shortName: 'Andorra',
    longName: 'Principality of Andorra',
    capital: 'Andorra la Vella',
  },
  {
    shortName: 'Angola',
    longName: 'Republic of Angola',
    capital: 'Luanda',
  },
  {
    shortName: 'Antigua and\nBarbuda',
    longName: 'Antigua and Barbuda',
    capital: 'Saint John’s',
  },
  {
    shortName: 'Argentina',
    longName: 'Argentine Republic',
    capital: 'Buenos Aires',
  },
  {
    shortName: 'Armenia',
    longName: 'Republic of Armenia',
    capital: 'Yerevan',
  },
  {
    shortName: 'Australia',
    longName: 'Commonwealth of Australia',
    capital: 'Canberra',
  },
  {
    shortName: 'Austria',
    longName: 'Republic of Austria',
    capital: 'Vienna',
  },
  {
    shortName: 'Azerbaijan',
    longName: 'Republic of Azerbaijan',
    capital: 'Baku',
  },
  {
    shortName: 'Bahamas, The',
    longName: 'Commonwealth\nof The Bahamas',
    capital: 'Nassau',
  },
  {
    shortName: 'Bahrain',
    longName: 'Kingdom of Bahrain',
    capital: 'Manama',
  },
  {
    shortName: 'Bangladesh',
    longName: 'People’s Republic\nof Bangladesh',
    capital: 'Dhaka',
  },
  {
    shortName: 'Barbados',
    longName: 'Barbados',
    capital: 'Bridgetown',
  },
  {
    shortName: 'Belarus',
    longName: 'Republic of Belarus',
    capital: 'Minsk',
  },
  {
    shortName: 'Belgium',
    longName: 'Kingdom of Belgium',
    capital: 'Brussels',
  },
  {
    shortName: 'Belize',
    longName: 'Belize',
    capital: 'Belmopan',
  },
  {
    shortName: 'Benin',
    longName: 'Republic of Benin',
    capital: 'Porto-Novo\nCotonou (seat of government)',
  },

  {
    shortName: 'Bhutan',
    longName: 'Kingdom of Bhutan',
    capital: 'Thimphu',
  },
  {
    shortName: 'Bolivia',
    longName: 'Plurinational State of Bolivia',
    capital: 'La Paz (administrative)\nSucre (legislative/judiciary)',
  },
  {
    shortName: 'Bosnia and\nHerzegovina',
    longName: 'Bosnia and Herzegovina',
    capital: 'Sarajevo',
  },
  {
    shortName: 'Botswana',
    longName: 'Republic of Botswana',
    capital: 'Gaborone',
  },
  {
    shortName: 'Brazil',
    longName: 'Federative Republic of Brazil',
    capital: 'Brasília',
  },
  {
    shortName: 'Brunei',
    longName: 'Brunei Darussalam',
    capital: 'Bandar Seri Begawan',
  },
  {
    shortName: 'Bulgaria',
    longName: 'Republic of Bulgaria',
    capital: 'Sofia',
  },
  {
    shortName: 'Burkina Faso',
    longName: 'Burkina Faso',
    capital: 'Ouagadougou',
  },
  {
    shortName: 'Burma',
    longName: 'Union of Burma',
    capital: 'Rangoon\nNay Pyi Taw (administrative)',
  },
  {
    shortName: 'Burundi',
    longName: 'Republic of Burundi',
    capital: 'Bujumbura\nGitega (political)',
  },
  {
    shortName: 'Cabo Verde',
    longName: 'Republic of Cabo Verde',
    capital: 'Praia',
  },
  {
    shortName: 'Cambodia',
    longName: 'Kingdom of Cambodia',
    capital: 'Phnom Penh',
  },
  {
    shortName: 'Cameroon',
    longName: 'Republic of Cameroon',
    capital: 'Yaoundé',
  },
  {
    shortName: 'Canada',
    longName: 'Canada',
    capital: 'Ottawa',
  },

  {
    shortName: 'Central\nAfrican Republic',
    longName: 'Central African Republic',
    capital: 'Bangui',
  },
  {
    shortName: 'Chad',
    longName: 'Republic of Chad',
    capital: 'N’Djamena',
  },
  {
    shortName: 'Chile',
    longName: 'Republic of Chile',
    capital: 'Santiago',
  },
  {
    shortName: 'China',
    longName: 'People’s Republic of China',
    capital: 'Beijing',
  },

  {
    shortName: 'Colombia',
    longName: 'Republic of Colombia',
    capital: 'Bogotá',
  },
  {
    shortName: 'Comoros',
    longName: 'Union of the Comoros',
    capital: 'Moroni',
  },
  {
    shortName: 'Congo (Brazzaville)',
    longName: 'Republic of the Congo',
    capital: 'Brazzaville',
  },
  {
    shortName: 'Congo (Kinshasa)',
    longName: 'Democratic Republic\nof the Congo',
    capital: 'Kinshasa',
  },

  {
    shortName: 'Costa Rica',
    longName: 'Republic of Costa Rica',
    capital: 'San José',
  },
  {
    shortName: 'Côte d’Ivoire',
    longName: 'Republic of Côte d’Ivoire',
    capital: 'Yamoussoukro',
  },
  {
    shortName: 'Croatia',
    longName: 'Republic of Croatia',
    capital: 'Zagreb',
  },
  {
    shortName: 'Cuba',
    longName: 'Republic of Cuba',
    capital: 'Havana',
  },

  {
    shortName: 'Cyprus',
    longName: 'Republic of Cyprus',
    capital: 'Nicosia',
  },
  {
    shortName: 'Czechia',
    longName: 'Czech Republic',
    capital: 'Prague',
  },
  {
    shortName: 'Denmark',
    longName: 'Kingdom of Denmark',
    capital: 'Copenhagen',
  },
  {
    shortName: 'Djibouti',
    longName: 'Republic of Djibouti',
    capital: 'Djibouti',
  },
  {
    shortName: 'Dominica',
    longName: 'Commonwealth of Dominica',
    capital: 'Roseau',
  },
  {
    shortName: 'Dominican Republic',
    longName: 'Dominican Republic',
    capital: 'Santo Domingo',
  },
  {
    shortName: 'Ecuador',
    longName: 'Republic of Ecuador',
    capital: 'Quito',
  },
  {
    shortName: 'Egypt',
    longName: 'Arab Republic of Egypt',
    capital: 'Cairo',
  },
  {
    shortName: 'El Salvador',
    longName: 'Republic of El Salvador',
    capital: 'San Salvador',
  },
  {
    shortName: 'Equatorial Guinea',
    longName: 'Republic of Equatorial Guinea',
    capital: 'Malabo',
  },
  {
    shortName: 'Eritrea',
    longName: 'State of Eritrea',
    capital: 'Asmara',
  },
  {
    shortName: 'Estonia',
    longName: 'Republic of Estonia',
    capital: 'Tallinn',
  },
  {
    shortName: 'Eswatini',
    longName: 'Kingdom of Eswatini',
    capital: 'Mbabane (administrative)\nLobamba (legislative)',
  },
  {
    shortName: 'Ethiopia',
    longName: 'Federal Democratic\nRepublic of Ethiopia',
    capital: 'Addis Ababa',
  },
  {
    shortName: 'Fiji',
    longName: 'Republic of Fiji',
    capital: 'Suva',
  },
  {
    shortName: 'Finland',
    longName: 'Republic of Finland',
    capital: 'Helsinki',
  },

  {
    shortName: 'France',
    longName: 'French Republic',
    capital: 'Paris',
  },

  {
    shortName: 'Gabon',
    longName: 'Gabonese Republic',
    capital: 'Libreville',
  },
  {
    shortName: 'Gambia, The',
    longName: 'Republic of The Gambia',
    capital: 'Banjul',
  },
  {
    shortName: 'Georgia',
    longName: 'Georgia',
    capital: 'Tbilisi',
  },
  {
    shortName: 'Germany',
    longName: 'Federal Republic of Germany',
    capital: 'Berlin',
  },
  {
    shortName: 'Ghana',
    longName: 'Republic of Ghana',
    capital: 'Accra',
  },
  {
    shortName: 'Greece',
    longName: 'Hellenic Republic',
    capital: 'Athens',
  },

  {
    shortName: 'Grenada',
    longName: 'Grenada',
    capital: 'Saint George’s',
  },
  {
    shortName: 'Guatemala',
    longName: 'Republic of Guatemala',
    capital: 'Guatemala City',
  },
  {
    shortName: 'Guinea',
    longName: 'Republic of Guinea',
    capital: 'Conakry',
  },
  {
    shortName: 'Guinea-Bissau',
    longName: 'Republic of Guinea-Bissau',
    capital: 'Bissau',
  },
  {
    shortName: 'Guyana',
    longName: 'Co-operative Republic of Guyana',
    capital: 'Georgetown',
  },
  {
    shortName: 'Haiti',
    longName: 'Republic of Haiti',
    capital: 'Port-au-Prince',
  },
  {
    shortName: 'Holy See ',
    longName: 'Holy See',
    capital: 'Vatican City',
  },
  {
    shortName: 'Honduras',
    longName: 'Republic of Honduras',
    capital: 'Tegucigalpa',
  },
  {
    shortName: 'Hungary',
    longName: 'Hungary',
    capital: 'Budapest',
  },
  {
    shortName: 'Iceland',
    longName: 'Republic of Iceland',
    capital: 'Reykjavík',
  },
  {
    shortName: 'India',
    longName: 'Republic of India',
    capital: 'New Delhi',
  },
  {
    shortName: 'Indonesia',
    longName: 'Republic of Indonesia',
    capital: 'Jakarta',
  },
  {
    shortName: 'Iran',
    longName: 'Islamic Republic of Iran',
    capital: 'Tehran',
  },
  {
    shortName: 'Iraq',
    longName: 'Republic of Iraq',
    capital: 'Baghdad',
  },
  {
    shortName: 'Ireland',
    longName: 'Ireland',
    capital: 'Dublin',
  },
  {
    shortName: 'Israel',
    longName: 'State of Israel',
    capital: 'Jerusalem',
  },
  {
    shortName: 'Italy',
    longName: 'Italian Republic',
    capital: 'Rome',
  },
  {
    shortName: 'Jamaica',
    longName: 'Jamaica',
    capital: 'Kingston',
  },
  {
    shortName: 'Japan',
    longName: 'Japan',
    capital: 'Tokyo',
  },
  {
    shortName: 'Jordan',
    longName: 'Hashemite\nKingdom of Jordan',
    capital: 'Amman',
  },
  {
    shortName: 'Kazakhstan',
    longName: 'Republic of Kazakhstan',
    capital: 'Nur-Sultan',
  },
  {
    shortName: 'Kenya',
    longName: 'Republic of Kenya',
    capital: 'Nairobi',
  },

  {
    shortName: 'Kiribati',
    longName: 'Republic of Kiribati',
    capital: 'Tarawa',
  },
  {
    shortName: 'Korea, North',
    longName: 'Democratic People’s Republic of Korea',
    capital: 'Pyongyang',
  },
  {
    shortName: 'Korea, South',
    longName: 'Republic of Korea',
    capital: 'Seoul',
  },
  {
    shortName: 'Kosovo',
    longName: 'Republic of Kosovo',
    capital: 'Pristina',
  },
  {
    shortName: 'Kuwait',
    longName: 'State of Kuwait',
    capital: 'Kuwait City',
  },
  {
    shortName: 'Kyrgyzstan',
    longName: 'Kyrgyz Republic',
    capital: 'Bishkek',
  },
  {
    shortName: 'Laos',
    longName: 'Lao People’s\nDemocratic Republic',
    capital: 'Vientiane',
  },
  {
    shortName: 'Latvia',
    longName: 'Republic of Latvia',
    capital: 'Riga',
  },
  {
    shortName: 'Lebanon',
    longName: 'Lebanese Republic',
    capital: 'Beirut',
  },
  {
    shortName: 'Lesotho',
    longName: 'Kingdom of Lesotho',
    capital: 'Maseru',
  },
  {
    shortName: 'Liberia',
    longName: 'Republic of Liberia',
    capital: 'Monrovia',
  },
  {
    shortName: 'Libya',
    longName: 'State of Libya',
    capital: 'Tripoli',
  },
  {
    shortName: 'Liechtenstein',
    longName: 'Principality of Liechtenstein',
    capital: 'Vaduz',
  },
  {
    shortName: 'Lithuania',
    longName: 'Republic of Lithuania',
    capital: 'Vilnius',
  },
  {
    shortName: 'Luxembourg',
    longName: 'Grand Duchy of Luxembourg',
    capital: 'Luxembourg',
  },
  {
    shortName: 'Madagascar',
    longName: 'Republic of Madagascar',
    capital: 'Antananarivo',
  },
  {
    shortName: 'Malawi',
    longName: 'Republic of Malawi',
    capital: 'Lilongwe',
  },
  {
    shortName: 'Malaysia',
    longName: 'Malaysia',
    capital: 'Kuala Lumpur',
  },
  {
    shortName: 'Maldives',
    longName: 'Republic of Maldives',
    capital: 'Male',
  },
  {
    shortName: 'Mali',
    longName: 'Republic of Mali',
    capital: 'Bamako',
  },
  {
    shortName: 'Malta',
    longName: 'Republic of Malta',
    capital: 'Valletta',
  },
  {
    shortName: 'Marshall Islands',
    longName: 'Republic of the\nMarshall Islands',
    capital: 'Majuro',
  },
  {
    shortName: 'Mauritania',
    longName: 'Islamic Republic\nof Mauritania',
    capital: 'Nouakchott',
  },
  {
    shortName: 'Mauritius ',
    longName: 'Republic of Mauritius',
    capital: 'Port Louis',
  },
  {
    shortName: 'Mexico',
    longName: 'United Mexican States',
    capital: 'Mexico City',
  },
  {
    shortName: 'Micronesia,\nFederated States of ',
    longName: 'Federated States\nof Micronesia',
    capital: 'Palikir',
  },
  {
    shortName: 'Moldova',
    longName: 'Republic of Moldova',
    capital: 'Chisinau',
  },
  {
    shortName: 'Monaco',
    longName: 'Principality of Monaco',
    capital: 'Monaco',
  },
  {
    shortName: 'Mongolia',
    longName: 'Mongolia',
    capital: 'Ulaanbaatar',
  },
  {
    shortName: 'Montenegro',
    longName: 'Montenegro',
    capital: 'Podgorica',
  },

  {
    shortName: 'Morocco',
    longName: 'Kingdom of Morocco',
    capital: 'Rabat',
  },
  {
    shortName: 'Mozambique ',
    longName: 'Republic of Mozambique',
    capital: 'Maputo',
  },
  {
    shortName: 'Namibia',
    longName: 'Republic of Namibia',
    capital: 'Windhoek',
  },
  {
    shortName: 'Nauru',
    longName: 'Republic of Nauru',
    capital: 'Yaren District\n(no capital city)',
  },
  {
    shortName: 'Nepal',
    longName: 'Nepal',
    capital: 'Kathmandu',
  },
  {
    shortName: 'Netherlands',
    longName: 'Kingdom of the Netherlands',
    capital: 'Amsterdam\nThe Hague (seat of government)',
  },
  {
    shortName: 'New Zealand',
    longName: 'New Zealand',
    capital: 'Wellington',
  },
  {
    shortName: 'Nicaragua',
    longName: 'Republic of Nicaragua',
    capital: 'Managua',
  },
  {
    shortName: 'Niger',
    longName: 'Republic of Niger',
    capital: 'Niamey',
  },
  {
    shortName: 'Nigeria',
    longName: 'Federal Republic of Nigeria',
    capital: 'Abuja',
  },
  {
    shortName: 'North Macedonia',
    longName: 'Republic of North Macedonia',
    capital: 'Skopje',
  },
  {
    shortName: 'Norway',
    longName: 'Kingdom of Norway',
    capital: 'Oslo',
  },
  {
    shortName: 'Oman',
    longName: 'Sultanate of Oman',
    capital: 'Muscat',
  },
  {
    shortName: 'Pakistan',
    longName: 'Islamic Republic of Pakistan',
    capital: 'Islamabad',
  },
  {
    shortName: 'Palau',
    longName: 'Republic of Palau',
    capital: 'Ngerulmud',
  },
  {
    shortName: 'Panama',
    longName: 'Republic of Panama',
    capital: 'Panama City',
  },
  {
    shortName: 'Papua New Guinea',
    longName: 'Independent State\nof Papua New Guinea',
    capital: 'Port Moresby',
  },
  {
    shortName: 'Paraguay',
    longName: 'Republic of Paraguay',
    capital: 'Asunción',
  },
  {
    shortName: 'Peru',
    longName: 'Republic of Peru',
    capital: 'Lima',
  },
  {
    shortName: 'Philippines',
    longName: 'Republic of the Philippines',
    capital: 'Manila',
  },
  {
    shortName: 'Poland',
    longName: 'Republic of Poland',
    capital: 'Warsaw',
  },
  {
    shortName: 'Portugal',
    longName: 'Portuguese Republic',
    capital: 'Lisbon',
  },
  {
    shortName: 'Qatar',
    longName: 'State of Qatar',
    capital: 'Doha',
  },
  {
    shortName: 'Romania',
    longName: 'Romania',
    capital: 'Bucharest',
  },
  {
    shortName: 'Russia',
    longName: 'Russian Federation',
    capital: 'Moscow',
  },
  {
    shortName: 'Rwanda',
    longName: 'Republic of Rwanda',
    capital: 'Kigali',
  },
  {
    shortName: 'Saint Kitts and Nevis',
    longName: 'Federation of Saint Kitts and Nevis',
    capital: 'Basseterre',
  },
  {
    shortName: 'Saint Lucia',
    longName: 'Saint Lucia',
    capital: 'Castries',
  },
  {
    shortName: 'Saint Vincent and the Grenadines',
    longName: 'Saint Vincent and the Grenadines',
    capital: 'Kingstown',
  },
  {
    shortName: 'Samoa',
    longName: 'Independent State of Samoa',
    capital: 'Apia',
  },
  {
    shortName: 'San Marino',
    longName: 'Republic of San Marino',
    capital: 'San Marino',
  },
  {
    shortName: 'Sao Tome and Principe',
    longName: 'Democratic Republic of\nSao Tome and Principe',
    capital: 'São Tomé',
  },
  {
    shortName: 'Saudi Arabia',
    longName: 'Kingdom of Saudi Arabia',
    capital: 'Riyadh',
  },
  {
    shortName: 'Senegal',
    longName: 'Republic of Senegal',
    capital: 'Dakar',
  },
  {
    shortName: 'Serbia',
    longName: 'Republic of Serbia',
    capital: 'Belgrade',
  },
  {
    shortName: 'Seychelles',
    longName: 'Republic of Seychelles',
    capital: 'Victoria',
  },
  {
    shortName: 'Sierra Leone',
    longName: 'Republic of Sierra Leone',
    capital: 'Freetown',
  },
  {
    shortName: 'Singapore',
    longName: 'Republic of Singapore',
    capital: 'Singapore',
  },
  {
    shortName: 'Slovakia',
    longName: 'Slovak Republic',
    capital: 'Bratislava',
  },
  {
    shortName: 'Slovenia',
    longName: 'Republic of Slovenia',
    capital: 'Ljubljana',
  },
  {
    shortName: 'Solomon Islands',
    longName: 'Solomon Islands',
    capital: 'Honiara',
  },
  {
    shortName: 'Somalia',
    longName: 'Federal Republic of Somalia',
    capital: 'Mogadishu',
  },
  {
    shortName: 'South Africa',
    longName: 'Republic of South Africa',
    capital:
      'Pretoria (administrative)\nCape Town (legislative)\nBloemfontein (judiciary)',
  },
  {
    shortName: 'South Sudan',
    longName: 'Republic of South Sudan',
    capital: 'Juba',
  },
  {
    shortName: 'Spain',
    longName: 'Kingdom of Spain',
    capital: 'Madrid',
  },
  {
    shortName: 'Sri Lanka',
    longName: 'Democratic Socialist\nRepublic of Sri Lanka',
    capital: 'Colombo\nSri Jayewardenepura Kotte (legislative)',
  },
  {
    shortName: 'Sudan',
    longName: 'Republic of the Sudan',
    capital: 'Khartoum',
  },
  {
    shortName: 'Suriname',
    longName: 'Republic of Suriname',
    capital: 'Paramaribo',
  },
  {
    shortName: 'Sweden',
    longName: 'Kingdom of Sweden',
    capital: 'Stockholm',
  },
  {
    shortName: 'Switzerland',
    longName: 'Swiss Confederation',
    capital: 'Bern',
  },
  {
    shortName: 'Syria',
    longName: 'Syrian Arab Republic',
    capital: 'Damascus',
  },
  {
    shortName: 'Tajikistan',
    longName: 'Republic of Tajikistan',
    capital: 'Dushanbe',
  },
  {
    shortName: 'Tanzania',
    longName: 'United Republic of Tanzania',
    capital: 'Dar es Salaam\nDodoma (legislative)',
  },
  {
    shortName: 'Thailand',
    longName: 'Kingdom of Thailand',
    capital: 'Bangkok',
  },
  {
    shortName: 'Timor-Leste ',
    longName: 'Democratic Republic of Timor-Leste',
    capital: 'Dili',
  },
  {
    shortName: 'Togo ',
    longName: 'Togolese Republic',
    capital: 'Lomé',
  },
  {
    shortName: 'Tonga ',
    longName: 'Kingdom of Tonga',
    capital: 'Nuku’alofa',
  },
  {
    shortName: 'Trinidad and Tobago',
    longName: 'Republic of\nTrinidad and Tobago',
    capital: 'Port of Spain',
  },
  {
    shortName: 'Tunisia',
    longName: 'Republic of Tunisia',
    capital: 'Tunis',
  },
  {
    shortName: 'Turkey',
    longName: 'Republic of Turkey',
    capital: 'Ankara',
  },
  {
    shortName: 'Turkmenistan',
    longName: 'Turkmenistan',
    capital: 'Ashgabat',
  },
  {
    shortName: 'Tuvalu',
    longName: 'Tuvalu',
    capital: 'Funafuti',
  },
  {
    shortName: 'Uganda',
    longName: 'Republic of Uganda',
    capital: 'Kampala',
  },
  {
    shortName: 'Ukraine',
    longName: 'Ukraine',
    capital: 'Kyiv',
  },
  {
    shortName: 'United Arab Emirates',
    longName: 'United Arab Emirates',
    capital: 'Abu Dhabi',
  },
  {
    shortName: 'United Kingdom',
    longName: 'United Kingdom of Great Britain and Northern Ireland',
    capital: 'London',
  },
  {
    shortName: 'United States',
    longName: 'United States of America',
    capital: 'Washington, DC',
  },
  {
    shortName: 'Uruguay',
    longName: 'Oriental Republic of Uruguay',
    capital: 'Montevideo',
  },
  {
    shortName: 'Uzbekistan',
    longName: 'Republic of Uzbekistan',
    capital: 'Tashkent',
  },
  {
    shortName: 'Vanuatu',
    longName: 'Republic of Vanuatu',
    capital: 'Port-Vila',
  },
  {
    shortName: 'Venezuela',
    longName: 'Bolivarian Republic of Venezuela',
    capital: 'Caracas',
  },
  {
    shortName: 'Vietnam',
    longName: 'Socialist Republic of Vietnam',
    capital: 'Hanoi',
  },
  {
    shortName: 'Yemen',
    longName: 'Republic of Yemen',
    capital: 'Sanaa',
  },
  {
    shortName: 'Zambia',
    longName: 'Republic of Zambia',
    capital: 'Lusaka',
  },
  {
    shortName: 'Zimbabwe',
    longName: 'Republic of Zimbabwe',
    capital: 'Harare',
  },
  {
    shortName: 'Taiwan',
  },
];

export default locationSuggestions;
