"use strict";
/**
 * TypeScript Types for HamroSewa API Responses
 *
 * These are shared types used across the application
 * for type-safe API communication.
 *
 * For junior developers:
 * - These interfaces define the structure of data
 * - Ensures consistency across backend and frontend
 * - Helps catch errors at compile time
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.NotificationType = exports.PaymentStatus = exports.PaymentMethod = exports.ListingStatus = exports.ListingCondition = exports.UserRole = void 0;
// ==================== USER TYPES ====================
/**
 * User Role enum
 * Defines what role a user has
 */
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["SELLER"] = "SELLER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
// ==================== LISTING TYPES ====================
var ListingCondition;
(function (ListingCondition) {
    ListingCondition["NEW"] = "NEW";
    ListingCondition["LIKE_NEW"] = "LIKE_NEW";
    ListingCondition["GOOD"] = "GOOD";
    ListingCondition["USED"] = "USED";
    ListingCondition["NOT_WORKING"] = "NOT_WORKING";
})(ListingCondition || (exports.ListingCondition = ListingCondition = {}));
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["ACTIVE"] = "ACTIVE";
    ListingStatus["INACTIVE"] = "INACTIVE";
    ListingStatus["SOLD"] = "SOLD";
    ListingStatus["EXPIRED"] = "EXPIRED";
    ListingStatus["DELETED"] = "DELETED";
    ListingStatus["FLAGGED"] = "FLAGGED";
})(ListingStatus || (exports.ListingStatus = ListingStatus = {}));
// ==================== PAYMENT TYPES ====================
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["KHALTI"] = "KHALTI";
    PaymentMethod["ESEWA"] = "ESEWA";
    PaymentMethod["STRIPE"] = "STRIPE";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
// ==================== NOTIFICATION TYPES ====================
var NotificationType;
(function (NotificationType) {
    NotificationType["MESSAGE"] = "MESSAGE";
    NotificationType["LISTING_APPROVAL"] = "LISTING_APPROVAL";
    NotificationType["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    NotificationType["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    NotificationType["FAVORITE_ALERT"] = "FAVORITE_ALERT";
    NotificationType["NEW_OFFER"] = "NEW_OFFER";
    NotificationType["REVIEW"] = "REVIEW";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
// ==================== ERROR TYPES ====================
/**
 * Custom API Error
 * Used for throwing consistent errors
 */
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
// ==================== REQUEST/RESPONSE EXAMPLES ====================
/**
 * Example Login Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {
 *       "id": "user-123",
 *       "email": "user@example.com",
 *       "firstName": "John",
 *       "role": "USER"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIs...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
 *   }
 * }
 */
//# sourceMappingURL=types.js.map