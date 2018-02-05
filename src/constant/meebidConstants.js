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
window.meebidConstant = meebidConstant;

