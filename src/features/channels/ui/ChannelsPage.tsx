import {
  Box,
  Title,
  Text,
  Stack,
  Card,
  Center,
  Loader,
  Button,
  Alert,
  Group,
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
import { useShowBackendError, useCurrentOrganization } from '../../../shared/hooks';
import { CreateChannelModal } from './CreateChannelModal';
import { UpdateChannelModal } from './UpdateChannelModal';
import type { ChannelResponse } from '../../../generated-api';

export function ChannelsPage() {
  const { t } = useTranslation();
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
        <Text size="sm">
          {t('channels.delete.confirmation', { name: channelName })}
        </Text>
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
      <Center h="calc(100vh - 120px)">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!currentOrganization) {
    return (
      <Box>
        <Stack gap="md">
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
            style={{ alignSelf: 'flex-start' }}
          >
            {t('dashboard.create_organization')}
          </Button>
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('channels.error_loading')}
        </Alert>
      </Box>
    );
  }

  const channels = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <Box>
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={1} mb="xs">
              {t('channels.title')}
            </Title>
            <Text c="dimmed" size="lg">
              {t('channels.subtitle', { count: totalElements })}
            </Text>
          </Box>
          <Button
            leftSection={<Plus size={18} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            onClick={() => setCreateModalOpened(true)}
          >
            {t('channels.create_button')}
          </Button>
        </Group>

        {/* Channels Table */}
        {channels.length === 0 ? (
          <Card withBorder   p="xl" radius="md">
            <Center>
              <Stack align="center" gap="md">
                <Radio size={48} strokeWidth={1.5} color="var(--mantine-color-dimmed)" />
                <Text c="dimmed" size="lg">
                  {t('channels.no_channels')}
                </Text>
                <Button
                  leftSection={<Plus size={18} />}
                  onClick={() => setCreateModalOpened(true)}
                >
                  {t('channels.create_first_channel')}
                </Button>
              </Stack>
            </Center>
          </Card>
        ) : (
          <>
            <Card withBorder  padding={0} radius="md">
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
                          <Group gap="sm">
                            <Radio size={20} strokeWidth={2} />
                            <div>
                              <Text fw={500} size="sm">
                                {channel.name}
                              </Text>
                              <Badge variant="light" color="blue" size="xs" mt={2}>
                                {t('channels.badge')}
                              </Badge>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c={channel.description ? undefined : 'dimmed'}>
                            {channel.description || t('channels.no_description')}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(channel.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(channel.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
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
              <Center mt="xl">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="light"
                >
                  {isFetchingNextPage ? t('channels.loading_more') : t('channels.load_more')}
                </Button>
              </Center>
            )}
          </>
        )}
      </Stack>

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
    </Box>
  );
}
