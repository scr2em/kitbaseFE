import { Popover, ActionIcon, Badge, Loader, ScrollArea, Tooltip, Button } from '@mantine/core';
import { useDisclosure, useIntersection } from '@mantine/hooks';
import { Bell, Check, CheckCheck, UserCheck, UserX, Package, UserPlus, UserMinus, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { match } from 'ts-pattern';
import {
  useNotificationsInfiniteQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  NOTIFICATIONS_QUERY_KEY,
} from '../api/queries/notifications';
import { useAcceptInvitationMutation, useCancelInvitationMutation, useInvitationQuery, INVITATIONS_QUERY_KEY } from '../api/queries/invitation';
import { useQueryClient } from '@tanstack/react-query';
import type { NotificationResponse } from '../../generated-api';

// Shared props for all notification items
type BaseNotificationItemProps = {
  notification: NotificationResponse;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
};

// Extended props for invitation notifications
type InvitationNotificationItemProps = BaseNotificationItemProps & {
  onAcceptInvitation: (invitationId: string) => void;
  onRejectInvitation: (invitationId: string) => void;
  isAcceptingInvitation: boolean;
  isRejectingInvitation: boolean;
};

function formatDate(dateString: string, t: (key: string, options?: Record<string, unknown>) => string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return t('notifications.just_now');
  if (diffInMinutes < 60) return t('notifications.minutes_ago', { count: diffInMinutes });
  if (diffInMinutes < 1440) return t('notifications.hours_ago', { count: Math.floor(diffInMinutes / 60) });
  return t('notifications.days_ago', { count: Math.floor(diffInMinutes / 1440) });
}

function NotificationWrapper({
  notification,
  icon,
  actions,
}: {
  notification: NotificationResponse;
  icon: React.ReactNode;
  actions: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`p-3 border-b border-gray-100 last:border-b-0 transition-colors ${
        notification.isRead ? 'bg-white' : 'bg-blue-50/50'
      }`}
    >
      <div className="flex gap-3">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm ${notification.isRead ? 'font-normal' : 'font-semibold'}`}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
            )}
          </div>
          {notification.message && (
            <div className="text-sm text-gray-600 mt-1 prose prose-sm max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
              <ReactMarkdown>{notification.message}</ReactMarkdown>
            </div>
          )}

{actions}

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {formatDate(notification.createdAt, t)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkAsReadAction({
  notificationId,
  onMarkAsRead,
  isMarkingAsRead,
}: {
  notificationId: string;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Tooltip label={t('notifications.mark_as_read')} position="left">
      <ActionIcon
        variant="subtle"
        size="xs"
        color="blue"
        onClick={() => onMarkAsRead(notificationId)}
        disabled={isMarkingAsRead}
      >
        <Check size={14} />
      </ActionIcon>
    </Tooltip>
  );
}

// ============================================
// Invitation Received Notification
// ============================================
function InvitationReceivedNotificationItem({
  notification,
  onAcceptInvitation,
  onRejectInvitation,
  isAcceptingInvitation,
  isRejectingInvitation,
}: InvitationNotificationItemProps) {
  const { t } = useTranslation();
  const { data: invitation, isLoading: isLoadingInvitation } = useInvitationQuery(notification.resourceId);

  const icon = (
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <UserPlus size={16} className="text-blue-600" />
    </div>
  );

  const renderActions = () => {
    if (!notification.resourceId) return null;

    if (isLoadingInvitation) {
      return (
        <div className="flex items-center gap-2 mt-2">
          <Loader size="xs" />
        </div>
      );
    }

    const invitationStatus = invitation?.status?.status;

    if (invitationStatus === 'accepted') {
      return (
        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
          <Check size={14} />
          <span>{t('notifications.invitation_accepted')}</span>
        </div>
      );
    }

    if (invitationStatus === 'canceled') {
      return (
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
          <UserX size={14} />
          <span>{t('notifications.invitation_declined')}</span>
        </div>
      );
    }

    if (invitationStatus === 'expired') {
      return (
        <div className="flex items-center gap-1 mt-2 text-sm text-amber-600">
          <span>{t('notifications.invitation_expired')}</span>
        </div>
      );
    }

    // Show action buttons only for pending invitations
    if (invitationStatus === 'pending') {
      return (
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="filled"
            size="xs"
            color="green"
            leftSection={<UserCheck size={14} />}
            onClick={() => onAcceptInvitation(notification.resourceId!)}
            loading={isAcceptingInvitation}
            disabled={isRejectingInvitation}
          >
            {t('notifications.accept_invitation')}
          </Button>
          <Button
            variant="outline"
            size="xs"
            color="red"
            leftSection={<UserX size={14} />}
            onClick={() => onRejectInvitation(notification.resourceId!)}
            loading={isRejectingInvitation}
            disabled={isAcceptingInvitation}
          >
            {t('notifications.reject_invitation')}
          </Button>
        </div>
      );
    }

    return null;
  };

  return <NotificationWrapper notification={notification} icon={icon} actions={renderActions()} />;
}

// ============================================
// Build Completed Notification
// ============================================
function BuildCompletedNotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: BaseNotificationItemProps) {
  const icon = (
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <Package size={16} className="text-green-600" />
    </div>
  );

  const actions = !notification.isRead ? (
    <MarkAsReadAction
      notificationId={notification.id}
      onMarkAsRead={onMarkAsRead}
      isMarkingAsRead={isMarkingAsRead}
    />
  ) : null;

  return <NotificationWrapper notification={notification} icon={icon} actions={actions} />;
}

// ============================================
// Member Joined Notification
// ============================================
function MemberJoinedNotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: BaseNotificationItemProps) {
  const icon = (
    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
      <UserPlus size={16} className="text-violet-600" />
    </div>
  );

  const actions = !notification.isRead ? (
    <MarkAsReadAction
      notificationId={notification.id}
      onMarkAsRead={onMarkAsRead}
      isMarkingAsRead={isMarkingAsRead}
    />
  ) : null;

  return <NotificationWrapper notification={notification} icon={icon} actions={actions} />;
}

// ============================================
// Member Removed Notification
// ============================================
function MemberRemovedNotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: BaseNotificationItemProps) {
  const icon = (
    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
      <UserMinus size={16} className="text-red-600" />
    </div>
  );

  const actions = !notification.isRead ? (
    <MarkAsReadAction
      notificationId={notification.id}
      onMarkAsRead={onMarkAsRead}
      isMarkingAsRead={isMarkingAsRead}
    />
  ) : null;

  return <NotificationWrapper notification={notification} icon={icon} actions={actions} />;
}

// ============================================
// Log Rate Exceeded Notification
// ============================================
function LogRateExceededNotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: BaseNotificationItemProps) {
  const icon = (
    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
      <AlertTriangle size={16} className="text-amber-600" />
    </div>
  );

  const actions = !notification.isRead ? (
    <MarkAsReadAction
      notificationId={notification.id}
      onMarkAsRead={onMarkAsRead}
      isMarkingAsRead={isMarkingAsRead}
    />
  ) : null;

  return <NotificationWrapper notification={notification} icon={icon} actions={actions} />;
}

// ============================================
// Notification Item Router
// ============================================
type NotificationItemProps = InvitationNotificationItemProps;

function NotificationItem(props: NotificationItemProps) {
  return match(props.notification.type)
    .with('invitation_received', () => <InvitationReceivedNotificationItem {...props} />)
    .with('build_completed', () => <BuildCompletedNotificationItem {...props} />)
    .with('member_joined', () => <MemberJoinedNotificationItem {...props} />)
    .with('member_removed', () => <MemberRemovedNotificationItem {...props} />)
    .with('log_rate_exceeded', () => <LogRateExceededNotificationItem {...props} />)
    .exhaustive();
}

// ============================================
// Main Dropdown Component
// ============================================
export function NotificationDropdown() {
  const { t } = useTranslation();
  const [opened, { toggle }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useNotificationsInfiniteQuery();

  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const acceptInvitationMutation = useAcceptInvitationMutation();
  const rejectInvitationMutation = useCancelInvitationMutation();

  const { ref, entry } = useIntersection({
    threshold: 0.5,
  });

  // Trigger fetch when intersection observer fires
  if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = data?.pages[0]?.unreadCount ?? 0;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleAcceptInvitation = (invitationId: string) => {
    acceptInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
      },
    });
  };

  const handleRejectInvitation = (invitationId: string) => {
    rejectInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
      },
    });
  };

  return (
    <Popover
      width={380}
      position="bottom-end"
      shadow="lg"
      opened={opened}
      onChange={toggle}
    >
      <Popover.Target>
        <div className="relative">
          <ActionIcon variant="light" size="lg" radius="md" onClick={toggle}>
            <Bell size={20} />
          </ActionIcon>
          {unreadCount > 0 && (
            <Badge
              size="xs"
              variant="filled"
              color="red"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] p-0 flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
      </Popover.Target>

      <Popover.Dropdown p={0}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-base">
            {t('notifications.title')}
          </h3>
          {unreadCount > 0 && (
            <Tooltip label={t('notifications.mark_all_as_read')} position="left">
              <ActionIcon
                variant="subtle"
                size="sm"
                color="blue"
                onClick={handleMarkAllAsRead}
                loading={markAllAsReadMutation.isPending}
              >
                <CheckCheck size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>

        <ScrollArea.Autosize mah={400} type="scroll">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size="sm" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-gray-500">
              {t('notifications.error_loading')}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p>{t('notifications.empty')}</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  isMarkingAsRead={markAsReadMutation.isPending}
                  onAcceptInvitation={handleAcceptInvitation}
                  onRejectInvitation={handleRejectInvitation}
                  isAcceptingInvitation={acceptInvitationMutation.isPending}
                  isRejectingInvitation={rejectInvitationMutation.isPending}
                />
              ))}
              {/* Infinite scroll trigger */}
              <div ref={ref} className="h-1" />
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <Loader size="sm" />
                </div>
              )}
              {!hasNextPage && notifications.length > 0 && (
                <div className="text-center py-3 text-xs text-gray-400">
                  {t('notifications.end_of_list')}
                </div>
              )}
            </>
          )}
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
