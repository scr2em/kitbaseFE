import { Modal, Button, Alert, Code, CopyButton, Accordion } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Code2 } from 'lucide-react';
import { CodeSnippet } from '../../../shared/components/CodeSnippet';
import { getQuickStartSnippets } from '../../../shared/lib/sdk-snippets';

interface ApiKeyCreatedModalProps {
  opened: boolean;
  onClose: () => void;
  apiKey: string;
  keyName: string;
}

export function ApiKeyCreatedModal({ opened, onClose, apiKey, keyName }: ApiKeyCreatedModalProps) {
  const { t } = useTranslation();
  const codeSnippets = getQuickStartSnippets(apiKey);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('projects.detail.api_keys.created.modal_title')}
      size="lg"
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

        {/* SDK Quick Start Snippets */}
        <Accordion variant="separated" radius="md">
          <Accordion.Item value="quickstart">
            <Accordion.Control icon={<Code2 size={18} />}>
              <span className="font-medium">{t('code_snippet.quick_start_title')}</span>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-600">
                  {t('code_snippet.quick_start_description')}
                </p>
                <CodeSnippet tabs={codeSnippets} />
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            {t('projects.detail.api_keys.created.confirm_button')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
