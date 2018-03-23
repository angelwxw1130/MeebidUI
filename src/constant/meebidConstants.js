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

