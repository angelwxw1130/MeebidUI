import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    meebid: {
        common: {
            MSG_FORGET_PASSWORD_LINK_TEXT: "Forget your password?",
            MSG_DATE_FORMAT: "MM/dd/yyyy hh:mm:ss"
        },
        upload: {
        	deleteTip: "Press enter to delete"
        },
        alertMessage: {
        	MSG_LOGIN_ACCOUNT_NOT_EXIST: "Account not exist, please try again.",
            MSG_LOGIN_PASSWORD_INCORRECT: "Incorrect password, please try again.",
            MSG_REVALIDATE_EMAIL_SEND_SUCCESS: "Send validation email success, please check your mail account.",
        	MSG_PROFILE_ACCOUNT_NOT_ACTIVATE: "Account hasn't been activated, please check your email and activate your account",
        	MSG_PROFILE_ACCOUNT_NOT_APPROVE: "Account hasn't been approved, please upload license and ask administrator for approval",
            MSG_FORGET_PASSWORD_SEND_EMAIL_SUCCESS: "We have sent an email to your account for reseting password, please check your mail account.",
            MSG_RESET_PASSWORD_SUCCESS: "Change password successful! Redirect to home in 5 seconds.",
            MSG_ADMIN_USER_UPDATE_PROFILE_SUCCESS: "Profile information updated",
            MSG_ADMIN_USER_UPDATE_ADDRESS_SUCCESS: "Address information updated",
            MSG_ADMIN_USER_DEFAULT_SETTING_SUCCESS: "Default Setting updated",
            MSG_ADMIN_USER_DEFAULT_ADDRESS_SUCCESS: "Default Address updated",
            MSG_UNSAVED_DATA: "You have pending changes",
            MSG_LEAVE_WITH_UNSAVED_DATA: "You will lost all pendings change on this page. Are you sure to leave the page?",
            MSG_LOGOUT_CONFIRMATION_TEXT: "Are you sure to logout system?",
            MSG_DELETE_ADDRESS_CONFIRMATION_TEXT: "Are you sure to delete this address?",
            MSG_ADDRESS_NOT_EXIST_WARNING_TEXT: "Some of addresses have been changed/not existing, please refresh the page and try to update Auction again.",
            MSG_SET_DEFAULT_BILLING_ADDRESS_CONFIRMATION_TEXT: "Are you sure to change this address as default Billing Address?",
            MSG_SET_DEFAULT_SHIPPING_ADDRESS_CONFIRMATION_TEXT: "Are you sure to change this address as default Shipping Address?",
            MSG_SET_DEFAULT_EXHIBITION_ADDRESS_CONFIRMATION_TEXT: "Are you sure to change this address as default Exhibition Address?",
            MSG_SET_DEFAULT_BIDDING_VENUE_ADDRESS_CONFIRMATION_TEXT: "Are you sure to change this address as default Bidding Venue Address?",
            MSG_SET_DEFAULT_PICKUP_WAREHOUSE_ADDRESS_CONFIRMATION_TEXT: "Are you sure to change this address as default Pick-up Warehouse Address?",
            MSG_ADMIN_NO_ADDRESS_SELECTABLE: "You haven't any address can be selected, please add at least one in Profile page.",
            MSG_ADMIN_NO_PICK_UP_WAREHOUSE_ADDRESS_SELECTABLE: "You cannot create Auction without Pick-up Warehouse Address, please add at least one in Profile page.",
            MSG_ADMIN_USING_DEFAULT_HOUSE_TERMS_TEXT: "House Default Terms setting will be fulfilled if no specific terms typed-in.",
            MSG_ADMIN_USING_DEFAULT_AUCTION_TERMS_TEXT: "Auction Terms setting will be fulfilled if no specific terms typed-in.",
            MSG_ADMIN_USER_UPDATE_AUCTION_SUCCESS: "Auction information updated",
            MSG_ADMIN_USER_UPDATE_LOT_SUCCESS: "Lot information updated",
            MSG_ADMIN_DELETE_AUCTION_CONFIRMATION_TEXT: "Are you sure to delete this auction?",
            MSG_ADMIN_DELETE_LOT_CONFIRMATION_TEXT: "Are you sure to delete this lot?",
            MSG_ADMIN_AUCTION_REVIEW_ALL_LOTS_TEXT: "All un-reviewed lots have been submit for review, please wait for administrator approval.",
            MSG_ADMIN_LOT_VALIDATION_LOT_ID_EXISTING_TEXT: "This Lot No. is already existing in Auction, please try another. Next unused Lot No. is {0}",
        },
        forgetPassword: {
            MSG_FORGET_PASSWORD_HEADER_TEXT: "Send an email to reset your password"
        },
        resetPassword: {
            MSG_RESET_PASSWORD_HEADER_TEXT: "Please reset and confirm your passowrd"
        },
        auctionManagement: {
            MSG_AUCTION_TYPE_TIMED_TEXT: "Timed",
            MSG_AUCTION_TYPE_LIVE_TEXT: "Live",
            MSG_AUCTION_TYPE_CATEGORY_ONLY_TEXT: "Category Only"
        }
    },
    ...enLocale
}

export default en;