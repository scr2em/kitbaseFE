import {
  Avatar,
  Badge,
  Card,
  Loader,
  Button,
  Table,
  Alert,
  ScrollArea,
  ActionIcon,
  Menu,
  Modal,
  Select,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, UserPlus, MoreVertical, Trash2, Building, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useOrganizationMembersQuery, useRemoveMemberMutation, useUpdateMemberRoleMutation } from '../../../shared/api/queries/organization';
import { useRolesQuery } from '../../../shared/api/queries/role';
import { InviteUserModal } from '../../invitation';
import { useShowBackendError, usePermissions, useCurrentOrganization } from '../../../shared/hooks';
import { useCurrentUserQuery } from '../../../shared/api/queries/user';

export function TeamPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inviteModalOpened, setInviteModalOpened] = useState(false);
  const [changeRoleModal, setChangeRoleModal] = useState<{
    opened: boolean;
    memberId: string;
    memberName: string;
    currentRoleId: string;
  }>({ opened: false, memberId: '', memberName: '', currentRoleId: '' });
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  
  const { currentOrganization, isLoading: isLoadingUser } = useCurrentOrganization();
  const { data: currentUser } = useCurrentUserQuery();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useOrganizationMembersQuery();
  const { data: roles } = useRolesQuery();
  
  const removeMemberMutation = useRemoveMemberMutation();
  const updateMemberRoleMutation = useUpdateMemberRoleMutation();
  const { showError } = useShowBackendError();
  const { canInviteMember, canRemoveMember, canUpdateMemberRole } = usePermissions();


  const handleDeleteMember = (memberId: string, memberName: string) => {
    modals.openConfirmModal({
      title: t('team.delete.title'),
      children: (
        <p className="text-sm">
          {t('team.delete.confirmation', { name: memberName })}
        </p>
      ),
      labels: { confirm: t('team.delete.confirm'), cancel: t('team.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await removeMemberMutation.mutateAsync(memberId);
          notifications.show({
            title: t('common.success'),
            message: t('team.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleOpenChangeRoleModal = (memberId: string, memberName: string, currentRoleId: string) => {
    setSelectedRoleId(currentRoleId);
    setChangeRoleModal({ opened: true, memberId, memberName, currentRoleId });
  };

  const handleCloseChangeRoleModal = () => {
    setChangeRoleModal({ opened: false, memberId: '', memberName: '', currentRoleId: '' });
    setSelectedRoleId(null);
  };

  const handleChangeRole = async () => {
    if (!selectedRoleId || selectedRoleId === changeRoleModal.currentRoleId) return;
    
    try {
      await updateMemberRoleMutation.mutateAsync({
        membershipId: changeRoleModal.memberId,
        roleId: selectedRoleId,
      });
      notifications.show({
        title: t('common.success'),
        message: t('team.change_role.success_message'),
        color: 'green',
      });
      handleCloseChangeRoleModal();
    } catch (error) {
      showError(error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'red';
      case 'member':
        return 'blue';
      case 'viewer':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'pending':
        return 'yellow';
      case 'suspended':
        return 'red';
      default:
        return 'gray';
    }
  };


  if (isLoadingUser || isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div>
        <div className="flex flex-col gap-4">
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('team.no_organization_title')}
            color="yellow"
          >
            {t('team.no_organization_message')}
          </Alert>
          <Button
            leftSection={<Building size={16} />}
            variant="light"
            size="md"
            onClick={() => navigate('/create-organization')}
            className="self-start"
          >
            {t('dashboard.create_organization')}
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('team.error_loading')}
        </Alert>
      </div>
    );
  }

  const allMembers = data?.pages.flatMap((page) => page.data) || [];
  const totalMembers = data?.pages[0]?.total || 0;

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('team.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('team.subtitle', { count: totalMembers })}
            </p>
          </div>
          {canInviteMember && (
            <Button
              leftSection={<UserPlus size={18} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              onClick={() => setInviteModalOpened(true)}
            >
              {t('team.invite_member')}
            </Button>
          )}
        </div>

        {/* Members Table */}
        <Card withBorder padding={0} radius="md">
          <ScrollArea>
            <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('team.table.member')}</Table.Th>
                  <Table.Th>{t('team.table.email')}</Table.Th>
                  <Table.Th>{t('team.table.role')}</Table.Th>
                  <Table.Th>{t('team.table.status')}</Table.Th>
                  <Table.Th>{t('team.table.invitation_status')}</Table.Th>
                  <Table.Th>{t('team.table.joined')}</Table.Th>
                  <Table.Th>{t('team.table.actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allMembers.map((member) => (
                  <Table.Tr key={member.id}>
                    <Table.Td>
                      <div className="flex gap-3 items-center">
                        <Avatar
                          size={40}
                          radius="xl"
                          color="blue"
                        >
                          {getInitials(member.user.firstName, member.user.lastName)}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          {member.user.id === currentUser?.id && (
                            <p className="text-xs text-gray-500">
                              {t('team.you')}
                            </p>
                          )}
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <p className="text-sm">{member.user.email}</p>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getRoleBadgeColor(member.role.name)}
                        variant="light"
                      >
                        {member.role.name}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusBadgeColor(member.user.status.status)}
                        variant="dot"
                      >
                        {member.user.status.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <p className="text-sm text-gray-500">
                        {t('team.active_member')}
                      </p>
                    </Table.Td>
                    <Table.Td>
                      <p className="text-sm">
                        {new Date(member.user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </Table.Td>
                    <Table.Td>
                      {(canRemoveMember || canUpdateMemberRole) && (
                        <Menu shadow="md" width={200} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <MoreVertical size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {canUpdateMemberRole && (
                              <Menu.Item
                                leftSection={<Shield size={16} />}
                                onClick={() => handleOpenChangeRoleModal(
                                  member.id,
                                  `${member.user.firstName} ${member.user.lastName}`,
                                  member.role.id
                                )}
                                disabled={member.user.id === currentUser?.id}
                              >
                                {t('team.change_role.menu_item')}
                              </Menu.Item>
                            )}
                            {canRemoveMember && (
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteMember(member.id, `${member.user.firstName} ${member.user.lastName}`)}
                                disabled={member.user.id === currentUser?.id}
                              >
                                {t('team.delete.menu_item')}
                              </Menu.Item>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="subtle"
                >
                  {isFetchingNextPage
                    ? t('team.loading_more')
                    : t('team.load_more')}
                </Button>
              </div>
            </div>
          )}
        </Card>

      </div>

      <InviteUserModal
        opened={inviteModalOpened}
        onClose={() => setInviteModalOpened(false)}
      />

      <Modal
        opened={changeRoleModal.opened}
        onClose={handleCloseChangeRoleModal}
        title={t('team.change_role.modal_title')}
        centered
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            {t('team.change_role.description', { name: changeRoleModal.memberName })}
          </p>
          <Select
            label={t('team.change_role.role_label')}
            placeholder={t('team.change_role.role_placeholder')}
            value={selectedRoleId}
            onChange={setSelectedRoleId}
            data={roles?.map((role) => ({
              value: role.id,
              label: role.name,
            })) || []}
          />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="subtle" onClick={handleCloseChangeRoleModal}>
              {t('team.change_role.cancel_button')}
            </Button>
            <Button
              onClick={handleChangeRole}
              loading={updateMemberRoleMutation.isPending}
              disabled={!selectedRoleId || selectedRoleId === changeRoleModal.currentRoleId}
            >
              {t('team.change_role.submit_button')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
