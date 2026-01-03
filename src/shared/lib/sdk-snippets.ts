import type { CodeSnippetTab } from '../components/CodeSnippet';

export function getQuickStartSnippets(apiKey: string): CodeSnippetTab[] {
  return [
    {
      language: 'typescript',
      label: 'TypeScript',
      code: `import { FlagsClient } from '@kitbase/sdk/flags';
import { Kitbase } from '@kitbase/sdk/events';

// Feature Flags
const flags = new FlagsClient({
  token: '${apiKey}'
});

const isEnabled = await flags.getBooleanValue('my-feature', false, {
  targetingKey: 'user-123'
});

// Event Tracking
const kitbase = new Kitbase({
  token: '${apiKey}'
});

await kitbase.track({
  channel: 'user-activity',
  event: 'Feature Activated',
  user_id: 'user-123'
});`,
    },
    {
      language: 'dart',
      label: 'Dart',
      code: `import 'package:kitbase/flags.dart';
import 'package:kitbase/events.dart';

// Feature Flags
final flags = FlagsClient(token: '${apiKey}');

final isEnabled = await flags.getBooleanValue(
  'my-feature',
  defaultValue: false,
  context: {'targetingKey': 'user-123'},
);

// Event Tracking
final kitbase = Kitbase(token: '${apiKey}');

await kitbase.track(
  channel: 'user-activity',
  event: 'Feature Activated',
  userId: 'user-123',
);`,
    },
    {
      language: 'php',
      label: 'PHP',
      code: `<?php
use Kitbase\\Flags\\Client as FlagsClient;
use Kitbase\\Events\\Client as Kitbase;

// Feature Flags
$flags = new FlagsClient(['token' => '${apiKey}']);

$isEnabled = $flags->getBooleanValue('my-feature', false, [
    'targetingKey' => 'user-123'
]);

// Event Tracking
$kitbase = new Kitbase(['token' => '${apiKey}']);

$kitbase->track([
    'channel' => 'user-activity',
    'event' => 'Feature Activated',
    'user_id' => 'user-123'
]);`,
    },
  ];
}

export function getFeatureFlagSnippets(
  apiKey: string | undefined,
  flagKey: string,
  valueType: string
): CodeSnippetTab[] {
  const token = apiKey || 'YOUR_API_KEY';
  
  const methodMap = {
    boolean: { method: 'getBooleanValue', defaultValue: 'false' },
    string: { method: 'getStringValue', defaultValue: "'default'" },
    number: { method: 'getNumberValue', defaultValue: '0' },
    json: { method: 'getJsonValue', defaultValue: '{}' },
  } as const;
  
  const config = methodMap[valueType as keyof typeof methodMap] ?? methodMap.boolean;
  const { method, defaultValue } = config;
  
  return [
    {
      language: 'typescript',
      label: 'TypeScript',
      code: `import { FlagsClient } from '@kitbase/sdk/flags';

const flags = new FlagsClient({
  token: '${token}'
});

// Evaluate the flag
const value = await flags.${method}('${flagKey}', ${defaultValue}, {
  targetingKey: 'user-123',
  // Add custom attributes for targeting rules
  plan: 'premium',
  country: 'US'
});

// Use the flag value
if (value) {
  // Feature is enabled for this user
}`,
    },
    {
      language: 'dart',
      label: 'Dart',
      code: `import 'package:kitbase/flags.dart';

final flags = FlagsClient(token: '${token}');

// Evaluate the flag
final value = await flags.${method}(
  '${flagKey}',
  defaultValue: ${defaultValue},
  context: {
    'targetingKey': 'user-123',
    // Add custom attributes for targeting rules
    'plan': 'premium',
    'country': 'US',
  },
);

// Use the flag value
if (value) {
  // Feature is enabled for this user
}`,
    },
    {
      language: 'php',
      label: 'PHP',
      code: `<?php
use Kitbase\\Flags\\Client as FlagsClient;

$flags = new FlagsClient(['token' => '${token}']);

// Evaluate the flag
$value = $flags->${method}('${flagKey}', ${defaultValue}, [
    'targetingKey' => 'user-123',
    // Add custom attributes for targeting rules
    'plan' => 'premium',
    'country' => 'US'
]);

// Use the flag value
if ($value) {
    // Feature is enabled for this user
}`,
    },
    {
      language: 'bash',
      label: 'cURL',
      code: `curl -X POST 'https://api.kitbase.dev/v1/feature-flags/evaluate' \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: ${token}' \\
  -d '{
    "flagKey": "${flagKey}",
    "identityId": "user-123",
    "context": {
      "plan": "premium",
      "country": "US"
    },
    "defaultValue": ${valueType === 'json' ? '{}' : defaultValue}
  }'`,
    },
  ];
}

export function getEventTrackingSnippets(apiKey?: string): CodeSnippetTab[] {
  const token = apiKey || 'YOUR_API_KEY';
  
  return [
    {
      language: 'typescript',
      label: 'TypeScript',
      code: `import { Kitbase } from '@kitbase/sdk/events';

const kitbase = new Kitbase({
  token: '${token}'
});

// Track a custom event
await kitbase.track({
  channel: 'payments',
  event: 'New Subscription',
  user_id: 'user-123',
  icon: '💰',
  notify: true,
  description: 'User upgraded to premium',
  tags: {
    plan: 'premium',
    cycle: 'monthly',
    amount: 29.99
  }
});`,
    },
    {
      language: 'dart',
      label: 'Dart',
      code: `import 'package:kitbase/events.dart';

final kitbase = Kitbase(token: '${token}');

// Track a custom event
await kitbase.track(
  channel: 'payments',
  event: 'New Subscription',
  userId: 'user-123',
  icon: '💰',
  notify: true,
  description: 'User upgraded to premium',
  tags: {
    'plan': 'premium',
    'cycle': 'monthly',
    'amount': 29.99,
  },
);`,
    },
    {
      language: 'php',
      label: 'PHP',
      code: `<?php
use Kitbase\\Events\\Client as Kitbase;

$kitbase = new Kitbase(['token' => '${token}']);

// Track a custom event
$kitbase->track([
    'channel' => 'payments',
    'event' => 'New Subscription',
    'user_id' => 'user-123',
    'icon' => '💰',
    'notify' => true,
    'description' => 'User upgraded to premium',
    'tags' => [
        'plan' => 'premium',
        'cycle' => 'monthly',
        'amount' => 29.99
    ]
]);`,
    },
  ];
}

export function getChangelogSnippets(apiKey?: string): CodeSnippetTab[] {
  const token = apiKey || 'YOUR_API_KEY';
  
  return [
    {
      language: 'typescript',
      label: 'TypeScript',
      code: `import { Changelogs } from '@kitbase/sdk/changelogs';

const changelogs = new Changelogs({
  token: '${token}'
});

// Fetch changelog for a specific version
const changelog = await changelogs.get('1.0.0');

console.log(changelog.title);
console.log(changelog.entries);`,
    },
    {
      language: 'dart',
      label: 'Dart',
      code: `import 'package:kitbase/changelogs.dart';

final changelogs = Changelogs(token: '${token}');

// Fetch changelog for a specific version
final changelog = await changelogs.get('1.0.0');

print(changelog.title);
print(changelog.entries);`,
    },
    {
      language: 'php',
      label: 'PHP',
      code: `<?php
use Kitbase\\Changelogs\\Client as Changelogs;

$changelogs = new Changelogs(['token' => '${token}']);

// Fetch changelog for a specific version
$changelog = $changelogs->get('1.0.0');

echo $changelog['title'];
print_r($changelog['entries']);`,
    },
  ];
}
