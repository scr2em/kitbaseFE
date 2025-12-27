import {
  Card,
  Loader,
  Button,
  Alert,
  Menu,
  ActionIcon,
  Table,
  ScrollArea,
  Badge,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, MoreVertical, Trash2, Edit, Radio, Building } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useChannelsInfiniteQuery,
  useDeleteChannelMutation,
} from '../../../shared/api/queries/channels';
import { useShowBackendError, useCurrentOrganization, usePageTitle } from '../../../shared/hooks';
import { CreateChannelModal } from './CreateChannelModal';
import { UpdateChannelModal } from './UpdateChannelModal';
import type { ChannelResponse } from '../../../generated-api';

export function ChannelsPage() {
  const { t } = useTranslation();
  usePageTitle(t('channels.page_title'));
  const navigate = useNavigate();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<{
    opened: boolean;
    channel: ChannelResponse | null;
  }>({ opened: false, channel: null });

  const { currentOrganization, isLoading: isLoadingUser } = useCurrentOrganization();
  
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChannelsInfiniteQuery();

  const deleteChannelMutation = useDeleteChannelMutation();
  const { showError } = useShowBackendError();

  const handleDeleteChannel = (channelId: string, channelName: string) => {
    modals.openConfirmModal({
      title: t('channels.delete.title'),
      children: (
        <p className="text-sm">
          {t('channels.delete.confirmation', { name: channelName })}
        </p>
      ),
      labels: { confirm: t('channels.delete.confirm'), cancel: t('channels.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteChannelMutation.mutateAsync(channelId);
          notifications.show({
            title: t('common.success'),
            message: t('channels.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleUpdateChannel = (channel: ChannelResponse) => {
    setUpdateModalData({ opened: true, channel });
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
            title={t('channels.no_organization_title')}
            color="yellow"
          >
            {t('channels.no_organization_message')}
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
          {t('channels.error_loading')}
        </Alert>
      </div>
    );
  }

  const channels = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('channels.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('channels.subtitle', { count: totalElements })}
            </p>
          </div>
          <Button
            leftSection={<Plus size={18} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            onClick={() => setCreateModalOpened(true)}
          >
            {t('channels.create_button')}
          </Button>
        </div>

        {/* Channels Table */}
        {channels.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Radio size={48} strokeWidth={1.5} className="text-gray-400" />
                <p className="text-lg text-gray-500">
                  {t('channels.no_channels')}
                </p>
                <Button
                  leftSection={<Plus size={18} />}
                  onClick={() => setCreateModalOpened(true)}
                >
                  {t('channels.create_first_channel')}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card withBorder padding={0} radius="md">
              <ScrollArea>
                <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('channels.table.name')}</Table.Th>
                      <Table.Th>{t('channels.table.description')}</Table.Th>
                      <Table.Th>{t('channels.table.created_at')}</Table.Th>
                      <Table.Th>{t('channels.table.updated_at')}</Table.Th>
                      <Table.Th>{t('channels.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {channels.map((channel) => (
                      <Table.Tr key={channel.id}>
                        <Table.Td>
                          <div className="flex gap-3 items-center">
                            <Radio size={20} strokeWidth={2} />
                            <div>
                              <p className="font-medium text-sm">
                                {channel.name}
                              </p>
                              <Badge variant="light" color="blue" size="xs" mt={2}>
                                {t('channels.badge')}
                              </Badge>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <p className={`text-sm ${channel.description ? '' : 'text-gray-500'}`}>
                            {channel.description || t('channels.no_description')}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(channel.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(channel.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <MoreVertical size={18} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<Edit size={16} />}
                                onClick={() => handleUpdateChannel(channel)}
                              >
                                {t('channels.update.menu_item')}
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteChannel(channel.id, channel.name)}
                              >
                                {t('channels.delete.menu_item')}
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="light"
                >
                  {isFetchingNextPage ? t('channels.loading_more') : t('channels.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateChannelModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />

      {updateModalData.channel && (
        <UpdateChannelModal
          opened={updateModalData.opened}
          onClose={() => setUpdateModalData({ opened: false, channel: null })}
          channel={updateModalData.channel}
        />
      )}
    </div>
  );
}
