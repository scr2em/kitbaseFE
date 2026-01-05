import { useState } from 'react';
import { Card, Button, Badge, Modal, TextInput, PasswordInput, CopyButton, ActionIcon, Tooltip, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { ShieldCheck, ShieldOff, KeyRound, RefreshCw, Copy, Check, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';
import {
  useTwoFactorStatusQuery,
  useTwoFactorSetupMutation,
  useTwoFactorEnableMutation,
  useTwoFactorDisableMutation,
  useRegenerateBackupCodesMutation,
} from '../../../../shared/api/queries/two-factor';
import { useShowBackendError } from '../../../../shared/hooks';

// Zod schemas for forms
const enableTwoFactorSchema = z.object({
  code: z.string().min(6, 'validation.two_factor.code_min').max(6, 'validation.two_factor.code_max'),
});

const disableTwoFactorSchema = z.object({
  password: z.string().min(1, 'validation.password_required'),
  code: z.string().min(6, 'validation.two_factor.code_min').max(10, 'validation.two_factor.code_max'),
});

type EnableTwoFactorFormData = z.infer<typeof enableTwoFactorSchema>;
type DisableTwoFactorFormData = z.infer<typeof disableTwoFactorSchema>;

export function TwoFactorSection() {
  const { t } = useTranslation();
  const { showError } = useShowBackendError();
  
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [backupCodesModalOpen, setBackupCodesModalOpen] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeUri: string; backupCodes: string[] } | null>(null);
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);
  const [setupStep, setSetupStep] = useState<'qr' | 'verify' | 'backup'>('qr');

  const { data: status, isLoading: isLoadingStatus } = useTwoFactorStatusQuery();
  const setupMutation = useTwoFactorSetupMutation();
  const enableMutation = useTwoFactorEnableMutation();
  const disableMutation = useTwoFactorDisableMutation();
  const regenerateBackupCodesMutation = useRegenerateBackupCodesMutation();

  const enableForm = useForm<EnableTwoFactorFormData>({
    resolver: zodResolver(enableTwoFactorSchema),
    defaultValues: { code: '' },
  });

  const disableForm = useForm<DisableTwoFactorFormData>({
    resolver: zodResolver(disableTwoFactorSchema),
    defaultValues: { password: '', code: '' },
  });

  const handleStartSetup = async () => {
    try {
      const data = await setupMutation.mutateAsync();
      setSetupData(data);
      setSetupStep('qr');
      setSetupModalOpen(true);
    } catch (error) {
      showError(error);
    }
  };

  const handleEnableTwoFactor = async (data: EnableTwoFactorFormData) => {
    try {
      await enableMutation.mutateAsync({ code: data.code });
      setSetupStep('backup');
      notifications.show({
        title: t('common.success'),
        message: t('settings.two_factor.enabled_success'),
        color: 'green',
      });
    } catch (error) {
      showError(error);
    }
  };

  const handleDisableTwoFactor = async (data: DisableTwoFactorFormData) => {
    try {
      await disableMutation.mutateAsync({
        password: data.password,
        code: data.code,
      });
      setDisableModalOpen(false);
      disableForm.reset();
      notifications.show({
        title: t('common.success'),
        message: t('settings.two_factor.disabled_success'),
        color: 'green',
      });
    } catch (error) {
      showError(error);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    try {
      const data = await regenerateBackupCodesMutation.mutateAsync();
      setNewBackupCodes(data.backupCodes);
      setBackupCodesModalOpen(true);
    } catch (error) {
      showError(error);
    }
  };

  const handleCloseSetupModal = () => {
    setSetupModalOpen(false);
    setSetupData(null);
    setSetupStep('qr');
    enableForm.reset();
  };

  if (isLoadingStatus) {
    return (
      <Card withBorder p="xl" radius="md">
        <div className="flex items-center justify-center py-8">
          <Loader size="md" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card withBorder p="xl" radius="md">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                status?.enabled 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {status?.enabled ? (
                  <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
                ) : (
                  <ShieldOff size={20} className="text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {t('settings.two_factor.title')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('settings.two_factor.description')}
                </p>
              </div>
            </div>
            <Badge
              color={status?.enabled ? 'green' : 'gray'}
              variant="light"
              size="lg"
            >
              {status?.enabled 
                ? t('settings.two_factor.status_enabled')
                : t('settings.two_factor.status_disabled')
              }
            </Badge>
          </div>

          {/* Status info */}
          {status?.enabled && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <KeyRound size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {t('settings.two_factor.backup_codes_remaining', { count: status?.backupCodesRemaining ?? 0 })}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {status?.enabled ? (
              <>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<RefreshCw size={16} />}
                  onClick={handleRegenerateBackupCodes}
                  loading={regenerateBackupCodesMutation.isPending}
                >
                  {t('settings.two_factor.regenerate_backup_codes')}
                </Button>
                <Button
                  variant="light"
                  color="red"
                  leftSection={<ShieldOff size={16} />}
                  onClick={() => setDisableModalOpen(true)}
                >
                  {t('settings.two_factor.disable_button')}
                </Button>
              </>
            ) : (
              <Button
                variant="gradient"
                gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
                leftSection={<ShieldCheck size={16} />}
                onClick={handleStartSetup}
                loading={setupMutation.isPending}
              >
                {t('settings.two_factor.enable_button')}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Setup Modal */}
      <Modal
        opened={setupModalOpen}
        onClose={handleCloseSetupModal}
        title={t('settings.two_factor.setup_modal_title')}
        size="lg"
        centered
      >
        {setupStep === 'qr' && setupData && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.two_factor.setup_instructions')}
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <QRCodeSVG value={setupData.qrCodeUri} size={200} />
            </div>

            {/* Manual entry */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500 mb-2">
                {t('settings.two_factor.manual_entry_label')}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 break-all">
                  {setupData.secret}
                </code>
                <CopyButton value={setupData.secret}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? t('common.copied') : t('common.copy')}>
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </div>
            </div>

            <Button fullWidth onClick={() => setSetupStep('verify')}>
              {t('settings.two_factor.continue_button')}
            </Button>
          </div>
        )}

        {setupStep === 'verify' && (
          <form onSubmit={enableForm.handleSubmit(handleEnableTwoFactor)}>
            <div className="flex flex-col gap-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('settings.two_factor.verify_instructions')}
              </p>

              <TextInput
                label={t('settings.two_factor.verification_code_label')}
                placeholder={t('settings.two_factor.verification_code_placeholder')}
                {...enableForm.register('code')}
                error={enableForm.formState.errors.code?.message ? t(enableForm.formState.errors.code.message) : undefined}
                maxLength={6}
                classNames={{
                  input: 'text-center tracking-widest font-mono text-lg',
                }}
              />

              <div className="flex gap-3">
                <Button variant="default" onClick={() => setSetupStep('qr')} className="flex-1">
                  {t('common.back')}
                </Button>
                <Button type="submit" loading={enableMutation.isPending} className="flex-1">
                  {t('settings.two_factor.verify_button')}
                </Button>
              </div>
            </div>
          </form>
        )}

        {setupStep === 'backup' && setupData && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {t('settings.two_factor.backup_codes_warning')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {setupData.backupCodes.map((code, index) => (
                <code
                  key={index}
                  className="px-3 py-2 text-center font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  {code}
                </code>
              ))}
            </div>

            <CopyButton value={setupData.backupCodes.join('\n')}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={copy}
                >
                  {copied ? t('common.copied') : t('settings.two_factor.copy_all_codes')}
                </Button>
              )}
            </CopyButton>

            <Button fullWidth onClick={handleCloseSetupModal}>
              {t('settings.two_factor.done_button')}
            </Button>
          </div>
        )}
      </Modal>

      {/* Disable Modal */}
      <Modal
        opened={disableModalOpen}
        onClose={() => {
          setDisableModalOpen(false);
          disableForm.reset();
        }}
        title={t('settings.two_factor.disable_modal_title')}
        centered
      >
        <form onSubmit={disableForm.handleSubmit(handleDisableTwoFactor)}>
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                {t('settings.two_factor.disable_warning')}
              </p>
            </div>

            <PasswordInput
              label={t('settings.two_factor.password_label')}
              placeholder={t('settings.two_factor.password_placeholder')}
              {...disableForm.register('password')}
              error={disableForm.formState.errors.password?.message ? t(disableForm.formState.errors.password.message) : undefined}
            />

            <TextInput
              label={t('settings.two_factor.code_label')}
              placeholder={t('settings.two_factor.code_placeholder')}
              {...disableForm.register('code')}
              error={disableForm.formState.errors.code?.message ? t(disableForm.formState.errors.code.message) : undefined}
              maxLength={10}
              classNames={{
                input: 'text-center tracking-widest font-mono',
              }}
            />

            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => {
                  setDisableModalOpen(false);
                  disableForm.reset();
                }}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" color="red" loading={disableMutation.isPending} className="flex-1">
                {t('settings.two_factor.confirm_disable')}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Backup Codes Modal */}
      <Modal
        opened={backupCodesModalOpen}
        onClose={() => {
          setBackupCodesModalOpen(false);
          setNewBackupCodes(null);
        }}
        title={t('settings.two_factor.new_backup_codes_title')}
        centered
      >
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {t('settings.two_factor.new_backup_codes_warning')}
              </p>
            </div>
          </div>

          {newBackupCodes && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {newBackupCodes.map((code, index) => (
                  <code
                    key={index}
                    className="px-3 py-2 text-center font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                  >
                    {code}
                  </code>
                ))}
              </div>

              <CopyButton value={newBackupCodes.join('\n')}>
                {({ copied, copy }) => (
                  <Button
                    variant="light"
                    leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
                    onClick={copy}
                  >
                    {copied ? t('common.copied') : t('settings.two_factor.copy_all_codes')}
                  </Button>
                )}
              </CopyButton>
            </>
          )}

          <Button
            fullWidth
            onClick={() => {
              setBackupCodesModalOpen(false);
              setNewBackupCodes(null);
            }}
          >
            {t('settings.two_factor.done_button')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

