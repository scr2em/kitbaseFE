/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Permission code enum representing all available permissions in the system */
export type PermissionCode =
  | "organization.update"
  | "member.view"
  | "member.invite"
  | "member.remove"
  | "member.update_role"
  | "app.read"
  | "app.create"
  | "app.update"
  | "app.delete"
  | "channel.read"
  | "channel.create"
  | "channel.update"
  | "channel.delete"
  | "analytics.view"
  | "support.operations";

/** Organization membership status */
export type MembershipStatusEnum = "active" | "inactive";

/** Invitation status */
export type InvitationStatusEnum =
  | "pending"
  | "accepted"
  | "expired"
  | "canceled";

/** User account status */
export type UserStatusEnum = "active" | "inactive" | "pending" | "suspended";

/** Request to register a new user */
export interface UserRegistrationRequest {
  /**
   * User's email address
   * @format email
   */
  email: string;
  /**
   * User's password (minimum 8 characters and max 50 characters)
   * @format password
   * @minLength 8
   * @maxLength 50
   */
  password: string;
  /**
   * User's first name
   * @minLength 2
   */
  firstName: string;
  /**
   * User's last name
   * @minLength 2
   */
  lastName: string;
}

/** Request to login */
export interface LoginRequest {
  /**
   * User's email address
   * @format email
   */
  email: string;
  /**
   * User's password
   * @format password
   */
  password: string;
}

/** Request to refresh access token */
export interface RefreshTokenRequest {
  /** Refresh token */
  refreshToken: string;
}

/** Request to initiate password reset */
export interface ForgotPasswordRequest {
  /**
   * User's email address
   * @format email
   */
  email: string;
}

/** Response for forgot password request */
export interface ForgotPasswordResponse {
  /**
   * Generic success message (never reveals if email exists)
   * @example "If that email address is in our system, we've sent a password reset link to it."
   */
  message: string;
}

/** Request to reset password with token */
export interface ResetPasswordRequest {
  /** Password reset token from email */
  token: string;
  /**
   * New password (min 8 chars, must contain uppercase, lowercase, number, and special character)
   * @format password
   * @minLength 8
   */
  newPassword: string;
}

/** Response for successful password reset */
export interface ResetPasswordResponse {
  /**
   * Success message
   * @example "Password successfully reset. You can now sign in with your new password."
   */
  message: string;
}

export interface SignupInitiateRequest {
  /**
   * User's email address
   * @format email
   */
  email: string;
}

export interface SignupInitiateResponse {
  /** @example "Verification email sent" */
  message: string;
}

export interface SignupResendRequest {
  /** @format email */
  email: string;
}

export interface SignupResendResponse {
  /** @example "Verification email sent" */
  message: string;
}

export interface SignupCompleteRequest {
  /** Verification token from email (64 hex chars) */
  token: string;
  /**
   * @format password
   * @minLength 8
   * @maxLength 50
   */
  password: string;
  /** @minLength 2 */
  firstName: string;
  /** @minLength 2 */
  lastName: string;
}

/** Request to create a new organization */
export interface CreateOrganizationRequest {
  /** Organization name */
  name: string;
  /** Organization description */
  description?: string;
  /**
   * URL to the organization logo image
   * @format uri
   */
  logoUrl?: string;
}

/** Request to update an organization */
export interface UpdateOrganizationRequest {
  /**
   * Organization name
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /**
   * URL to the organization logo image
   * @format uri
   */
  logoUrl?: string;
}

/** Request to create an invitation */
export interface CreateInvitationRequest {
  /**
   * Email of the invited user
   * @format email
   */
  email: string;
  /** Role name (e.g., developer, admin, analyst, support) */
  role: string;
}

/** Request to add a member to an organization */
export interface AddOrganizationMemberRequest {
  /** User ID */
  userId: string;
  /** Role ID */
  roleId: string;
}

/** Request to update a member's role */
export interface UpdateMemberRoleRequest {
  /** New role ID */
  roleId: string;
}

/** Request to create a new mobile application */
export interface CreateMobileApplicationRequest {
  /** Unique bundle identifier for the mobile application (e.g., com.example.app) */
  bundleId: string;
  /** Mobile application name */
  name: string;
  /** Mobile application description */
  description?: string;
}

/** Request to update a mobile application */
export interface UpdateMobileApplicationRequest {
  /** Mobile application name */
  name: string;
  /** Mobile application description */
  description?: string;
}

/** Request to update user information */
export interface UpdateUserRequest {
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /**
   * User's email address
   * @format email
   */
  email?: string;
}

/** User information */
export interface UserResponse {
  /** User ID */
  id: string;
  /**
   * User's email address
   * @format email
   */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User status information */
  status: UserStatusResponse;
  /** List of organizations the user is a member of */
  organizations: UserOrganizationMembership[];
  /**
   * When the user was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the user was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Current user information with role and permissions for the current organization (determined by subdomain) */
export interface CurrentUserResponse {
  /** User ID */
  id: string;
  /**
   * User's email address
   * @format email
   */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User status information */
  status: UserStatusResponse;
  /** List of organizations the user is a member of */
  organizations: UserOrganizationMembership[];
  /** The user's role with permissions in the current organization (determined by subdomain). Null if not accessing via organization subdomain. */
  currentOrganizationRole?: RoleWithPermissionsResponse | null;
  /**
   * When the user was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the user was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** User's membership in an organization */
export interface UserOrganizationMembership {
  /** Minimal organization information for user response */
  organization: UserOrganizationResponse;
  /** Role information (roles are now global across all organizations) */
  role: RoleResponse;
  /** Invitation status (null for organization owners who were not invited) */
  invitationStatus?: InvitationStatusResponse | null;
}

/** Minimal organization information for user response */
export interface UserOrganizationResponse {
  /** Organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Organization subdomain */
  subdomain: string;
}

/** User status information */
export interface UserStatusResponse {
  /** Status ID */
  id: string;
  /** User account status */
  status: UserStatusEnum;
}

/** Authentication response */
export interface AuthResponse {
  /** JWT access token */
  accessToken: string;
  /** Refresh token */
  refreshToken: string;
  /** User information */
  user: UserResponse;
}

/** Organization information */
export interface OrganizationResponse {
  /** Organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Organization subdomain (unique identifier used in URLs) */
  subdomain: string;
  /** Organization description */
  description?: string;
  /** URL to the organization logo image */
  logoUrl?: string;
  /**
   * When the organization was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the organization was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Role information (roles are now global across all organizations) */
export interface RoleResponse {
  /** Role ID */
  id: string;
  /** Role name */
  name: string;
  /** Role description */
  description?: string;
  /**
   * When the role was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the role was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Role information with associated permissions */
export interface RoleWithPermissionsResponse {
  /** Role ID */
  id: string;
  /** Role name */
  name: string;
  /** Role description */
  description?: string;
  /** List of permission codes associated with this role */
  permissions: PermissionCode[];
}

/** Invitation information */
export interface InvitationResponse {
  /** Invitation ID */
  id: string;
  /**
   * Email of the invited user
   * @format email
   */
  email: string;
  /** Organization information */
  organization: OrganizationResponse;
  /** Role information (roles are now global across all organizations) */
  role: RoleResponse;
  /** Invitation status information */
  status: InvitationStatusResponse;
  /** User information */
  invitedBy?: UserResponse;
  /**
   * When the invitation was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the invitation expires
   * @format date-time
   */
  expiresAt?: string;
}

/** Invitation status information */
export interface InvitationStatusResponse {
  /** Status ID */
  id: string;
  /** Invitation status */
  status: InvitationStatusEnum;
}

/** Organization member information */
export interface OrganizationMemberResponse {
  /** Member ID */
  id: string;
  /** User information */
  user: UserResponse;
  /** Role information (roles are now global across all organizations) */
  role: RoleResponse;
  /**
   * When the member joined
   * @format date-time
   */
  joinedAt: string;
}

/** Paginated organization member response */
export interface PaginatedOrganizationMemberResponse {
  /** Array of members for this page */
  data: OrganizationMemberResponse[];
  /** Total number of items across all pages */
  total: number;
  /** Number of items in this page */
  count: number;
  /** Maximum items per page */
  itemsPerPage: number;
}

/** Mobile application information */
export interface MobileApplicationResponse {
  /** Mobile application ID */
  id: string;
  /** Bundle identifier for the mobile application */
  bundleId: string;
  /** Organization ID that owns this application */
  organizationId: string;
  /** Mobile application name */
  name: string;
  /** Mobile application description */
  description?: string;
  /** User ID who created the application */
  createdBy: string;
  /**
   * When the application was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the application was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Build information */
export interface BuildResponse {
  /** Unique UUID identifier for the build */
  id: string;
  /** Organization ID */
  organizationId: string;
  /** Bundle identifier for the mobile application */
  bundleId: string;
  /** Git commit hash (unique identifier) */
  commitHash: string;
  /** Git branch name */
  branchName: string;
  /** Git commit message */
  commitMessage?: string;
  /**
   * Build file size in bytes
   * @format int64
   */
  buildSize: number;
  /** URL to download the build file */
  buildUrl: string;
  /** Native app version (e.g., "1.0.0") */
  nativeVersion: string;
  /** User ID who uploaded the build */
  uploadedBy: string;
  /**
   * When the build was uploaded
   * @format date-time
   */
  createdAt: string;
  /**
   * When the build was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Paginated build response */
export interface PaginatedBuildResponse {
  /** Array of builds for this page */
  data: BuildResponse[];
  /** Current page number */
  page: number;
  /** Items per page */
  size: number;
  /** Total number of builds */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/** Paginated API key response */
export interface PaginatedApiKeyResponse {
  /** Array of API keys for this page */
  data: ApiKeyResponse[];
  /** Current page number */
  page: number;
  /** Items per page */
  size: number;
  /** Total number of API keys */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/** Request to create an API key */
export interface CreateApiKeyRequest {
  /** Name/description for the API key */
  name: string;
}

/** Request to create a new channel */
export interface CreateChannelRequest {
  /** Channel name */
  name: string;
  /** Channel description */
  description?: string;
}

/** Request to update a channel */
export interface UpdateChannelRequest {
  /** Channel name */
  name?: string;
  /** Channel description */
  description?: string;
}

/** API key information */
export interface ApiKeyResponse {
  /** Unique identifier for the API key */
  id: string;
  /** Name/description of the API key */
  name: string;
  /** The actual API key (only returned on creation) */
  key?: string;
  /** Masked key display (e.g., "flyw...xyz") */
  keyPrefix: string;
  /** Bundle ID this key is for */
  bundleId: string;
  /** Organization ID */
  organizationId: string;
  /** User ID who created the key */
  createdBy: string;
  /**
   * When the key was last used
   * @format date-time
   */
  lastUsedAt?: string;
  /**
   * When the key was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the key was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Permission information */
export interface PermissionResponse {
  /** Permission code (e.g., "organization.update") */
  code: string;
  /** Human-readable permission label */
  label: string;
  /** Permission description */
  description: string;
  /** Permission category (e.g., "organization", "member", "role") */
  category: string;
}

/** Channel information */
export interface ChannelResponse {
  /** Channel ID */
  id: string;
  /** Channel name */
  name: string;
  /** Channel description */
  description?: string;
  /** Organization ID */
  organizationId: string;
  /**
   * When the channel was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the channel was last updated
   * @format date-time
   */
  updatedAt: string;
}

/** Paginated channel response */
export interface PaginatedChannelResponse {
  /** List of channels */
  data: ChannelResponse[];
  /** Current page number */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of channels */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/** Audit log entry */
export interface AuditLogResponse {
  /** Unique identifier for the audit log entry */
  id: string;
  /** ID of the user who performed the action */
  userId?: string;
  /** ID of the organization */
  organizationId?: string;
  /** Action performed (e.g., MOBILE_APP_CREATED, BUILD_UPLOADED) */
  action: string;
  /** Type of resource affected (e.g., MOBILE_APPLICATION, BUILD) */
  resourceType?: string;
  /** ID of the affected resource */
  resourceId?: string;
  /** Name of the affected resource */
  resourceName?: string;
  /** HTTP method used (GET, POST, PUT, DELETE) */
  httpMethod?: string;
  /** API endpoint called */
  endpoint?: string;
  /** IP address of the user */
  ipAddress?: string;
  /** User agent string */
  userAgent?: string;
  /** Request body (if applicable) */
  requestBody?: string;
  /** HTTP response status code */
  responseStatus?: number;
  /** Error message (if action failed) */
  errorMessage?: string;
  /** Additional metadata in JSON format */
  metadata?: string;
  /**
   * When the action occurred
   * @format date-time
   */
  createdAt: string;
}

/** Paginated audit log response */
export interface PaginatedAuditLogResponse {
  /** List of audit log entries */
  data: AuditLogResponse[];
  /** Current page number */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of audit log entries */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/** Standardized error response */
export interface ErrorResponse {
  /** Error information */
  error: {
    /**
     * Machine-readable error code (e.g., AUTH_001, ORG_002)
     * @example "AUTH_001"
     */
    code: string;
    /**
     * Human-readable error message
     * @example "Invalid credentials"
     */
    message: string;
    /**
     * Additional structured error details
     * @example {"field":"email","value":"user@example.com"}
     */
    details?: Record<string, any>;
    /**
     * Stack trace of the exception (only included in development mode)
     * @example "java.lang.RuntimeException: Test error
     * 	at com.app.server.service.UserService.method(UserService.java:123)"
     */
    stackTrace?: string;
  };
  /**
   * When the error occurred
   * @format date-time
   */
  timestamp: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Flyway API
 * @version 1.0.0
 * @baseUrl http://localhost:8080/api
 *
 * API for Flyway application.
 *
 * ## Subdomain-based Organization Context
 *
 * Most endpoints require organization context, which is determined by the subdomain of the request.
 * For example, requests to `myorg.flyway.com/api/...` will operate in the context of the "myorg" organization.
 *
 * For local development, use the `X-Subdomain` header to specify the organization subdomain.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * @description Register a new user.
     *
     * @tags Users
     * @name CreateUserAccount
     * @summary Create user account
     * @request POST:/users
     */
    createUserAccount: (
      data: UserRegistrationRequest,
      params: RequestParams = {},
    ) =>
      this.request<AuthResponse, ErrorResponse>({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current user's information including their role and permissions for the current organization (determined by the subdomain in the Origin header). If not accessing via an organization subdomain, currentOrganizationRole will be null.
     *
     * @tags Users
     * @name GetCurrentUser
     * @summary Get current user info with role and permissions for current organization
     * @request GET:/users/me
     * @secure
     */
    getCurrentUser: (params: RequestParams = {}) =>
      this.request<CurrentUserResponse, ErrorResponse>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Sign in user. Context-aware based on subdomain for organization-scoped sessions.
     *
     * @tags Authentication
     * @name Login
     * @summary Sign in (context-aware based on subdomain)
     * @request POST:/auth/login
     */
    login: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<AuthResponse, ErrorResponse>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name RefreshToken
     * @summary Refresh JWT token
     * @request POST:/auth/refresh-token
     * @secure
     */
    refreshToken: (data: RefreshTokenRequest, params: RequestParams = {}) =>
      this.request<AuthResponse, ErrorResponse>({
        path: `/auth/refresh-token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Request a password reset link. Always returns success message regardless of whether the email exists (security best practice to prevent email enumeration).
     *
     * @tags Authentication
     * @name ForgotPassword
     * @summary Request password reset
     * @request POST:/auth/forgot-password
     */
    forgotPassword: (data: ForgotPasswordRequest, params: RequestParams = {}) =>
      this.request<ForgotPasswordResponse, any>({
        path: `/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reset password using the token received via email
     *
     * @tags Authentication
     * @name ResetPassword
     * @summary Reset password with token
     * @request POST:/auth/reset-password
     */
    resetPassword: (data: ResetPasswordRequest, params: RequestParams = {}) =>
      this.request<ResetPasswordResponse, ErrorResponse>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Initiates the signup process by sending a verification email to the user. If a valid (unexpired) token already exists for this email, returns success without sending a new email (idempotent).
     *
     * @tags Authentication
     * @name InitiateSignup
     * @summary Initiate signup (send verification email)
     * @request POST:/auth/signup/initiate
     */
    initiateSignup: (data: SignupInitiateRequest, params: RequestParams = {}) =>
      this.request<SignupInitiateResponse, ErrorResponse>({
        path: `/auth/signup/initiate`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Completes the signup process in two possible ways: **Regular Signup (invitation=false or omitted):** - Verifies the signup token sent via email - Creates user account with 'user' role - Automatically logs in the user and returns JWT tokens **Invitation-Based Signup (invitation=true):** - Verifies the invitation token sent via email - Creates user account with 'user' role - Automatically adds user to the organization with the role specified in the invitation - Automatically logs in the user and returns JWT tokens - Email is pre-verified via the invitation (no separate verification needed)
     *
     * @tags Authentication
     * @name CompleteSignup
     * @summary Complete signup with verification token or invitation
     * @request POST:/auth/signup/complete
     */
    completeSignup: (
      data: SignupCompleteRequest,
      query?: {
        /**
         * Set to true for invitation-based signup. When true, the token in the request body
         * is treated as an invitation token rather than a signup verification token.
         * @default false
         */
        invitation?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AuthResponse, ErrorResponse>({
        path: `/auth/signup/complete`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  organizations = {
    /**
     * @description Returns all organizations that the authenticated user is a member of. Does not require subdomain context.
     *
     * @tags Organizations
     * @name ListOrganizations
     * @summary List user's organizations
     * @request GET:/organizations
     * @secure
     */
    listOrganizations: (params: RequestParams = {}) =>
      this.request<OrganizationResponse[], ErrorResponse>({
        path: `/organizations`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Users can create up to 3 organizations. Does not require subdomain context.
     *
     * @tags Organizations
     * @name CreateOrganization
     * @summary Create a new organization
     * @request POST:/organizations
     * @secure
     */
    createOrganization: (
      data: CreateOrganizationRequest,
      params: RequestParams = {},
    ) =>
      this.request<OrganizationResponse, ErrorResponse>({
        path: `/organizations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get organization details based on the subdomain context. User must be a member of the organization.
     *
     * @tags Organizations
     * @name GetCurrentOrganization
     * @summary Get current organization details
     * @request GET:/organizations/current
     * @secure
     */
    getCurrentOrganization: (params: RequestParams = {}) =>
      this.request<OrganizationResponse, ErrorResponse>({
        path: `/organizations/current`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update organization fields. Supports partial updates (PATCH semantics) - only provided fields will be updated. Updatable fields: - name: Organization display name - logoUrl: URL to organization logo image Immutable fields (cannot be changed): - subdomain: Organization subdomain identifier - created_at, created_by_user_id: Creation metadata Note: At least one field must be provided in the request. Requires Owner/Admin role or organization.update permission.
     *
     * @tags Organizations
     * @name UpdateOrganization
     * @summary Update organization
     * @request PATCH:/organizations/current
     * @secure
     */
    updateOrganization: (
      data: UpdateOrganizationRequest,
      params: RequestParams = {},
    ) =>
      this.request<OrganizationResponse, ErrorResponse>({
        path: `/organizations/current`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  roles = {
    /**
     * @description Returns all global roles that can be assigned to organization members
     *
     * @tags Roles & Permissions
     * @name ListRoles
     * @summary List available roles
     * @request GET:/roles
     * @secure
     */
    listRoles: (params: RequestParams = {}) =>
      this.request<RoleResponse[], ErrorResponse>({
        path: `/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  invite = {
    /**
     * @description Send an invitation to add a new member to the organization. Organization context determined by subdomain. Requires Owner/Admin role.
     *
     * @tags Invitations
     * @name SendInvitation
     * @summary Send invitation
     * @request POST:/invite
     * @secure
     */
    sendInvitation: (
      data: CreateInvitationRequest,
      params: RequestParams = {},
    ) =>
      this.request<InvitationResponse, ErrorResponse>({
        path: `/invite`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  invitations = {
    /**
     * @description List all pending, non-expired invitations addressed to the authenticated user's email. Returns invitations from all organizations where the user has been invited.
     *
     * @tags Invitations
     * @name ListPendingInvitations
     * @summary List pending invitations
     * @request GET:/invitations
     * @secure
     */
    listPendingInvitations: (params: RequestParams = {}) =>
      this.request<InvitationResponse[], ErrorResponse>({
        path: `/invitations`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Revoke an invitation. Also deletes the associated user if created. Organization context determined by subdomain. Requires Owner/Admin role.
     *
     * @tags Invitations
     * @name RevokeInvitation
     * @summary Revoke invitation (deletes user too)
     * @request DELETE:/invitations/{invitationId}/revoke
     * @secure
     */
    revokeInvitation: (invitationId: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/invitations/${invitationId}/revoke`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Accept an invitation and join the organization. Requires authentication.
     *
     * @tags Invitations
     * @name AcceptInvitation
     * @summary Accept invitation and join organization
     * @request POST:/invitations/{invitationId}/accept
     * @secure
     */
    acceptInvitation: (invitationId: string, params: RequestParams = {}) =>
      this.request<InvitationResponse, ErrorResponse>({
        path: `/invitations/${invitationId}/accept`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Accept invitation using token from email link. Requires authentication.
     *
     * @tags Invitations
     * @name AcceptInvitationByToken
     * @summary Accept invitation by token
     * @request POST:/invitations/accept/{token}
     * @secure
     */
    acceptInvitationByToken: (token: string, params: RequestParams = {}) =>
      this.request<InvitationResponse, void | ErrorResponse>({
        path: `/invitations/accept/${token}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Reject invitation using token from email link. Requires authentication. Updates status to canceled.
     *
     * @tags Invitations
     * @name RejectInvitationByToken
     * @summary Reject invitation by token
     * @request POST:/invitations/reject/{token}
     * @secure
     */
    rejectInvitationByToken: (token: string, params: RequestParams = {}) =>
      this.request<InvitationResponse, void | ErrorResponse>({
        path: `/invitations/reject/${token}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancel or reject an invitation. Requires authentication. Updates invitation status to 'canceled' but keeps the user account.
     *
     * @tags Invitations
     * @name CancelInvitation
     * @summary Cancel/reject invitation (keeps user)
     * @request GET:/invitations/{invitationId}/cancel
     * @secure
     */
    cancelInvitation: (invitationId: string, params: RequestParams = {}) =>
      this.request<InvitationResponse, ErrorResponse>({
        path: `/invitations/${invitationId}/cancel`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  members = {
    /**
     * @description List all members of the organization. Organization context determined by subdomain. Any member can view.
     *
     * @tags Members
     * @name ListOrganizationMembers
     * @summary List organization members
     * @request GET:/members
     * @secure
     */
    listOrganizationMembers: (
      query?: {
        /**
         * Page number (0-based)
         * @min 0
         * @default 0
         */
        page?: number;
        /**
         * Number of items per page
         * @min 1
         * @max 100
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedOrganizationMemberResponse, ErrorResponse>({
        path: `/members`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a member's role. Organization context determined by subdomain. Requires Owner/Admin role.
     *
     * @tags Members/member
     * @name UpdateMemberRole
     * @summary Update member role
     * @request PATCH:/members/{membershipId}
     * @secure
     */
    updateMemberRole: (
      membershipId: string,
      data: UpdateMemberRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<OrganizationMemberResponse, ErrorResponse>({
        path: `/members/${membershipId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a member from the organization. Organization context determined by subdomain. Requires Owner/Admin role. Owner cannot remove themselves.
     *
     * @tags Members
     * @name RemoveMember
     * @summary Remove member
     * @request DELETE:/members/{membershipId}
     * @secure
     */
    removeMember: (membershipId: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/members/${membershipId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  apps = {
    /**
     * @description List all mobile applications for the organization. Organization context determined by subdomain. Any member can view.
     *
     * @tags Mobile Applications
     * @name ListApplications
     * @summary List applications
     * @request GET:/apps
     * @secure
     */
    listApplications: (params: RequestParams = {}) =>
      this.request<MobileApplicationResponse[], ErrorResponse>({
        path: `/apps`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new mobile application. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Mobile Applications
     * @name CreateApplication
     * @summary Create application
     * @request POST:/apps
     * @secure
     */
    createApplication: (
      data: CreateMobileApplicationRequest,
      params: RequestParams = {},
    ) =>
      this.request<MobileApplicationResponse, ErrorResponse>({
        path: `/apps`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get mobile application details. Organization context determined by subdomain. Any member can view.
     *
     * @tags Mobile Applications
     * @name GetApplication
     * @summary Get application details
     * @request GET:/apps/{appId}
     * @secure
     */
    getApplication: (appId: string, params: RequestParams = {}) =>
      this.request<MobileApplicationResponse, ErrorResponse>({
        path: `/apps/${appId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update mobile application. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Mobile Applications
     * @name UpdateApplication
     * @summary Update application
     * @request PATCH:/apps/{appId}
     * @secure
     */
    updateApplication: (
      appId: string,
      data: UpdateMobileApplicationRequest,
      params: RequestParams = {},
    ) =>
      this.request<MobileApplicationResponse, ErrorResponse>({
        path: `/apps/${appId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete mobile application. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Mobile Applications
     * @name DeleteApplication
     * @summary Delete application
     * @request DELETE:/apps/{appId}
     * @secure
     */
    deleteApplication: (appId: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/apps/${appId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  bundleId = {
    /**
     * @description Organization context determined by subdomain.
     *
     * @tags Builds
     * @name GetBuilds
     * @summary Get builds with pagination and sorting
     * @request GET:/{bundleId}/builds
     * @secure
     */
    getBuilds: (
      bundleId: string,
      query?: {
        /**
         * Page number (default 0)
         * @default 0
         */
        page?: number;
        /**
         * Page size (default 20)
         * @default 20
         */
        size?: number;
        /**
         * Sort direction by createdAt (default desc)
         * @default "desc"
         */
        sort?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedBuildResponse, ErrorResponse>({
        path: `/${bundleId}/builds`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Organization context determined by subdomain.
     *
     * @tags API Keys
     * @name GetApiKeys
     * @summary Get API keys with pagination and sorting
     * @request GET:/{bundleId}/api-keys
     * @secure
     */
    getApiKeys: (
      bundleId: string,
      query?: {
        /**
         * Page number (default 0)
         * @default 0
         */
        page?: number;
        /**
         * Page size (default 20)
         * @default 20
         */
        size?: number;
        /**
         * Sort direction by createdAt (default desc)
         * @default "desc"
         */
        sort?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedApiKeyResponse, ErrorResponse>({
        path: `/${bundleId}/api-keys`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Organization context determined by subdomain.
     *
     * @tags API Keys
     * @name CreateApiKey
     * @summary Create a new API key
     * @request POST:/{bundleId}/api-keys
     * @secure
     */
    createApiKey: (
      bundleId: string,
      data: CreateApiKeyRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiKeyResponse, ErrorResponse>({
        path: `/${bundleId}/api-keys`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Organization context determined by subdomain.
     *
     * @tags API Keys
     * @name DeleteApiKey
     * @summary Delete an API key
     * @request DELETE:/{bundleId}/api-keys/{keyId}
     * @secure
     */
    deleteApiKey: (
      bundleId: string,
      keyId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/${bundleId}/api-keys/${keyId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  builds = {
    /**
     * @description Organization context determined by subdomain.
     *
     * @tags Builds
     * @name DeleteBuild
     * @summary Delete a build by its UUID
     * @request DELETE:/builds/{buildId}
     * @secure
     */
    deleteBuild: (buildId: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/builds/${buildId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  v1 = {
    /**
     * @description Upload builds using API key authentication. This is the only way to upload builds and is designed for CI/CD pipelines. Requires X-API-Key header instead of JWT token. Organization context is determined by the API key.
     *
     * @tags Builds, API Keys
     * @name UploadBuildWithApiKey
     * @summary Upload a new build using API key authentication
     * @request POST:/v1/builds
     */
    uploadBuildWithApiKey: (
      data: {
        /** Git commit hash (unique identifier for the build) */
        commitHash: string;
        /** Git branch name */
        branchName: string;
        /** Git commit message */
        commitMessage?: string;
        /** Native app version (e.g., "1.0.0") */
        nativeVersion: string;
        /**
         * The build file (APK/IPA, max 30MB)
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<BuildResponse, ErrorResponse>({
        path: `/v1/builds`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  channels = {
    /**
     * @description List all channels for the organization. Organization context determined by subdomain. Any member can view.
     *
     * @tags Channels
     * @name ListChannels
     * @summary List channels
     * @request GET:/channels
     * @secure
     */
    listChannels: (
      query?: {
        /**
         * Page number (0-based)
         * @default 0
         */
        page?: number;
        /**
         * Number of items per page
         * @default 20
         */
        size?: number;
        /**
         * Sort direction by creation date
         * @default "desc"
         */
        sort?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedChannelResponse, ErrorResponse>({
        path: `/channels`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new channel. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Channels
     * @name CreateChannel
     * @summary Create channel
     * @request POST:/channels
     * @secure
     */
    createChannel: (data: CreateChannelRequest, params: RequestParams = {}) =>
      this.request<ChannelResponse, ErrorResponse>({
        path: `/channels`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get channel details. Organization context determined by subdomain. Any member can view.
     *
     * @tags Channels
     * @name GetChannel
     * @summary Get channel details
     * @request GET:/channels/{channelId}
     * @secure
     */
    getChannel: (channelId: string, params: RequestParams = {}) =>
      this.request<ChannelResponse, ErrorResponse>({
        path: `/channels/${channelId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update channel. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Channels
     * @name UpdateChannel
     * @summary Update channel
     * @request PATCH:/channels/{channelId}
     * @secure
     */
    updateChannel: (
      channelId: string,
      data: UpdateChannelRequest,
      params: RequestParams = {},
    ) =>
      this.request<ChannelResponse, ErrorResponse>({
        path: `/channels/${channelId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete channel. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Channels
     * @name DeleteChannel
     * @summary Delete channel
     * @request DELETE:/channels/{channelId}
     * @secure
     */
    deleteChannel: (channelId: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/channels/${channelId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  auditLogs = {
    /**
     * @description Retrieve paginated audit logs with optional filtering by action, resource type, user, and date range. Organization context determined by subdomain.
     *
     * @tags Audit Logs
     * @name GetAuditLogs
     * @summary Get audit logs for an organization
     * @request GET:/audit-logs
     * @secure
     */
    getAuditLogs: (
      query?: {
        /** Filter by action (e.g., MOBILE_APP_CREATED) */
        action?: string;
        /** Filter by resource type (e.g., MOBILE_APPLICATION) */
        resourceType?: string;
        /** Filter by user ID */
        userId?: string;
        /**
         * Filter by start date
         * @format date-time
         */
        startDate?: string;
        /**
         * Filter by end date
         * @format date-time
         */
        endDate?: string;
        /**
         * Page number (0-indexed)
         * @default 0
         */
        page?: number;
        /**
         * Page size
         * @default 20
         */
        size?: number;
        /**
         * Sort order by created date
         * @default "desc"
         */
        sort?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedAuditLogResponse, ErrorResponse>({
        path: `/audit-logs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
