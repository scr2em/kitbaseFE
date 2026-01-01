import { Modal, Button, Alert, Code, CopyButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

interface ApiKeyCreatedModalProps {
  opened: boolean;
  onClose: () => void;
  apiKey: string;
  keyName: string;
}

export function ApiKeyCreatedModal({ opened, onClose, apiKey, keyName }: ApiKeyCreatedModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('projects.detail.api_keys.created.modal_title')}
      size="md"
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <div className="flex flex-col gap-4">
        <Alert
          icon={<AlertTriangle size={20} />}
          color="yellow"
          title={t('projects.detail.api_keys.created.warning_title')}
        >
          {t('projects.detail.api_keys.created.warning_message')}
        </Alert>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">
            {t('projects.detail.api_keys.created.key_name')}
          </p>
          <p className="text-sm text-gray-500">
            {keyName}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">
              {t('projects.detail.api_keys.created.key_label')}
            </p>
            <CopyButton value={apiKey}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  onClick={copy}
                  color={copied ? 'green' : 'blue'}
                  size="xs"
                >
                  {copied ? t('projects.detail.api_keys.created.copied') : t('projects.detail.api_keys.created.copy_button')}
                </Button>
              )}
            </CopyButton>
          </div>
          <Code block p="md" style={{ wordBreak: 'break-all' }}>
            {apiKey}
          </Code>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            {t('projects.detail.api_keys.created.confirm_button')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}










