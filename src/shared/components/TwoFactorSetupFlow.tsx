import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';
import { Button, TextInput, Alert, CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import { ShieldCheck, Loader2, AlertTriangle, Copy, Check, ArrowLeft } from 'lucide-react';
import {
  useTwoFactorSetupWithTokenMutation,
  useTwoFactorEnableWithTokenMutation,
} from '../api/queries/two-factor';
import { useShowBackendError } from '../hooks';

type SetupViewState = 'loading' | 'qr' | 'verify' | 'backup';

const enableTwoFactorSchema = z.object({
  code: z.string().min(6, 'validation.two_factor.code_min').max(6, 'validation.two_factor.code_max'),
});

type EnableTwoFactorFormData = z.infer<typeof enableTwoFactorSchema>;

interface TwoFactorSetupFlowProps {
  tempToken: string;
  onComplete: () => void;
  onBack: () => void;
  onError?: () => void;
}

export function TwoFactorSetupFlow({ tempToken, onComplete, onBack, onError }: TwoFactorSetupFlowProps) {
  const { t } = useTranslation();
  const { showError } = useShowBackendError();
  const hasStartedRef = useRef(false);

  const setupMutation = useTwoFactorSetupWithTokenMutation();
  const enableMutation = useTwoFactorEnableWithTokenMutation();

  const [viewState, setViewState] = useState<SetupViewState>('loading');
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCodeUri: string;
    backupCodes: string[];
  } | null>(null);

  const enableForm = useForm<EnableTwoFactorFormData>({
    resolver: zodResolver(enableTwoFactorSchema),
    defaultValues: { code: '' },
  });

  // Start setup on first render
  if (!hasStartedRef.current) {
    hasStartedRef.current = true;
    setupMutation.mutateAsync(tempToken)
      .then((setup) => {
        setSetupData(setup);
        setViewState('qr');
      })
      .catch((error) => {
        showError(error);
        onError?.();
      });
  }

  const handleEnableTwoFactor = async (data: EnableTwoFactorFormData) => {
    try {
      await enableMutation.mutateAsync({
        tempToken,
        code: data.code,
      });
      setViewState('backup');
    } catch (error) {
      showError(error);
    }
  };

  const handleBack = () => {
    setSetupData(null);
    enableForm.reset();
    onBack();
  };

  // Loading View
  if (viewState === 'loading') {
    return (
      <div className="flex flex-col gap-6 items-center py-8">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
        <h2 className="text-2xl font-semibold">{t('auth.two_factor_setup.loading_title')}</h2>
        <p className="text-gray-500 text-center">
          {t('auth.two_factor_setup.loading_message')}
        </p>
      </div>
    );
  }

  // QR Code View
  if (viewState === 'qr' && setupData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center">
          <ShieldCheck size={48} className="text-blue-500" />
          <h2 className="text-2xl font-semibold">{t('auth.two_factor_setup.title')}</h2>
          <p className="text-gray-500 text-center">
            {t('auth.two_factor_setup.subtitle')}
          </p>
        </div>

        <Alert
          variant="light"
          color="yellow"
          icon={<AlertTriangle size={18} />}
        >
          {t('auth.two_factor_setup.required_notice')}
        </Alert>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('auth.two_factor_setup.qr_instructions')}
        </p>

        <div className="flex justify-center p-6 bg-white rounded-lg">
          <QRCodeSVG value={setupData.qrCodeUri} size={200} />
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 mb-2">
            {t('auth.two_factor_setup.manual_entry_label')}
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

        <Button
          fullWidth
          size="md"
          onClick={() => setViewState('verify')}
        >
          {t('auth.two_factor_setup.continue_button')}
        </Button>

        <div className="text-center">
          <Button
            variant="subtle"
            color="gray"
            leftSection={<ArrowLeft size={16} />}
            onClick={handleBack}
          >
            {t('auth.two_factor_setup.back_to_login')}
          </Button>
        </div>
      </div>
    );
  }

  // Verify Code View
  if (viewState === 'verify') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center">
          <ShieldCheck size={48} className="text-blue-500" />
          <h2 className="text-2xl font-semibold">{t('auth.two_factor_setup.title')}</h2>
          <p className="text-gray-500 text-center">
            {t('auth.two_factor_setup.verify_instructions')}
          </p>
        </div>

        <form onSubmit={enableForm.handleSubmit(handleEnableTwoFactor)}>
          <div className="flex flex-col gap-4">
            <TextInput
              label={t('auth.two_factor_setup.verification_code_label')}
              placeholder={t('auth.two_factor_setup.verification_code_placeholder')}
              {...enableForm.register('code')}
              error={enableForm.formState.errors.code?.message ? t(enableForm.formState.errors.code.message) : undefined}
              maxLength={6}
              classNames={{
                input: 'text-center tracking-widest font-mono text-lg',
              }}
            />

            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => setViewState('qr')}
                className="flex-1"
                size="md"
              >
                {t('common.back')}
              </Button>
              <Button
                type="submit"
                loading={enableMutation.isPending}
                className="flex-1"
                size="md"
              >
                {t('auth.two_factor_setup.verify_button')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Backup Codes View
  if (viewState === 'backup' && setupData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center">
          <ShieldCheck size={48} className="text-green-500" />
          <h2 className="text-2xl font-semibold">{t('auth.two_factor_setup.title')}</h2>
          <p className="text-gray-500 text-center">
            {t('auth.two_factor_setup.backup_codes_warning')}
          </p>
        </div>

        <Alert
          variant="light"
          color="yellow"
          icon={<AlertTriangle size={18} />}
        >
          {t('auth.two_factor_setup.backup_codes_warning')}
        </Alert>

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
              {copied ? t('common.copied') : t('auth.two_factor_setup.copy_all_codes')}
            </Button>
          )}
        </CopyButton>

        <Button
          fullWidth
          size="md"
          onClick={onComplete}
        >
          {t('auth.two_factor_setup.complete_button')}
        </Button>
      </div>
    );
  }

  return null;
}
