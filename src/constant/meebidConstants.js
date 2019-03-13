var meebidConstant = {}
meebidConstant.userType = {
	"member": 1,
	"house": 2
}
meebidConstant.uploadType = {
	"LotImages": 0,
    "LotExcel": 1,
    "Image": 3
}
meebidConstant.userRight = {
	"invalid": 4097,
	"valid": 4098,
	"houseApproved": 4099
}
meebidConstant.emailType = {
	"ValidateUrl": 1,
	"ResetPassword": 2
}
meebidConstant.addressType = {
    "Default": 1 << 0, // 是否为默认地址
    "Contact": 1 << 1, // 是否为联系人地址
    "Location": 1 << 2, // 物理地址
    "Billing": 1 << 3,  // 账单地址
    "Shipping": 1 << 4,  // 收货地址
    "Exhibition": 1 << 5, // 展览地址
    "BiddingVenue": 1 << 6, // 拍卖地址
    "PickupWarehouse": 1 << 7 // 取货地址
}
meebidConstant.addressState = {
    "Deleted": 0, // 删除
    "Available": 1 // 存在
}
meebidConstant.auctionType = {
    "Timed": 0,
    "Live": 1,
    "CategoryOnly": 2,
    0: "Timed Auction",
    1: "Live Auction",
    2: "Category Only"
}
meebidConstant.auctionState = {
    "Deleted" : 0, // 删除
    "Basic" : 1 << 0, // 刚创建
    "Waiting" : 1 << 1, // 提交审核，通过到Legal，未通过到Waiting。
    "Legal" : 1 << 2, // 通过审核, 等待上架
    "Illegal" : 1 << 3, // 被管理员下架，此lottery作废，house无法继续修改
    "Preview" : 1 << 4,  // 上架，但未正式开始
    "Online" : 1 << 5, // 上架，所有人可见
    "Ended" : 1 << 6, // 已结束
    0: "Deleted", // 删除
    1: "Draft", // 刚创建
    2: "Pending Approval", // 提交审核，通过到Legal，未通过到Waiting。
    4: "Approved", // 通过审核, 等待上架
    8: "Illegal", // 被管理员下架，此lottery作废，house无法继续修改
    16: "Preview",  // 上架，但未正式开始
    32: "Online", // 上架，所有人可见
    64: "Ended", // 已结束
}
meebidConstant.auctionStateColor = {
    0: "#98AAFB", // 删除
    1: "#8CD3FF", // 刚创建
    2: "#FAC364", // 提交审核，通过到Legal，未通过到Waiting。
    4: "#93B9C6", // 通过审核, 等待上架
    8: "#D998CB", // 被管理员下架，此lottery作废，house无法继续修改
    16: "#DBDB46",  // 上架，但未正式开始
    32: "#B6D957", // 上架，所有人可见
    64: "#CCC5A8", // 已结束
}

meebidConstant.lotAuctionState = {
    0: "Waiting", // 等待拍卖
    1: "Auctioning", // 竞拍中
    2: "ActionEnd", // 竞拍结束
    3: "ReservePrice", // 延长竞拍时间
    4: "BuyItNow", // 一口价
    "Waiting" : 0, // 等待拍卖
    "Auctioning" : 1, // 竞拍中
    "ActionEnd" : 2, // 竞拍结束
    "ReservePrice" : 3, // 延长竞拍时间
    "BuyItNow" : 4 // 一口价
}

meebidConstant.lotState = {
    "Delete" : 0,    // 删除
    "Basic" : 1 << 0,      // 刚创建
    "Waiting" : 1 << 1,   // 提交审核
    "Offline" : 1 << 2,  // 已审核通过，但未上架
    "Online" : 1 << 3,   // 上架展示
    "Forbidden" : 1 << 4, // 被管理员下架
    "Expired": 1 << 5, //过期
    0: "Delete",    // 删除
    1: "Draft",      // 刚创建
    2: "Pending Approval",   // 提交审核
    4: "Offline",  // 已审核通过，但未上架
    8: "Online",   // 上架展示
    16: "Forbidden", // 被管理员下架
    32: "Expired" //过期
}

meebidConstant.lotStateColor = {
    0: "#98AAFB", // 删除
    1: "#8CD3FF", // 刚创建
    2: "#FAC364", // 提交审核
    4: "#93B9C6", // 已审核通过，但未上架
    8: "#DBDB46",  // 上架展示
    16: "#B6D957" // 被管理员下架
}

meebidConstant.lotBidResult = {
    "Available": 1 << 0,
    "Sold": (1 << 1) + (1 << 0)
}


meebidConstant.currencyCode = [
    {"name":"Australian Dollar","alias":"AUD","id":2},
    {"name":"Singapore Dollar","alias":"SGD","id":3},
    {"name":"Afghan Afghani","alias":"AFN","id":4},
    {"name":"Albanian Lek","alias":"ALL","id":5},
    {"name":"Armenian Dram","alias":"AMD","id":6},
    {"name":"Dutch Guilder","alias":"ANG","id":7},
    {"name":"Angolan Kwanza","alias":"AOA","id":8},
    {"name":"Argentine Peso","alias":"ARS","id":9},
    {"name":"Aruban or Dutch Guilder","alias":"AWG","id":10},
    {"name":"Azerbaijan Manat","alias":"AZN","id":11},
    {"name":"Bosnian Convertible Marka","alias":"BAM","id":12},
    {"name":"Barbadian or Bajan Dollar","alias":"BBD","id":13},
    {"name":"Bangladeshi Taka","alias":"BDT","id":14},
    {"name":"Bulgarian Lev","alias":"BGN","id":15},
    {"name":"Bahraini Dinar","alias":"BHD","id":16},
    {"name":"Burundian Franc","alias":"BIF","id":17},
    {"name":"Bermudian Dollar","alias":"BMD","id":18},
    {"name":"Bruneian Dollar","alias":"BND","id":19},
    {"name":"Bolivian Bolíviano","alias":"BOB","id":20},
    {"name":"Brazilian Real","alias":"BRL","id":21},
    {"name":"Bahamian Dollar","alias":"BSD","id":22},
    {"name":"Bhutanese Ngultrum","alias":"BTN","id":23},
    {"name":"Botswana Pula","alias":"BWP","id":24},
    {"name":"Belarusian Ruble","alias":"BYN","id":25},
    {"name":"Belizean Dollar","alias":"BZD","id":26},
    {"name":"Canadian Dollar","alias":"CAD","id":27},
    {"name":"Congolese Franc","alias":"CDF","id":28},
    {"name":"Swiss Franc","alias":"CHF","id":29},
    {"name":"Chilean Peso","alias":"CLP","id":30},
    {"name":"Chinese Yuan Renminbi","alias":"CNY","id":31},
    {"name":"Colombian Peso","alias":"COP","id":32},
    {"name":"Costa Rican Colon","alias":"CRC","id":33},
    {"name":"Cuban Convertible Peso","alias":"CUC","id":34},
    {"name":"Cuban Peso","alias":"CUP","id":35},    
    {"name":"Cape Verdean Escudo","alias":"CVE","id":36},
    {"name":"Czech Koruna","alias":"CZK","id":37},
    {"name":"Djiboutian Franc","alias":"DJF","id":38},
    {"name":"Danish Krone","alias":"DKK","id":39},
    {"name":"Dominican Peso","alias":"DOP","id":40},
    {"name":"Algerian Dinar","alias":"DZD","id":41},
    {"name":"Egyptian Pound","alias":"EGP","id":42},
    {"name":"Eritrean Nakfa","alias":"ERN","id":43},
    {"name":"Ethiopian Birr","alias":"ETB","id":44},
    {"name":"Euro","alias":"EUR","id":45},
    {"name":"Fijian Dollar","alias":"FJD","id":46},
    {"name":"Falkland Island Pound","alias":"FKP","id":47},
    {"name":"British Pound","alias":"GBP","id":48},
    {"name":"Georgian Lari","alias":"GEL","id":49},
    {"name":"Guernsey Pound","alias":"GGP","id":50},
    {"name":"Ghanaian Cedi","alias":"GHS","id":51},
    {"name":"Gibraltar Pound","alias":"GIP","id":52},
    {"name":"Gambian Dalasi","alias":"GMD","id":53},
    {"name":"Guinean Franc","alias":"GNF","id":54},
    {"name":"Guatemalan Quetzal","alias":"GTQ","id":55},
    {"name":"Guyanese Dollar","alias":"GYD","id":56},
    {"name":"Hong Kong Dollar","alias":"HKD","id":57},
    {"name":"Honduran Lempira","alias":"HNL","id":58},
    {"name":"Croatian Kuna","alias":"HRK","id":59},
    {"name":"Haitian Gourde","alias":"HTG","id":60},
    {"name":"Hungarian Forint","alias":"HUF","id":61},
    {"name":"Indonesian Rupiah","alias":"IDR","id":62},
    {"name":"Israeli Shekel","alias":"ILS","id":63},
    {"name":"Isle of Man Pound","alias":"IMP","id":64},
    {"name":"Indian Rupee","alias":"INR","id":65},
    {"name":"Iraqi Dinar","alias":"IQD","id":66},
    {"name":"Iranian Rial","alias":"IRR","id":67},
    {"name":"Icelandic Krona","alias":"ISK","id":68},
    {"name":"Jersey Pound","alias":"JEP","id":69},
    {"name":"Jamaican Dollar","alias":"JMD","id":70},
    {"name":"Jordanian Dinar","alias":"JOD","id":71},
    {"name":"Japanese Yen","alias":"JPY","id":72},
    {"name":"Kenyan Shilling","alias":"KES","id":73},
    {"name":"Kyrgyzstani Som","alias":"KGS","id":74},
    {"name":"Cambodian Riel","alias":"KHR","id":75},
    {"name":"Comorian Franc","alias":"KMF","id":76},
    {"name":"North Korean Won","alias":"KPW","id":77},
    {"name":"South Korean Won","alias":"KRW","id":78},
    {"name":"Kuwaiti Dinar","alias":"KWD","id":79},
    {"name":"Caymanian Dollar","alias":"KYD","id":80},
    {"name":"Kazakhstani Tenge","alias":"KZT","id":81},
    {"name":"Lao Kip","alias":"LAK","id":82},
    {"name":"Lebanese Pound","alias":"LBP","id":83},
    {"name":"Sri Lankan Rupee","alias":"LKR","id":84},
    {"name":"Liberian Dollar","alias":"LRD","id":85},
    {"name":"Basotho Loti","alias":"LSL","id":86},
    {"name":"Libyan Dinar","alias":"LYD","id":87},
    {"name":"Moroccan Dirham","alias":"MAD","id":88},
    {"name":"Moldovan Leu","alias":"MDL","id":89},
    {"name":"Malagasy Ariary","alias":"MGA","id":90},
    {"name":"Macedonian Denar","alias":"MKD","id":91},
    {"name":"Burmese Kyat","alias":"MMK","id":92},
    {"name":"Mongolian Tughrik","alias":"MNT","id":93},
    {"name":"Macau Pataca","alias":"MOP","id":94},
    {"name":"Mauritanian Ouguiya","alias":"MRO","id":95},
    {"name":"Mauritanian Ouguiya","alias":"MRU","id":96},
    {"name":"Mauritian Rupee","alias":"MUR","id":97},
    {"name":"Maldivian Rufiyaa","alias":"MVR","id":98},
    {"name":"Malawian Kwacha","alias":"MWK","id":99},
    {"name":"Mexican Peso","alias":"MXN","id":100},
    {"name":"Malaysian Ringgit","alias":"MYR","id":101},
    {"name":"Mozambican Metical","alias":"MZN","id":102},
    {"name":"Namibian Dollar","alias":"NAD","id":103},
    {"name":"Nigerian Naira","alias":"NGN","id":104},
    {"name":"Nicaraguan Cordoba","alias":"NIO","id":105},
    {"name":"Norwegian Krone","alias":"NOK","id":106},
    {"name":"Nepalese Rupee","alias":"NPR","id":107},
    {"name":"New Zealand Dollar","alias":"NZD","id":108},
    {"name":"Omani Rial","alias":"OMR","id":109},
    {"name":"Panamanian Balboa","alias":"PAB","id":110},
    {"name":"Peruvian Sol","alias":"PEN","id":111},
    {"name":"Papua New Guinean Kina","alias":"PGK","id":112},
    {"name":"Philippine Piso","alias":"PHP","id":113},
    {"name":"Pakistani Rupee","alias":"PKR","id":114},
    {"name":"Polish Zloty","alias":"PLN","id":115},
    {"name":"Paraguayan Guarani","alias":"PYG","id":116},
    {"name":"Qatari Riyal","alias":"QAR","id":117},
    {"name":"Romanian Leu","alias":"RON","id":118},
    {"name":"Serbian Dinar","alias":"RSD","id":119},
    {"name":"Russian Ruble","alias":"RUB","id":120},
    {"name":"Rwandan Franc","alias":"RWF","id":121},
    {"name":"Saudi Arabian Riyal","alias":"SAR","id":122},
    {"name":"Solomon Islander Dollar","alias":"SBD","id":123},
    {"name":"Seychellois Rupee","alias":"SCR","id":124},
    {"name":"Sudanese Pound","alias":"SDG","id":125},
    {"name":"Swedish Krona","alias":"SEK","id":126},
    {"name":"Saint Helenian Pound","alias":"SHP","id":127},
    {"name":"Sierra Leonean Leone","alias":"SLL","id":128},
    {"name":"Somali Shilling","alias":"SOS","id":129},
    {"name":"Seborgan Luigino","alias":"SPL","id":130},
    {"name":"Surinamese Dollar","alias":"SRD","id":131},
    {"name":"Sao Tomean Dobra","alias":"STD","id":132},
    {"name":"Sao Tomean Dobra","alias":"STN","id":133},
    {"name":"Salvadoran Colon","alias":"SVC","id":134},
    {"name":"Syrian Pound","alias":"SYP","id":135},
    {"name":"Swazi Lilangeni","alias":"SZL","id":136},
    {"name":"Thai Baht","alias":"THB","id":137},
    {"name":"Tajikistani Somoni","alias":"TJS","id":138},
    {"name":"Turkmenistani Manat","alias":"TMT","id":139},
    {"name":"Tunisian Dinar","alias":"TND","id":140},
    {"name":"Tongan Pa'anga","alias":"TOP","id":141},
    {"name":"Turkish Lira","alias":"TRY","id":142},
    {"name":"Trinidadian Dollar","alias":"TTD","id":143},
    {"name":"Tuvaluan Dollar","alias":"TVD","id":144},
    {"name":"Taiwan New Dollar","alias":"TWD","id":145},
    {"name":"Tanzanian Shilling","alias":"TZS","id":146},
    {"name":"Ukrainian Hryvnia","alias":"UAH","id":147},
    {"name":"Ugandan Shilling","alias":"UGX","id":148},
    {"name":"US Dollar","alias":"USD","id":1},
    {"name":"Uruguayan Peso","alias":"UYU","id":149},
    {"name":"Uzbekistani Som","alias":"UZS","id":150},
    {"name":"Venezuelan Bolívar","alias":"VEF","id":151},
    {"name":"Vietnamese Dong","alias":"VND","id":152},
    {"name":"Ni-Vanuatu Vatu","alias":"VUV","id":153},
    {"name":"Samoan Tala","alias":"WST","id":154},
    {"name":"Central African CFA Franc BEAC","alias":"XAF","id":155},
    {"name":"Silver Ounce","alias":"XAG","id":156},
    {"name":"Gold Ounce","alias":"XAU","id":157},
    {"name":"Bitcoin","alias":"XBT","id":158},
    {"name":"East Caribbean Dollar","alias":"XCD","id":159},
    {"name":"IMF Special Drawing Rights","alias":"XDR","id":160},
    {"name":"CFA Franc","alias":"XOF","id":161},
    {"name":"Palladium Ounce","alias":"XPD","id":162},
    {"name":"CFP Franc","alias":"XPF","id":163},
    {"name":"Platinum Ounce","alias":"XPT","id":164},
    {"name":"Yemeni Rial","alias":"YER","id":165},
    {"name":"South African Rand","alias":"ZAR","id":166},
    {"name":"Zambian Kwacha","alias":"ZMW","id":167},
    {"name":"Zimbabwean Dollar","alias":"ZWD","id":168}
]
meebidConstant.exhibitionState = {
    "Delete": 0,
    "New": -1,
    "Newing": -1970,
    "Saved": 1
};

meebidConstant.regionTimeZone = {
    "-7": "PDT",
    "-6": "MDT",
    "-5": "CDT",
    "-4": "EDT",
    "-8": "PST",
    "0": "GMT",
    "2": "CEST"
}

meebidConstant.applyType = {
    "Telephone": 1 << 0,
    "Absent": 0,
    0: "Absent Bid",
    1: "Telephone Bid"
}

meebidConstant.applyState = {
    "Delete": 0,
    "Pending": 1,
    "RequestedMoreInfo": 2,
    "Accept": 3,
    "Reject": 4,
    0: "Deleted",
    1: "Pending Approval",
    2: "Request More Info",
    3: "Accepted",
    4: "Rejected",
}

meebidConstant.applyStateColor = {
    0: "#98AAFB", // 删除
    1: "#FAC364", // 等待审核
    2: "#8CD3FF", // 需要更多信息
    3: "#B6D957", // 同意
    4: "#CCC5A8", // 拒绝
}
/**
meebidConstant.currencyCode = [
    {id:'AED', label:'AED', suffix: 2},
 //United Arab Emirates Dirham
    {id:'AFN', label:'AFN', suffix: 2},
 //Afghanistan Afghani
    {id:'ALL', label:'ALL', suffix: 2},
 //Albania Lek
    {id:'AMD', label:'AMD', suffix: 2},
 //Armenia Dram
    {id:'ANG', label:'ANG', suffix: 2},
 //Netherlands Antilles Guilder
    {id:'AOA', label:'AOA', suffix: 2},
 //Angola Kwanza
    {id:'ARS', label:'ARS', suffix: 2},
 //Argentina Peso
    {id:'AUD', label:'AUD', suffix: 2},
 //Australia Dollar
    {id:'AWG', label:'AWG', suffix: 2},
 //Aruba Guilder
    {id:'AZN', label:'AZN', suffix: 2},
 //Azerbaijan Manat
    {id:'BAM', label:'BAM', suffix: 2},
 //Bosnia and Herzegovina Convertible Marka
    {id:'BBD', label:'BBD', suffix: 2},
 //Barbados Dollar
    {id:'BDT', label:'BDT', suffix: 2},
 //Bangladesh Taka
    {id:'BGN', label:'BGN', suffix: 2},
 //Bulgaria Lev
    {id:'BHD', label:'BHD', suffix: 2},
 //Bahrain Dinar
    {id:'BIF', label:'BIF', suffix: 2},
 //Burundi Franc
    {id:'BMD', label:'BMD', suffix: 2},
 //Bermuda Dollar
    {id:'BND', label:'BND', suffix: 2},
 //Brunei Darussalam Dollar
    {id:'BOB', label:'BOB', suffix: 2},
 //Bolivia Bolíviano
    {id:'BRL', label:'BRL', suffix: 2},
 //Brazil Real
    {id:'BSD', label:'BSD', suffix: 2},
 //Bahamas Dollar
    {id:'BTN', label:'BTN', suffix: 2},
 //Bhutan Ngultrum
    {id:'BWP', label:'BWP', suffix: 2},
 //Botswana Pula
    {id:'BYN', label:'BYN', suffix: 2},
 //Belarus Ruble
    {id:'BZD', label:'BZD', suffix: 2},
 //Belize Dollar
    {id:'CAD', label:'CAD', suffix: 2},
 //Canada Dollar
    {id:'CDF', label:'CDF', suffix: 2},
 //Congo/Kinshasa Franc
    {id:'CHF', label:'CHF', suffix: 2},
 //Switzerland Franc
    {id:'CLP', label:'CLP', suffix: 2},
 //Chile Peso
    {id:'CNY', label:'CNY', suffix: 2},
 //China Yuan Renminbi
    {id:'COP', label:'COP', suffix: 2},
 //Colombia Peso
    {id:'CRC', label:'CRC', suffix: 2},
 //Costa Rica Colon
    {id:'CUC', label:'CUC', suffix: 2},
 //Cuba Convertible Peso
    {id:'CUP', label:'CUP', suffix: 2},
 //Cuba Peso
    {id:'CVE', label:'CVE', suffix: 2},
 //Cape Verde Escudo
    {id:'CZK', label:'CZK', suffix: 2},
 //Czech Republic Koruna
    {id:'DJF', label:'DJF', suffix: 2},
 //Djibouti Franc
    {id:'DKK', label:'DKK', suffix: 2},
 //Denmark Krone
    {id:'DOP', label:'DOP', suffix: 2},
 //Dominican Republic Peso
    {id:'DZD', label:'DZD', suffix: 2},
 //Algeria Dinar
    {id:'EGP', label:'EGP', suffix: 2},
 //Egypt Pound
    {id:'ERN', label:'ERN', suffix: 2},
 //Eritrea Nakfa
    {id:'ETB', label:'ETB', suffix: 2},
 //Ethiopia Birr
    {id:'EUR', label:'EUR', suffix: 2},
 //Euro Member Countries
    {id:'FJD', label:'FJD', suffix: 2},
 //Fiji Dollar
    {id:'FKP', label:'FKP', suffix: 2},
 //Falkland Islands (Malvinas) Pound
    {id:'GBP', label:'GBP', suffix: 2},
 //United Kingdom Pound
    {id:'GEL', label:'GEL', suffix: 2},
 //Georgia Lari
    {id:'GGP', label:'GGP', suffix: 2},
 //Guernsey Pound
    {id:'GHS', label:'GHS', suffix: 2},
 //Ghana Cedi
    {id:'GIP', label:'GIP', suffix: 2},
 //Gibraltar Pound
    {id:'GMD', label:'GMD', suffix: 2},
 //Gambia Dalasi
    {id:'GNF', label:'GNF', suffix: 2},
 //Guinea Franc
    {id:'GTQ', label:'GTQ', suffix: 2},
 //Guatemala Quetzal
    {id:'GYD', label:'GYD', suffix: 2},
 //Guyana Dollar
    {id:'HKD', label:'HKD', suffix: 2},
 //Hong Kong Dollar
    {id:'HNL', label:'HNL', suffix: 2},
 //Honduras Lempira
    {id:'HRK', label:'HRK', suffix: 2},
 //Croatia Kuna
    {id:'HTG', label:'HTG', suffix: 2},
 //Haiti Gourde
    {id:'HUF', label:'HUF', suffix: 2},
 //Hungary Forint
    {id:'IDR', label:'IDR', suffix: 2},
 //Indonesia Rupiah
    {id:'ILS', label:'ILS', suffix: 2},
 //Israel Shekel
    {id:'IMP', label:'IMP', suffix: 2},
 //Isle of Man Pound
    {id:'INR', label:'INR', suffix: 2},
 //India Rupee
    {id:'IQD', label:'IQD', suffix: 2},
 //Iraq Dinar
    {id:'IRR', label:'IRR', suffix: 2},
 //Iran Rial
    {id:'ISK', label:'ISK', suffix: 2},
 //Iceland Krona
    {id:'JEP', label:'JEP', suffix: 2},
 //Jersey Pound
    {id:'JMD', label:'JMD', suffix: 2},
 //Jamaica Dollar
    {id:'JOD', label:'JOD', suffix: 2},
 //Jordan Dinar
    {id:'JPY', label:'JPY', suffix: 2},
 //Japan Yen
    {id:'KES', label:'KES', suffix: 2},
 //Kenya Shilling
    {id:'KGS', label:'KGS', suffix: 2},
 //Kyrgyzstan Som
    {id:'KHR', label:'KHR', suffix: 2},
 //Cambodia Riel
    {id:'KMF', label:'KMF', suffix: 2},
 //Comorian Franc
    {id:'KPW', label:'KPW', suffix: 2},
 //Korea (North) Won
    {id:'KRW', label:'KRW', suffix: 2},
 //Korea (South) Won
    {id:'KWD', label:'KWD', suffix: 2},
 //Kuwait Dinar
    {id:'KYD', label:'KYD', suffix: 2},
 //Cayman Islands Dollar
    {id:'KZT', label:'KZT', suffix: 2},
 //Kazakhstan Tenge
    {id:'LAK', label:'LAK', suffix: 2},
 //Laos Kip
    {id:'LBP', label:'LBP', suffix: 2},
 //Lebanon Pound
    {id:'LKR', label:'LKR', suffix: 2},
 //Sri Lanka Rupee
    {id:'LRD', label:'LRD', suffix: 2},
 //Liberia Dollar
    {id:'LSL', label:'LSL', suffix: 2},
 //Lesotho Loti
    {id:'LYD', label:'LYD', suffix: 2},
 //Libya Dinar
    {id:'MAD', label:'MAD', suffix: 2},
 //Morocco Dirham
    {id:'MDL', label:'MDL', suffix: 2},
 //Moldova Leu
    {id:'MGA', label:'MGA', suffix: 2},
 //Madagascar Ariary
    {id:'MKD', label:'MKD', suffix: 2},
 //Macedonia Denar
    {id:'MMK', label:'MMK', suffix: 2},
 //Myanmar (Burma) Kyat
    {id:'MNT', label:'MNT', suffix: 2},
 //Mongolia Tughrik
    {id:'MOP', label:'MOP', suffix: 2},
 //Macau Pataca
    {id:'MRU', label:'MRU', suffix: 2},
 //Mauritania Ouguiya
    {id:'MUR', label:'MUR', suffix: 2},
 //Mauritius Rupee
    {id:'MVR', label:'MVR', suffix: 2},
 //Maldives (Maldive Islands) Rufiyaa
    {id:'MWK', label:'MWK', suffix: 2},
 //Malawi Kwacha
    {id:'MXN', label:'MXN', suffix: 2},
 //Mexico Peso
    {id:'MYR', label:'MYR', suffix: 2},
 //Malaysia Ringgit
    {id:'MZN', label:'MZN', suffix: 2},
 //Mozambique Metical
    {id:'NAD', label:'NAD', suffix: 2},
 //Namibia Dollar
    {id:'NGN', label:'NGN', suffix: 2},
 //Nigeria Naira
    {id:'NIO', label:'NIO', suffix: 2},
 //Nicaragua Cordoba
    {id:'NOK', label:'NOK', suffix: 2},
 //Norway Krone
    {id:'NPR', label:'NPR', suffix: 2},
 //Nepal Rupee
    {id:'NZD', label:'NZD', suffix: 2},
 //New Zealand Dollar
    {id:'OMR', label:'OMR', suffix: 2},
 //Oman Rial
    {id:'PAB', label:'PAB', suffix: 2},
 //Panama Balboa
    {id:'PEN', label:'PEN', suffix: 2},
 //Peru Sol
    {id:'PGK', label:'PGK', suffix: 2},
 //Papua New Guinea Kina
    {id:'PHP', label:'PHP', suffix: 2},
 //Philippines Piso
    {id:'PKR', label:'PKR', suffix: 2},
 //Pakistan Rupee
    {id:'PLN', label:'PLN', suffix: 2},
 //Poland Zloty
    {id:'PYG', label:'PYG', suffix: 2},
 //Paraguay Guarani
    {id:'QAR', label:'QAR', suffix: 2},
 //Qatar Riyal
    {id:'RON', label:'RON', suffix: 2},
 //Romania Leu
    {id:'RSD', label:'RSD', suffix: 2},
 //Serbia Dinar
    {id:'RUB', label:'RUB', suffix: 2},
 //Russia Ruble
    {id:'RWF', label:'RWF', suffix: 2},
 //Rwanda Franc
    {id:'SAR', label:'SAR', suffix: 2},
 //Saudi Arabia Riyal
    {id:'SBD', label:'SBD', suffix: 2},
 //Solomon Islands Dollar
    {id:'SCR', label:'SCR', suffix: 2},
 //Seychelles Rupee
    {id:'SDG', label:'SDG', suffix: 2},
 //Sudan Pound
    {id:'SEK', label:'SEK', suffix: 2},
 //Sweden Krona
    {id:'SGD', label:'SGD', suffix: 2},
 //Singapore Dollar
    {id:'SHP', label:'SHP', suffix: 2},
 //Saint Helena Pound
    {id:'SLL', label:'SLL', suffix: 2},
 //Sierra Leone Leone
    {id:'SOS', label:'SOS', suffix: 2},
 //Somalia Shilling
    {id:'SPL', label:'SPL*', suffix: 2},
   //Seborga Luigino
    {id:'SRD', label:'SRD', suffix: 2},
 //Suriname Dollar
    {id:'STN', label:'STN', suffix: 2},
 //São Tomé and Príncipe Dobra
    {id:'SVC', label:'SVC', suffix: 2},
 //El Salvador Colon
    {id:'SYP', label:'SYP', suffix: 2},
 //Syria Pound
    {id:'SZL', label:'SZL', suffix: 2},
 //Swaziland Lilangeni
    {id:'THB', label:'THB', suffix: 2},
 //Thailand Baht
    {id:'TJS', label:'TJS', suffix: 2},
 //Tajikistan Somoni
    {id:'TMT', label:'TMT', suffix: 2},
 //Turkmenistan Manat
    {id:'TND', label:'TND', suffix: 2},
 //Tunisia Dinar
    {id:'TOP', label:'TOP', suffix: 2},
 //Tonga Pa'anga
    {id:'TRY', label:'TRY', suffix: 2},
 //Turkey Lira
    {id:'TTD', label:'TTD', suffix: 2},
 //Trinidad and Tobago Dollar
    {id:'TVD', label:'TVD', suffix: 2},
 //Tuvalu Dollar
    {id:'TWD', label:'TWD', suffix: 2},
 //Taiwan New Dollar
    {id:'TZS', label:'TZS', suffix: 2},
 //Tanzania Shilling
    {id:'UAH', label:'UAH', suffix: 2},
 //Ukraine Hryvnia
    {id:'UGX', label:'UGX', suffix: 2},
 //Uganda Shilling
    {id:'USD', label:'USD', suffix: 2},
 //United States Dollar
    {id:'UYU', label:'UYU', suffix: 2},
 //Uruguay Peso
    {id:'UZS', label:'UZS', suffix: 2},
 //Uzbekistan Som
    {id:'VEF', label:'VEF', suffix: 2},
 //Venezuela Bolívar
    {id:'VND', label:'VND', suffix: 2},
 //Viet Nam Dong
    {id:'VUV', label:'VUV', suffix: 2},
 //Vanuatu Vatu
    {id:'WST', label:'WST', suffix: 2},
 //Samoa Tala
    {id:'XAF', label:'XAF', suffix: 2},
 //Communauté Financière Africaine (BEAC) CFA Franc BEAC
    {id:'XCD', label:'XCD', suffix: 2},
 //East Caribbean Dollar
    {id:'XDR', label:'XDR', suffix: 2},
 //International Monetary Fund (IMF) Special Drawing Rights
    {id:'XOF', label:'XOF', suffix: 2},
 //Communauté Financière Africaine (BCEAO) Franc
    {id:'XPF', label:'XPF', suffix: 2},
 //Comptoirs Français du Pacifique (CFP) Franc
    {id:'YER', label:'YER', suffix: 2},
 //Yemen Rial
    {id:'ZAR', label:'ZAR', suffix: 2},
 //South Africa Rand
    {id:'ZMW', label:'ZMW', suffix: 2},
 //Zambia Kwacha
    {id:'ZWD', label:'ZWD', suffix: 2} //Zimbabwe Dollar
]
*/


/*
        'B6D957',
        'FAC364',
        'D998CB',
        '8CD3FF',
        '98AAFB',
        'F2D249',
        'CCC5A8',
        'DBDB46',
        '93B9C6',
        '5CBAE6' */

window.meebidConstant = meebidConstant;

