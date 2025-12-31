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

/** Type discriminator for merged member/invitation list */
export type MemberOrInvitationType = "MEMBER" | "INVITATION";

/** Permission code enum representing all available permissions in the system */
export type PermissionCode =
  | "organization.update"
  | "organization.view"
  | "member.view"
  | "member.invite"
  | "member.remove"
  | "member.update_role"
  | "project.read"
  | "project.create"
  | "project.update"
  | "project.delete"
  | "environment.view"
  | "environment.create"
  | "environment.update"
  | "environment.delete"
  | "changelog.view"
  | "changelog.create"
  | "changelog.update"
  | "changelog.delete"
  | "event.view"
  | "event.create"
  | "event.update"
  | "event.delete"
  | "analytics.view"
  | "support.operations"
  | "webhook.view"
  | "webhook.create"
  | "webhook.update"
  | "webhook.delete";

/** The framework or technology type of the project */
export type ProjectType =
  | "react"
  | "angular"
  | "vue"
  | "nextjs"
  | "ionic"
  | "flutter"
  | "others";

/** Event types that can trigger webhook deliveries */
export type WebhookEventTypeEnum =
  | "invitation_received"
  | "build_completed"
  | "member_joined"
  | "member_removed"
  | "log_rate_exceeded";

/** Type of notification */
export type NotificationTypeEnum =
  | "invitation_received"
  | "build_completed"
  | "member_joined"
  | "member_removed"
  | "log_rate_exceeded";

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

/** Request to create a new webhook subscription */
export interface CreateWebhookRequest {
  /**
   * Human-readable name for the webhook
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * The URL to send webhook payloads to
   * @format uri
   * @maxLength 2048
   */
  url: string;
  /**
   * Optional secret for HMAC signature verification
   * @maxLength 255
   */
  secret?: string;
  /**
   * List of events this webhook should receive
   * @minItems 1
   */
  events: WebhookEventTypeEnum[];
  /**
   * Whether the webhook is enabled
   * @default true
   */
  enabled?: boolean;
}

/** Request to update an existing webhook subscription */
export interface UpdateWebhookRequest {
  /**
   * Human-readable name for the webhook
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /**
   * The URL to send webhook payloads to
   * @format uri
   * @maxLength 2048
   */
  url?: string;
  /**
   * Secret for HMAC signature verification (send empty string to clear)
   * @maxLength 255
   */
  secret?: string;
  /**
   * List of events this webhook should receive
   * @minItems 1
   */
  events?: WebhookEventTypeEnum[];
  /** Whether the webhook is enabled */
  enabled?: boolean;
}

/** Webhook subscription details */
export interface WebhookResponse {
  /** Unique identifier for the webhook */
  id: string;
  /** Human-readable name for the webhook */
  name: string;
  /** The URL webhook payloads are sent to */
  url: string;
  /** List of events this webhook receives */
  events: WebhookEventTypeEnum[];
  /** Whether the webhook is enabled */
  enabled: boolean;
  /**
   * Timestamp of last successful delivery
   * @format date-time
   */
  lastSuccessAt?: string;
  /**
   * Timestamp of last failed delivery
   * @format date-time
   */
  lastFailureAt?: string;
  /** Number of consecutive failures */
  failureCount?: number;
  /**
   * When the webhook was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the webhook was last updated
   * @format date-time
   */
  updatedAt?: string;
}

/** Webhook delivery record */
export interface WebhookDeliveryResponse {
  /** Unique identifier for the delivery */
  id: string;
  /** ID of the webhook subscription */
  webhookId: string;
  /** Type of event that triggered the delivery */
  eventType: string;
  /** HTTP status code of the response */
  statusCode?: number;
  /** Whether the delivery was successful */
  success: boolean;
  /** The payload that was sent */
  requestPayload?: Record<string, any>;
  /** Response body from the webhook endpoint (truncated) */
  responseBody?: string;
  /** Duration of the request in milliseconds */
  durationMs?: number;
  /** Error message if the delivery failed */
  errorMessage?: string;
  /**
   * When the delivery was attempted
   * @format date-time
   */
  createdAt: string;
}

/** Paginated list of webhooks */
export interface PaginatedWebhookResponse {
  data: WebhookResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Paginated list of webhook deliveries */
export interface PaginatedWebhookDeliveryResponse {
  data: WebhookDeliveryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

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
  /** Organization subdomain (unique identifier used in URLs) */
  subdomain: string;
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
  /** Role Id */
  role: string;
}

/** Request to update an invitation */
export interface UpdateInvitationRequest {
  /** New role id */
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

/** Request to create a new project */
export interface CreateProjectRequest {
  /** Unique project key identifier (e.g., com.example.app) */
  projectKey: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** The framework or technology type of the project */
  projectType: ProjectType;
}

/** Request to update a project */
export interface UpdateProjectRequest {
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
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

/** Request to update user profile */
export interface UpdateUserRequest {
  /**
   * User's first name
   * @minLength 1
   * @maxLength 100
   */
  firstName?: string;
  /**
   * User's last name
   * @minLength 1
   * @maxLength 100
   */
  lastName?: string;
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
}

/** Invitation status information */
export interface InvitationStatusResponse {
  /** Status ID */
  id: string;
  /** Invitation status */
  status: InvitationStatusEnum;
}

/** Minimal pending invitation information for member list */
export interface PendingInvitationSummary {
  /** Invitation ID */
  id: string;
  /**
   * Email of the invited user
   * @format email
   */
  email: string;
  /** Role information (roles are now global across all organizations) */
  role: RoleResponse;
  /** User information */
  invitedBy?: UserResponse | null;
  /**
   * When the invitation was created
   * @format date-time
   */
  createdAt: string;
}

/** Unified item representing either a member or pending invitation */
export interface MemberOrInvitationItem {
  /** Member ID or Invitation ID */
  id: string;
  /** Type discriminator for merged member/invitation list */
  type: MemberOrInvitationType;
  /**
   * Email of the user (from user record for members, invitation email for invitations)
   * @format email
   */
  email: string;
  /** Role information (roles are now global across all organizations) */
  role: RoleResponse;
  /**
   * Enabled at timestamp for members, created at for invitations
   * @format date-time
   */
  timestamp: string;
  /** Full user details (only for members, null for invitations) */
  user?: UserResponse | null;
}

/** Paginated merged list of members and pending invitations */
export interface PaginatedMemberOrInvitationResponse {
  /** Array of members and invitations merged and sorted by timestamp */
  data: MemberOrInvitationItem[];
  /** Total number of items (members + invitations) across all pages */
  total: number;
  /** Number of items in this page */
  count: number;
  /** Maximum items per page */
  itemsPerPage: number;
}

/** Paginated members data */
export interface MembersData {
  /** Array of members for this page */
  data: OrganizationMemberResponse[];
  /** Total number of members across all pages */
  total: number;
  /** Number of members in this page */
  count: number;
  /** Maximum items per page */
  itemsPerPage: number;
}

/** Paginated pending invitations data */
export interface InvitationsData {
  /** Array of pending invitations for this page */
  data: PendingInvitationSummary[];
  /** Total number of pending invitations across all pages */
  total: number;
  /** Number of invitations in this page */
  count: number;
  /** Maximum items per page */
  itemsPerPage: number;
}

/** Combined response with members and pending invitations */
export interface MembersAndInvitationsResponse {
  /** Paginated members data */
  members: MembersData;
  /** Paginated pending invitations data */
  invitations: InvitationsData;
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
   * When the member enabled their account
   * @format date-time
   */
  enabledAt: string;
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

/** Project information */
export interface ProjectResponse {
  /** Project ID */
  id: string;
  /** Unique project key identifier */
  projectKey: string;
  /** Organization ID that owns this project */
  organizationId: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** The framework or technology type of the project */
  projectType: ProjectType;
  /** User ID who created the project */
  createdBy: string;
  /**
   * When the project was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the project was last updated
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
  /** Project key identifier */
  projectKey: string;
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

/** Request to create a new environment */
export interface CreateEnvironmentRequest {
  /** Environment name */
  name: string;
  /** Environment description */
  description?: string;
}

/** Request to update an environment */
export interface UpdateEnvironmentRequest {
  /** Environment name */
  name?: string;
  /** Environment description */
  description?: string;
}

/** Request to create a new changelog */
export interface CreateChangelogRequest {
  /**
   * Version string for this changelog (e.g., "1.0.0", "2.3.1")
   * @minLength 1
   * @maxLength 100
   */
  version: string;
  /** Changelog content in Markdown format */
  markdown: string;
  /**
   * Whether the changelog is published
   * @default false
   */
  isPublished?: boolean;
}

/** Request to update a changelog */
export interface UpdateChangelogRequest {
  /**
   * Version string for this changelog
   * @minLength 1
   * @maxLength 100
   */
  version?: string;
  /** Changelog content in Markdown format */
  markdown?: string;
  /** Whether the changelog is published */
  isPublished?: boolean;
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
  /** Project key this API key is for */
  projectKey: string;
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

/** Environment information */
export interface EnvironmentResponse {
  /** Environment name (unique identifier within project) */
  name: string;
  /** Environment description */
  description?: string;
  /** Project ID */
  projectId: string;
  /**
   * When the environment was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the environment was last updated
   * @format date-time
   */
  updatedAt: string;
}

/** Paginated environment response */
export interface PaginatedEnvironmentResponse {
  /** List of environments */
  data: EnvironmentResponse[];
  /** Current page number */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of environments */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/** Changelog information */
export interface ChangelogResponse {
  /** Changelog ID */
  id: string;
  /** Version string for this changelog */
  version: string;
  /** Changelog content in Markdown format */
  markdown: string;
  /** Whether the changelog is published */
  isPublished: boolean;
  /** Project ID */
  projectId: string;
  /**
   * When the changelog was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the changelog was last updated
   * @format date-time
   */
  updatedAt: string;
}

/** Paginated changelog response */
export interface PaginatedChangelogResponse {
  /** List of changelogs */
  data: ChangelogResponse[];
  /** Current page number */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of changelogs */
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
  /** Action performed (e.g., PROJECT_CREATED, BUILD_UPLOADED) */
  action: string;
  /** Type of resource affected (e.g., PROJECT, BUILD) */
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

/** Notification information */
export interface NotificationResponse {
  /** Notification ID */
  id: string;
  /** Type of notification */
  type: NotificationTypeEnum;
  /** Notification title */
  title: string;
  /** Notification message body */
  message?: string;
  /** Whether the notification has been read */
  isRead: boolean;
  /** ID of the related resource (invitation_id, build_id, etc.) */
  resourceId?: string;
  /**
   * When the notification was created
   * @format date-time
   */
  createdAt: string;
}

/** Paginated notification response with unread count */
export interface PaginatedNotificationResponse {
  /** Array of notifications for this page */
  data: NotificationResponse[];
  /** Total number of unread notifications */
  unreadCount: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of notifications */
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

/** Request to log a custom event from SDK */
export interface LogEventRequest {
  /**
   * Environment name (e.g., production, development)
   * @example "production"
   */
  environment: string;
  /**
   * Event name
   * @example "New Subscription"
   */
  event: string;
  /**
   * Optional channel/category for grouping events
   * @example "payments"
   */
  channel?: string;
  /**
   * External user identifier from client system
   * @example "user-123"
   */
  user_id?: string;
  /**
   * Emoji icon for the event
   * @example "💰"
   */
  icon?: string;
  /**
   * Whether to trigger notifications
   * @default false
   */
  notify?: boolean;
  /**
   * Optional event description
   * @example "User subscribed to premium plan"
   */
  description?: string;
  /**
   * Key-value metadata for the event
   * @example {"plan":"premium","cycle":"monthly","trial":false}
   */
  tags?: Record<string, any>;
  /**
   * When the event occurred (defaults to server time if not provided)
   * @format date-time
   */
  timestamp?: string;
}

/** Response after logging an event */
export interface LogEventResponse {
  /**
   * Unique event identifier
   * @format uuid
   */
  id: string;
  /** Event name */
  event: string;
  /** Environment name */
  environment: string;
  /**
   * When the event was recorded
   * @format date-time
   */
  timestamp: string;
}

/** Full custom event details */
export interface CustomEventResponse {
  /**
   * Unique event identifier
   * @format uuid
   */
  id: string;
  /** Event name */
  event: string;
  /** Environment name */
  environment: string;
  /** Channel/category */
  channel?: string;
  /** External user identifier */
  userId?: string;
  /** Emoji icon */
  icon?: string;
  /** Whether notifications were triggered */
  notify?: boolean;
  /** Key-value metadata */
  tags?: Record<string, any>;
  /** Event description */
  description?: string;
  /**
   * When the event occurred
   * @format date-time
   */
  timestamp: string;
  /**
   * When the event was recorded on server
   * @format date-time
   */
  createdAt: string;
}

/** Paginated list of custom events */
export interface PaginatedCustomEventResponse {
  /** Array of events for this page */
  data: CustomEventResponse[];
  /** Current page number */
  page: number;
  /** Items per page */
  size: number;
  /** Total number of items */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/** A single group in event statistics */
export interface EventStatsGroup {
  /** Group key (event name, environment, channel, etc.) */
  key: string;
  /** Number of events in this group */
  count: number;
  /**
   * Percentage of total events
   * @format double
   */
  percentage: number;
}

/** Aggregated event statistics */
export interface EventStatsResponse {
  /**
   * Start of the time range
   * @format date-time
   */
  from?: string;
  /**
   * End of the time range
   * @format date-time
   */
  to?: string;
  /** Total number of events in range */
  totalEvents: number;
  /** Number of unique users */
  uniqueUsers: number;
  /** Grouped event counts */
  groups: EventStatsGroup[];
}

/** A single data point in the timeline */
export interface EventTimelinePoint {
  /**
   * Time bucket start
   * @format date-time
   */
  timestamp: string;
  /** Number of events in this bucket */
  count: number;
}

/** Event counts over time for charts */
export interface EventTimelineResponse {
  /** Time interval (hour, day, week, month) */
  interval: "hour" | "day" | "week" | "month";
  /** Timeline data points */
  data: EventTimelinePoint[];
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

    /**
     * @description Updates the current user's first name and/or last name.
     *
     * @tags Users
     * @name UpdateCurrentUser
     * @summary Update current user's profile
     * @request PATCH:/users/me
     * @secure
     */
    updateCurrentUser: (data: UpdateUserRequest, params: RequestParams = {}) =>
      this.request<CurrentUserResponse, ErrorResponse>({
        path: `/users/me`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
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
     * @description Retrieve an invitation by ID or token. Must belong to authenticated user. Use query parameter 'type' to specify lookup method: - type=id (default): lookup by invitation ID - type=token: lookup by invitation token
     *
     * @tags Invitations
     * @name GetInvitation
     * @summary Get invitation by ID or token
     * @request GET:/invitations/{identifier}
     * @secure
     */
    getInvitation: (
      identifier: string,
      query?: {
        /**
         * Lookup method (id or token)
         * @default "id"
         */
        type?: "id" | "token";
      },
      params: RequestParams = {},
    ) =>
      this.request<InvitationResponse, ErrorResponse>({
        path: `/invitations/${identifier}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the role of a pending invitation. Only pending invitations can be updated. Requires member.invite permission.
     *
     * @tags Invitations
     * @name UpdateInvitation
     * @summary Update invitation role
     * @request PATCH:/invitations/{invitationId}
     * @secure
     */
    updateInvitation: (
      invitationId: string,
      data: UpdateInvitationRequest,
      params: RequestParams = {},
    ) =>
      this.request<InvitationResponse, ErrorResponse>({
        path: `/invitations/${invitationId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
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
      this.request<PaginatedMemberOrInvitationResponse, ErrorResponse>({
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
  projects = {
    /**
     * @description List all projects for the organization. Organization context determined by subdomain. Any member can view.
     *
     * @tags Projects
     * @name ListProjects
     * @summary List projects
     * @request GET:/projects
     * @secure
     */
    listProjects: (params: RequestParams = {}) =>
      this.request<ProjectResponse[], ErrorResponse>({
        path: `/projects`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new project. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Projects
     * @name CreateProject
     * @summary Create project
     * @request POST:/projects
     * @secure
     */
    createProject: (data: CreateProjectRequest, params: RequestParams = {}) =>
      this.request<ProjectResponse, ErrorResponse>({
        path: `/projects`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get project details. Organization context determined by subdomain. Any member can view.
     *
     * @tags Projects
     * @name GetProject
     * @summary Get project details
     * @request GET:/projects/{projectKey}
     * @secure
     */
    getProject: (projectKey: string, params: RequestParams = {}) =>
      this.request<ProjectResponse, ErrorResponse>({
        path: `/projects/${projectKey}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update project. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Projects
     * @name UpdateProject
     * @summary Update project
     * @request PATCH:/projects/{projectKey}
     * @secure
     */
    updateProject: (
      projectKey: string,
      data: UpdateProjectRequest,
      params: RequestParams = {},
    ) =>
      this.request<ProjectResponse, ErrorResponse>({
        path: `/projects/${projectKey}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete project. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Projects
     * @name DeleteProject
     * @summary Delete project
     * @request DELETE:/projects/{projectKey}
     * @secure
     */
    deleteProject: (projectKey: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/projects/${projectKey}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Organization context determined by subdomain.
     *
     * @tags Builds
     * @name GetBuilds
     * @summary Get builds with pagination and sorting
     * @request GET:/projects/{projectKey}/builds
     * @secure
     */
    getBuilds: (
      projectKey: string,
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
        path: `/projects/${projectKey}/builds`,
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
     * @request GET:/projects/{projectKey}/api-keys
     * @secure
     */
    getApiKeys: (
      projectKey: string,
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
        path: `/projects/${projectKey}/api-keys`,
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
     * @request POST:/projects/{projectKey}/api-keys
     * @secure
     */
    createApiKey: (
      projectKey: string,
      data: CreateApiKeyRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiKeyResponse, ErrorResponse>({
        path: `/projects/${projectKey}/api-keys`,
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
     * @request DELETE:/projects/{projectKey}/api-keys/{keyId}
     * @secure
     */
    deleteApiKey: (
      projectKey: string,
      keyId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/projects/${projectKey}/api-keys/${keyId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description List all environments for a project. Organization context determined by subdomain. Any member can view.
     *
     * @tags Environments
     * @name ListEnvironments
     * @summary List environments
     * @request GET:/projects/{projectKey}/environments
     * @secure
     */
    listEnvironments: (
      projectKey: string,
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
      this.request<PaginatedEnvironmentResponse, ErrorResponse>({
        path: `/projects/${projectKey}/environments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new environment in a project. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Environments
     * @name CreateEnvironment
     * @summary Create environment
     * @request POST:/projects/{projectKey}/environments
     * @secure
     */
    createEnvironment: (
      projectKey: string,
      data: CreateEnvironmentRequest,
      params: RequestParams = {},
    ) =>
      this.request<EnvironmentResponse, ErrorResponse>({
        path: `/projects/${projectKey}/environments`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get environment details within a project. Organization context determined by subdomain. Any member can view.
     *
     * @tags Environments
     * @name GetEnvironment
     * @summary Get environment details
     * @request GET:/projects/{projectKey}/environments/{environmentName}
     * @secure
     */
    getEnvironment: (
      projectKey: string,
      environmentName: string,
      params: RequestParams = {},
    ) =>
      this.request<EnvironmentResponse, ErrorResponse>({
        path: `/projects/${projectKey}/environments/${environmentName}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update environment within a project. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Environments
     * @name UpdateEnvironment
     * @summary Update environment
     * @request PATCH:/projects/{projectKey}/environments/{environmentName}
     * @secure
     */
    updateEnvironment: (
      projectKey: string,
      environmentName: string,
      data: UpdateEnvironmentRequest,
      params: RequestParams = {},
    ) =>
      this.request<EnvironmentResponse, ErrorResponse>({
        path: `/projects/${projectKey}/environments/${environmentName}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete environment within a project. Organization context determined by subdomain. Requires Developer+ role.
     *
     * @tags Environments
     * @name DeleteEnvironment
     * @summary Delete environment
     * @request DELETE:/projects/{projectKey}/environments/{environmentName}
     * @secure
     */
    deleteEnvironment: (
      projectKey: string,
      environmentName: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/projects/${projectKey}/environments/${environmentName}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description List all changelogs for a project. Organization context determined by subdomain.
     *
     * @tags Changelogs
     * @name ListChangelogs
     * @summary List changelogs
     * @request GET:/projects/{projectKey}/changelogs
     * @secure
     */
    listChangelogs: (
      projectKey: string,
      query?: {
        /**
         * Page number (0-based)
         * @default 0
         */
        page?: number;
        /**
         * Number of items per page
         * @default 10
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
      this.request<PaginatedChangelogResponse, ErrorResponse>({
        path: `/projects/${projectKey}/changelogs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new changelog in a project. Organization context determined by subdomain.
     *
     * @tags Changelogs
     * @name CreateChangelog
     * @summary Create changelog
     * @request POST:/projects/{projectKey}/changelogs
     * @secure
     */
    createChangelog: (
      projectKey: string,
      data: CreateChangelogRequest,
      params: RequestParams = {},
    ) =>
      this.request<ChangelogResponse, ErrorResponse>({
        path: `/projects/${projectKey}/changelogs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get changelog details. Organization context determined by subdomain.
     *
     * @tags Changelogs
     * @name GetChangelog
     * @summary Get changelog
     * @request GET:/projects/{projectKey}/changelogs/{changelogId}
     * @secure
     */
    getChangelog: (
      projectKey: string,
      changelogId: string,
      params: RequestParams = {},
    ) =>
      this.request<ChangelogResponse, ErrorResponse>({
        path: `/projects/${projectKey}/changelogs/${changelogId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update changelog within a project. Organization context determined by subdomain.
     *
     * @tags Changelogs
     * @name UpdateChangelog
     * @summary Update changelog
     * @request PUT:/projects/{projectKey}/changelogs/{changelogId}
     * @secure
     */
    updateChangelog: (
      projectKey: string,
      changelogId: string,
      data: UpdateChangelogRequest,
      params: RequestParams = {},
    ) =>
      this.request<ChangelogResponse, ErrorResponse>({
        path: `/projects/${projectKey}/changelogs/${changelogId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete changelog within a project. Organization context determined by subdomain.
     *
     * @tags Changelogs
     * @name DeleteChangelog
     * @summary Delete changelog
     * @request DELETE:/projects/{projectKey}/changelogs/{changelogId}
     * @secure
     */
    deleteChangelog: (
      projectKey: string,
      changelogId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/projects/${projectKey}/changelogs/${changelogId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description List custom events for a project with pagination and filters. Requires event.view permission.
     *
     * @tags Event Analytics
     * @name ListEvents
     * @summary List custom events
     * @request GET:/projects/{projectKey}/events
     * @secure
     */
    listEvents: (
      projectKey: string,
      query?: {
        /** Filter by environment */
        environment?: string;
        /** Filter by event name */
        event?: string;
        /** Filter by channel */
        channel?: string;
        /** Filter by user ID */
        user_id?: string;
        /**
         * Start of time range
         * @format date-time
         */
        from?: string;
        /**
         * End of time range
         * @format date-time
         */
        to?: string;
        /**
         * Page number
         * @default 0
         */
        page?: number;
        /**
         * Page size
         * @default 50
         */
        size?: number;
        /**
         * Sort order by timestamp
         * @default "desc"
         */
        sort?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCustomEventResponse, ErrorResponse>({
        path: `/projects/${projectKey}/events`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get details of a specific custom event. Requires event.view permission.
     *
     * @tags Event Analytics
     * @name GetEvent
     * @summary Get event details
     * @request GET:/projects/{projectKey}/events/{eventId}
     * @secure
     */
    getEvent: (
      projectKey: string,
      eventId: string,
      params: RequestParams = {},
    ) =>
      this.request<CustomEventResponse, ErrorResponse>({
        path: `/projects/${projectKey}/events/${eventId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get aggregated event statistics with grouping. Requires event.view permission.
     *
     * @tags Event Analytics
     * @name GetEventStats
     * @summary Get aggregated event statistics
     * @request GET:/projects/{projectKey}/events/stats
     * @secure
     */
    getEventStats: (
      projectKey: string,
      query?: {
        /**
         * Field to group by
         * @default "event"
         */
        group_by?: "event" | "environment" | "channel" | "user_id";
        /** Filter by environment */
        environment?: string;
        /** Filter by channel */
        channel?: string;
        /**
         * Start of time range
         * @format date-time
         */
        from?: string;
        /**
         * End of time range
         * @format date-time
         */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventStatsResponse, ErrorResponse>({
        path: `/projects/${projectKey}/events/stats`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get event counts over time intervals for chart visualization. Requires event.view permission.
     *
     * @tags Event Analytics
     * @name GetEventTimeline
     * @summary Get event timeline for charts
     * @request GET:/projects/{projectKey}/events/timeline
     * @secure
     */
    getEventTimeline: (
      projectKey: string,
      query?: {
        /**
         * Time interval for grouping
         * @default "day"
         */
        interval?: "hour" | "day" | "week" | "month";
        /** Filter by event name */
        event?: string;
        /** Filter by environment */
        environment?: string;
        /**
         * Start of time range
         * @format date-time
         */
        from?: string;
        /**
         * End of time range
         * @format date-time
         */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventTimelineResponse, ErrorResponse>({
        path: `/projects/${projectKey}/events/timeline`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List all custom events for a specific user ID within a project. Requires event.view permission.
     *
     * @tags Event Analytics
     * @name ListEventsByUserId
     * @summary List events by user ID
     * @request GET:/projects/{projectKey}/events/users/{userId}
     * @secure
     */
    listEventsByUserId: (
      projectKey: string,
      userId: string,
      query?: {
        /** Filter by event name (partial match) */
        event?: string;
        /**
         * Start of time range
         * @format date-time
         */
        from?: string;
        /**
         * End of time range
         * @format date-time
         */
        to?: string;
        /**
         * Page number
         * @default 0
         */
        page?: number;
        /**
         * Page size
         * @default 50
         */
        size?: number;
        /**
         * Sort order by timestamp
         * @default "desc"
         */
        sort?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCustomEventResponse, ErrorResponse>({
        path: `/projects/${projectKey}/events/users/${userId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
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

    /**
     * @description Log a custom event from SDK. Authentication is via API key (Bearer token). The project is automatically determined from the API key.
     *
     * @tags Events
     * @name LogEvent
     * @summary Log a custom event
     * @request POST:/v1/logs
     * @secure
     */
    logEvent: (data: LogEventRequest, params: RequestParams = {}) =>
      this.request<LogEventResponse, ErrorResponse>({
        path: `/v1/logs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
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
        /** Filter by action (e.g., PROJECT_CREATED) */
        action?: string;
        /** Filter by resource type (e.g., PROJECT) */
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
  notifications = {
    /**
     * @description Get paginated list of notifications for the authenticated user with unread count.
     *
     * @tags Notifications
     * @name GetNotifications
     * @summary Get user notifications
     * @request GET:/notifications
     * @secure
     */
    getNotifications: (
      query?: {
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
         * If true, only return unread notifications
         * @default false
         */
        unreadOnly?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedNotificationResponse, ErrorResponse>({
        path: `/notifications`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark a single notification as read.
     *
     * @tags Notifications
     * @name MarkNotificationAsRead
     * @summary Mark notification as read
     * @request PATCH:/notifications/{notificationId}/read
     * @secure
     */
    markNotificationAsRead: (
      notificationId: string,
      params: RequestParams = {},
    ) =>
      this.request<NotificationResponse, ErrorResponse>({
        path: `/notifications/${notificationId}/read`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark all notifications for the authenticated user as read.
     *
     * @tags Notifications
     * @name MarkAllNotificationsAsRead
     * @summary Mark all notifications as read
     * @request PATCH:/notifications/read-all
     * @secure
     */
    markAllNotificationsAsRead: (params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/notifications/read-all`,
        method: "PATCH",
        secure: true,
        ...params,
      }),
  };
  webhooks = {
    /**
     * @description List all webhook subscriptions for the current organization. Requires webhook.view permission.
     *
     * @tags Webhooks
     * @name ListWebhooks
     * @summary List webhooks
     * @request GET:/webhooks
     * @secure
     */
    listWebhooks: (
      query?: {
        /** @default 0 */
        page?: number;
        /** @default 20 */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedWebhookResponse, ErrorResponse>({
        path: `/webhooks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new webhook subscription for the current organization. Requires webhook.create permission.
     *
     * @tags Webhooks
     * @name CreateWebhook
     * @summary Create webhook
     * @request POST:/webhooks
     * @secure
     */
    createWebhook: (data: CreateWebhookRequest, params: RequestParams = {}) =>
      this.request<WebhookResponse, ErrorResponse>({
        path: `/webhooks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get details of a specific webhook subscription. Requires webhook.view permission.
     *
     * @tags Webhooks
     * @name GetWebhook
     * @summary Get webhook details
     * @request GET:/webhooks/{webhookId}
     * @secure
     */
    getWebhook: (webhookId: string, params: RequestParams = {}) =>
      this.request<WebhookResponse, ErrorResponse>({
        path: `/webhooks/${webhookId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing webhook subscription. Requires webhook.update permission.
     *
     * @tags Webhooks
     * @name UpdateWebhook
     * @summary Update webhook
     * @request PATCH:/webhooks/{webhookId}
     * @secure
     */
    updateWebhook: (
      webhookId: string,
      data: UpdateWebhookRequest,
      params: RequestParams = {},
    ) =>
      this.request<WebhookResponse, ErrorResponse>({
        path: `/webhooks/${webhookId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a webhook subscription. Requires webhook.delete permission.
     *
     * @tags Webhooks
     * @name DeleteWebhook
     * @summary Delete webhook
     * @request DELETE:/webhooks/{webhookId}
     * @secure
     */
    deleteWebhook: (webhookId: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description List delivery attempts for a specific webhook. Requires webhook.view permission.
     *
     * @tags Webhooks
     * @name ListWebhookDeliveries
     * @summary List webhook deliveries
     * @request GET:/webhooks/{webhookId}/deliveries
     * @secure
     */
    listWebhookDeliveries: (
      webhookId: string,
      query?: {
        /** @default 0 */
        page?: number;
        /** @default 20 */
        size?: number;
        /** Filter by success status */
        success?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedWebhookDeliveryResponse, ErrorResponse>({
        path: `/webhooks/${webhookId}/deliveries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Sends a test "Hello World" payload to the webhook endpoint and returns the delivery result. Requires webhook.update permission.
     *
     * @tags Webhooks
     * @name TestWebhook
     * @summary Test a webhook
     * @request POST:/webhooks/{webhookId}/test
     * @secure
     */
    testWebhook: (webhookId: string, params: RequestParams = {}) =>
      this.request<WebhookDeliveryResponse, ErrorResponse>({
        path: `/webhooks/${webhookId}/test`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
