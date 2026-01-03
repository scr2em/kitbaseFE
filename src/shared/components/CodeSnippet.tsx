import { Tabs, CopyButton, Button, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Check, Copy } from 'lucide-react';
import { Highlight, themes, Prism } from 'prism-react-renderer';

// Extend Prism with additional languages
// PHP language definition
(Prism.languages as Record<string, unknown>).php = {
  comment: [
    { pattern: /\/\*[\s\S]*?\*\/|\/\/.*|#.*/, greedy: true }
  ],
  string: [
    { pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/, greedy: true },
    { pattern: /<<<([a-z_]\w*)[\r\n](?:.*[\r\n])*?\1;/i, greedy: true },
    { pattern: /'(?:\\[\s\S]|[^\\'])*'/, greedy: true },
    { pattern: /"(?:\\[\s\S]|[^\\"])*"/, greedy: true }
  ],
  variable: /\$+(?:\w+\b|(?=\{))/,
  keyword: /\b(?:and|or|xor|array|as|break|case|catch|class|const|continue|declare|default|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|global|if|implements|include|include_once|instanceof|interface|namespace|new|null|private|protected|public|require|require_once|return|static|switch|throw|trait|try|use|var|while|yield)\b/i,
  boolean: /\b(?:true|false)\b/i,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--|\+\+|&&|\|\||<=>|<<?=?|>>?=?|[!=<>]=?|[-+*/%^|&~]|\.\.?=?|\?:?|::/,
  punctuation: /[{}[\];(),.:]/,
  'class-name': /\b[A-Z]\w*\b/,
  function: /\b\w+(?=\s*\()/
};

// Dart language definition
(Prism.languages as Record<string, unknown>).dart = {
  comment: [
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
    { pattern: /\/\/.*/, greedy: true }
  ],
  string: [
    { pattern: /r?('''|""")[\s\S]*?\1/, greedy: true },
    { pattern: /r?(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/, greedy: true }
  ],
  keyword: /\b(?:abstract|as|assert|async|await|base|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|false|final|finally|for|Function|get|hide|if|implements|import|in|interface|is|late|library|mixin|new|null|on|operator|part|required|rethrow|return|sealed|set|show|static|super|switch|sync|this|throw|true|try|typedef|var|void|when|while|with|yield)\b/,
  boolean: /\b(?:true|false)\b/,
  number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i,
  operator: /[-+*/%^!=<>&|?~]+|\.\.\.?/,
  punctuation: /[{}[\];(),.:]/,
  'class-name': /\b[A-Z]\w*\b/,
  function: /\b\w+(?=\s*\()/,
  variable: /\b[a-z_]\w*\b/
};

export interface CodeSnippetTab {
  language: string;
  label: string;
  code: string;
}

interface CodeSnippetProps {
  tabs: CodeSnippetTab[];
  defaultLanguage?: string;
  title?: string;
}

// Map our language names to Prism language identifiers
const languageMap: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  dart: 'dart',
  php: 'php',
  bash: 'bash',
  shell: 'bash',
  json: 'json',
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const prismLanguage = languageMap[language] || language;
  
  return (
    <Highlight
      theme={themes.github}
      code={code.trim()}
      language={prismLanguage}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre 
          className={`${className} p-4 pr-24 text-sm overflow-x-auto`}
          style={{ ...style, backgroundColor: 'transparent', margin: 0 }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="leading-6">
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export function CodeSnippet({ tabs, defaultLanguage, title }: CodeSnippetProps) {
  const { t } = useTranslation();
  const defaultTab = defaultLanguage || tabs[0]?.language || 'typescript';

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-100">
          <span className="text-sm font-medium text-slate-700">{title}</span>
        </div>
      )}
      <Tabs defaultValue={defaultTab}>
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/50">
          <Tabs.List className="border-none bg-transparent">
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.language}
                value={tab.language}
                className="text-xs font-medium px-3 py-2 data-[active=true]:bg-white data-[active=true]:border-b-2 data-[active=true]:border-blue-500"
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </div>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.language} value={tab.language}>
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <CopyButton value={tab.code}>
                  {({ copied, copy }) => (
                    <Button
                      variant="subtle"
                      size="xs"
                      color={copied ? 'green' : 'gray'}
                      onClick={copy}
                      leftSection={copied ? <Check size={14} /> : <Copy size={14} />}
                    >
                      {copied ? t('code_snippet.copied') : t('code_snippet.copy')}
                    </Button>
                  )}
                </CopyButton>
              </div>
              <ScrollArea.Autosize mah={400} type="auto">
                <CodeBlock code={tab.code} language={tab.language} />
              </ScrollArea.Autosize>
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
