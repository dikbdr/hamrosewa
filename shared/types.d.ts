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
/**
 * Standard API Response Wrapper
 * All API responses follow this structure
 *
 * Example:
 * {
 *   "success": true,
 *   "message": "User created successfully",
 *   "data": { user object }
 * }
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp?: string;
}
/**
 * Paginated Response
 * Used for endpoints that return lists
 */
export interface PaginatedResponse<T> extends ApiResponse {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
/**
 * User Role enum
 * Defines what role a user has
 */
export declare enum UserRole {
    USER = "USER",
    SELLER = "SELLER",
    ADMIN = "ADMIN"
}
/**
 * User object
 * Represents a user in the system
 */
export interface IUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profileImage?: string;
    bio?: string;
    emailVerified: boolean;
    role: UserRole;
    isSuspended: boolean;
    city?: string;
    district?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Login Request
 * Data required to login
 */
export interface ILoginRequest {
    email: string;
    password: string;
}
/**
 * Register Request
 * Data required to register new user
 */
export interface IRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
/**
 * Auth Response
 * Returned after successful login/register
 */
export interface IAuthResponse {
    user: IUser;
    token: string;
    refreshToken?: string;
}
export declare enum ListingCondition {
    NEW = "NEW",
    LIKE_NEW = "LIKE_NEW",
    GOOD = "GOOD",
    USED = "USED",
    NOT_WORKING = "NOT_WORKING"
}
export declare enum ListingStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SOLD = "SOLD",
    EXPIRED = "EXPIRED",
    DELETED = "DELETED",
    FLAGGED = "FLAGGED"
}
export interface IListing {
    id: string;
    title: string;
    slug: string;
    description: string;
    categoryId: string;
    price: number;
    negotiable: boolean;
    condition: ListingCondition;
    city: string;
    district: string;
    address?: string;
    status: ListingStatus;
    featured: boolean;
    boosted: boolean;
    views: number;
    images: IListingImage[];
    sellerId: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}
export interface IListingImage {
    id: string;
    url: string;
    position: number;
}
export interface ICategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    image?: string;
    seen: boolean;
    seenAt?: string;
    createdAt: string;
}
export interface IChat {
    id: string;
    buyerId: string;
    listingId: string;
    lastMessage?: string;
    lastMessageAt?: string;
    isActive: boolean;
    messages: IMessage[];
    createdAt: string;
    updatedAt: string;
}
export declare enum PaymentMethod {
    KHALTI = "KHALTI",
    ESEWA = "ESEWA",
    STRIPE = "STRIPE",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export interface IPayment {
    id: string;
    userId: string;
    listingId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
}
export declare enum NotificationType {
    MESSAGE = "MESSAGE",
    LISTING_APPROVAL = "LISTING_APPROVAL",
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    FAVORITE_ALERT = "FAVORITE_ALERT",
    NEW_OFFER = "NEW_OFFER",
    REVIEW = "REVIEW"
}
export interface INotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}
/**
 * Custom API Error
 * Used for throwing consistent errors
 */
export declare class ApiError extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string);
}
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
//# sourceMappingURL=types.d.ts.map