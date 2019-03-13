import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    meebid: {
        common: {
            MSG_FORGET_PASSWORD_LINK_TEXT: "Forget your password?",
            MSG_DATE_FORMAT: "MM/dd/yyyy hh:mm:ss",
            MSG_DATE_NO_SECOND_FORMAT: "MM/dd/yyyy HH:mm",
            MSG_TIME_NO_SECOND_FORMAT: "HH:mm",
            MSG_DATE_MONTH_DETAIL_FORMAT: "MMMM dd, yyyy",
            MSG_DATE_TIME_DETAIL_FORMAT: "MMMM dd, yyyy, hh:mm TT",
            MSG_DATE_WITH_A_NO_SECOND_FORMAT: "MM/dd/yyyy hh:mm TT",
            MSG_HOURS: "hours"
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
            MSG_PROFILE_ACCOUNT_PENDING_APPROVE: "House Account is pending administrator approval",
            MSG_PROFILE_ACCOUNT_APPLY_FOR_APPROVE_SUCCESS: "Apply for Approval success",
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
            MSG_ADMIN_BATCH_UPLOAD_TEMPLATE_TYPE_ERROR_TEXT: "Template can only be excel file, please check your uploaded file and try again.",
            MSG_ADMIN_BATCH_UPLOAD_TEMPLATE_DATA_ERROR_TEXT: "Template data is invalid, please see below information: <br/> {0}",
            MSG_ADMIN_BATCH_UPLOAD_TEMPLATE_DATA_ERROR_NOT_ALLOW_EMPTY_TEXT: "{0} cannot be empty.<br/>",
            MSG_ADMIN_BATCH_UPLOAD_TEMPLATE_DATA_ERROR_INVALID_DATA_TEXT: "{0} is invalid.<br/>",
            MSG_ADMIN_BATCH_UPLOAD_TEMPLATE_DATA_ERROR_INVALID_LESS_THAN_TEXT: "{0} cannot less than {1}.<br/>",
            MSG_ADMIN_BATCH_UPLOAD_TEMPLATE_DATA_ERROR_LOT_ID_CONFLICT_TEXT: "{0} {1} already exist in auction.<br/>",
            MSG_ADMIN_BATCH_UPLOAD_SUCCESS: "Batch Upload Lots successful, {0} lots updated into auction.",
            MSG_ADMIN_BATCH_UPLOAD_IMAGES_SUCCESS: "Batch Upload Lots images successful.",
            MSG_ADMIN_BATCH_UPLOAD_AUCTION_RESULT_SUCCESS: "Batch Upload Auction Result successful.",
            MSG_ADMIN_BATCH_UPLOAD_NAME_CONFLICT_TEXT: "File name {0} already existing, click confirm to replace existing file or click cancel to quit upload process.",
            MSG_ADMIN_AUCTION_REVIEW_ALL_LOTS_TEXT: "All un-reviewed lots have been submit for review, please wait for administrator approval.",
            MSG_ADMIN_LOT_VALIDATION_LOT_ID_EXISTING_TEXT: "Lot No. already exist in Auction. Next unused Lot No. is {0}",
            MSG_LOT_DETAIL_REGISTER_SUCCESS: "Registration updated",
            MSG_LOT_DETAIL_DELETE_APPLY_CONFIRM_TEXT: "Are you sure to cancel this registration?",
            MSG_LOT_DETAIL_CANCEL_SUCCESS: "Registration cancelled",
            MSG_LOT_REGISTRATION_APPLY_SUCCESS: "Registration Approved",
            MSG_LOT_REGISTRATION_DENY_SUCCESS: "Registration Rejected"
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
        },
        batchUpload: {
            MSG_BATCH_UPLOAD_HINT_LABEL: "Notice: Lot No with * are already existing in Auction, your upload will override existing lots' information.",
            MSG_BATCH_UPLOAD_IMAGES_HINT_LABEL: "Notice: Images with existing Lot No. will be updated. Images without existing Lot No. will be ignored.",
            MSG_BATCH_UPLOAD_AUCTION_RESULT_HINT_LABEL: "Notice: Lot result with existing Lot No. will be updated. Lot result without existing Lot No. will be ignored."
        },
        regionLabel: {
            MSG_ADDRESS_COUNTRY: "Country or Territory",
            MSG_ADDRESS_BUILDINGNAME: "Building Name & Street",
            MSG_ADDRESS_ADDRESSLINE2: "Address Line 2",
            MSG_ADDRESS_ADDRESSLINE3: "Address Line 3",
            MSG_ADDRESS_CITY: "City",
            MSG_ADDRESS_PROVINCE: "Province/State",
            MSG_ADDRESS_POSTALCODE: "Postal Code",
            MSG_ADDRESS_APTNUM: "Apt/Suite Number",
            MSG_ADDRESS_STATE: "State"
        },
        lotDetail: {
            MSG_FAVOR_TEXT: "{0} Saved",
        },
        auctionDetail: {
            MSG_SHOW_UPCOMING_AUCTIONS: "Show Upcoming Auctions",
            MSG_SHOW_PAST_AUCTIONS: "Show Past Auctions"
        },
        lotList: {
            MSG_SHOW_UPCOMING_LOTS: "Show Upcoming Lots",
            MSG_SHOW_PAST_LOTS: "Show Past Lots",
        }
    },
    ...enLocale
}

export default en;