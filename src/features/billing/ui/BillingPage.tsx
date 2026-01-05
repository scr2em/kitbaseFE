import {
  Card,
  Button,
  Badge,
  ThemeIcon,
  Progress,
  Divider,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Package,
  Users,
  Activity,
  Zap,
  Check,
  ArrowUpRight,
  Download,
  Calendar,
} from 'lucide-react';
import { usePageTitle } from '../../../shared/hooks';
import { useProjectsQuery } from '../../../shared/api/queries';
import { useOrganizationMembersQuery } from '../../../shared/api/queries/organization';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'For individuals and small projects',
    features: [
      { name: 'Up to 3 projects', included: true, limit: '3' },
      { name: 'Up to 5 team members', included: true, limit: '5' },
      { name: '10,000 events/month', included: true, limit: '10k' },
      { name: 'Community support', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'API access', included: false },
      { name: 'Custom webhooks', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    description: 'For growing teams and businesses',
    highlighted: true,
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'Up to 20 team members', included: true, limit: '20' },
      { name: '100,000 events/month', included: true, limit: '100k' },
      { name: 'Email support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Full API access', included: true },
      { name: 'Custom webhooks', included: true },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    description: 'For large organizations',
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Unlimited events', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom analytics', included: true },
      { name: 'Full API access', included: true },
      { name: 'Custom webhooks', included: true },
      { name: '24/7 Priority support', included: true },
    ],
  },
];

export function BillingPage() {
  const { t } = useTranslation();
  usePageTitle(t('billing.page_title'));
  const { data: projects } = useProjectsQuery();
  const { data: membersData } = useOrganizationMembersQuery();

  const currentPlan = plans[0]; // Default to free plan
  const projectCount = projects?.length || 0;
  const memberCount = membersData?.pages[0]?.total || 0;
  const eventsUsed = 3420; // This would come from an API
  const eventsLimit = 10000;

  const usageItems = [
    {
      icon: Package,
      label: t('billing.usage.projects'),
      used: projectCount,
      limit: 3,
      color: 'blue',
    },
    {
      icon: Users,
      label: t('billing.usage.team_members'),
      used: memberCount,
      limit: 5,
      color: 'teal',
    },
    {
      icon: Activity,
      label: t('billing.usage.events'),
      used: eventsUsed,
      limit: eventsLimit,
      color: 'violet',
      formatValue: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val,
    },
  ];

  const invoices = [
    { id: 'INV-001', date: '2026-01-01', amount: 0, status: 'paid' },
    { id: 'INV-002', date: '2025-12-01', amount: 0, status: 'paid' },
    { id: 'INV-003', date: '2025-11-01', amount: 0, status: 'paid' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t('billing.title')}
        </h1>
        <p className="text-slate-500 mt-1">
          {t('billing.subtitle')}
        </p>
      </div>

      {/* Current Plan Overview */}
      <Card withBorder padding="lg" radius="md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <ThemeIcon
              size={56}
              radius="md"
              variant="light"
              color="blue"
            >
              <Zap size={28} />
            </ThemeIcon>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {currentPlan?.name} {t('billing.plan')}
                </h2>
                <Badge color="blue" variant="light">
                  {t('billing.current_plan')}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                {currentPlan?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                ${currentPlan?.price}
                <span className="text-sm font-normal text-slate-500">
                  /{currentPlan?.interval}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                {t('billing.next_billing')}: Feb 1, 2026
              </p>
            </div>
            <Button variant="light" color="blue">
              {t('billing.manage_subscription')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Usage Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {t('billing.usage.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {usageItems.map((item) => {
            const percentage = (item.used / item.limit) * 100;
            const isNearLimit = percentage >= 80;
            const formatValue = item.formatValue || ((v: number) => v);

            return (
              <Card key={item.label} withBorder padding="lg" radius="md">
                <div className="flex items-center gap-3 mb-3">
                  <ThemeIcon
                    size={40}
                    radius="md"
                    variant="light"
                    color={item.color}
                  >
                    <item.icon size={20} />
                  </ThemeIcon>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatValue(item.used)} / {formatValue(item.limit)}
                    </p>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  size="sm"
                  radius="xl"
                  color={isNearLimit ? 'orange' : item.color}
                />
                {isNearLimit && (
                  <p className="text-xs text-orange-600 mt-2">
                    {t('billing.usage.near_limit')}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Plans Comparison */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {t('billing.plans.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              withBorder
              padding="lg"
              radius="md"
              className={plan.highlighted ? 'ring-2 ring-blue-500' : ''}
            >
              {plan.highlighted && (
                <Badge
                  color="blue"
                  className="absolute top-4 right-4"
                >
                  {t('billing.plans.popular')}
                </Badge>
              )}
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-900">
                    {plan.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-900">
                    ${plan.price}
                  </span>
                  <span className="text-slate-500">
                    /{plan.interval}
                  </span>
                </div>

                <Divider className="mb-4" />

                <ul className="space-y-2 flex-1 mb-4">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        feature.included ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      <Check
                        size={16}
                        className={feature.included ? 'text-green-500' : 'text-slate-300'}
                      />
                      {feature.name}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.id === currentPlan?.id ? 'light' : plan.highlighted ? 'filled' : 'outline'}
                  color="blue"
                  fullWidth
                  disabled={plan.id === currentPlan?.id}
                  rightSection={plan.id !== currentPlan?.id && <ArrowUpRight size={16} />}
                >
                  {plan.id === currentPlan?.id
                    ? t('billing.plans.current')
                    : t('billing.plans.upgrade')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card withBorder padding="lg" radius="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {t('billing.payment_method.title')}
            </h3>
            <Button variant="subtle" size="xs">
              {t('billing.payment_method.update')}
            </Button>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <ThemeIcon size={44} radius="md" variant="light" color="gray">
              <CreditCard size={22} />
            </ThemeIcon>
            <div>
              <p className="text-sm font-medium text-slate-900">
                •••• •••• •••• 4242
              </p>
              <p className="text-xs text-slate-500">
                Expires 12/2028
              </p>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card withBorder padding="lg" radius="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {t('billing.history.title')}
            </h3>
            <Button variant="subtle" size="xs" rightSection={<Download size={14} />}>
              {t('billing.history.download_all')}
            </Button>
          </div>

          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ThemeIcon size={32} radius="md" variant="light" color="gray">
                    <Calendar size={16} />
                  </ThemeIcon>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {invoice.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    ${invoice.amount.toFixed(2)}
                  </span>
                  <Badge
                    color={invoice.status === 'paid' ? 'green' : 'yellow'}
                    variant="light"
                    size="sm"
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}













