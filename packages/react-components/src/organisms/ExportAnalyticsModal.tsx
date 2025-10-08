import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  metricsExportMap,
  MetricExportKeys,
  TimeRangeOption,
  timeRangeOptions,
} from '@asap-hub/model';
import { Button } from '../atoms';
import { paddingStyles } from '../card';
import { crossIcon, uploadIcon } from '../icons';
import {
  FormSection,
  LabeledCheckboxGroup,
  LabeledDropdown,
  Modal,
} from '../molecules';
import { mobileScreen, rem } from '../pixels';
import { Title, Option } from './CheckboxGroup';

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: rem(30),
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const confirmButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});

const dismissButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});

const optionsToExport: ReadonlyArray<Option<string> | Title> = [
  { title: 'RESOURCE & DATA SHARING' },
  { label: metricsExportMap['user-productivity'], value: 'user-productivity' },
  { label: metricsExportMap['team-productivity'], value: 'team-productivity' },

  { title: 'COLLABORATION' },
  {
    label: metricsExportMap['user-collaboration-within'],
    value: 'user-collaboration-within',
  },
  {
    label: metricsExportMap['user-collaboration-across'],
    value: 'user-collaboration-across',
  },
  {
    label: metricsExportMap['team-collaboration-within'],
    value: 'team-collaboration-within',
  },
  {
    label: metricsExportMap['team-collaboration-across'],
    value: 'team-collaboration-across',
  },

  {
    title: 'LEADERSHIP & MEMBERSHIP',
    info: 'Leadership & Membership metrics can only be exported with their current status.',
  },
  { label: metricsExportMap['wg-leadership'], value: 'wg-leadership' },
  { label: metricsExportMap['ig-leadership'], value: 'ig-leadership' },

  { title: 'ENGAGEMENT' },
  { label: metricsExportMap.engagement, value: 'engagement' },
];
export type ExportAnalyticsModalData = {
  timeRange: TimeRangeOption;
  metrics: Set<MetricExportKeys>;
};

type ExportAnalyticsModalProps = {
  onDismiss: () => void;
  onDownload: (
    timeRange: ExportAnalyticsModalData['timeRange'],
    metrics: ExportAnalyticsModalData['metrics'],
  ) => Promise<void>;
};
const ExportAnalyticsModal: React.FC<ExportAnalyticsModalProps> = ({
  onDismiss,
  onDownload,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const methods = useForm<ExportAnalyticsModalData>({
    mode: 'onBlur',
    defaultValues: {
      timeRange: undefined,
      metrics: new Set(),
    },
  });

  const dataRange = useMemo(
    () =>
      Object.entries(timeRangeOptions).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

  const {
    control,
    formState: { isSubmitting },
    watch,
    getValues,
    setValue,
  } = methods;

  const isExportEnabled = !!watch('timeRange') && watch('metrics').size > 0;

  const handleMetricsSelection = (newValue: MetricExportKeys) => {
    const metricsSet = getValues('metrics');
    if (metricsSet.has(newValue)) {
      metricsSet.delete(newValue);
    } else {
      metricsSet.add(newValue);
    }
    setValue('metrics', metricsSet);
  };

  const handleExport = async () => {
    const timeRange = getValues('timeRange');
    const metrics = getValues('metrics');
    setIsDownloading(true);
    await onDownload(timeRange, metrics);
    setIsDownloading(false);
    onDismiss();
  };

  const isDisabled = isSubmitting || isDownloading;
  return (
    <Modal padding={false}>
      <>
        <form css={contentStyles}>
          <FormSection
            title="Export XLSX"
            headerDecorator={
              <Button small noMargin onClick={onDismiss}>
                {crossIcon}
              </Button>
            }
          >
            <FormSection>
              <Controller
                name="timeRange"
                control={control}
                rules={{
                  required: 'Please select an option.',
                }}
                render={({ field: { value, onChange } }) => (
                  <LabeledDropdown
                    name="Time Range"
                    title="Select data range"
                    subtitle="(required)"
                    options={dataRange}
                    required
                    enabled={!isDisabled}
                    placeholder="Choose a data range"
                    value={value ?? ''}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="metrics"
                control={control}
                rules={{
                  required: 'Please select an option.',
                }}
                render={({ field: { value }, fieldState: { error } }) => (
                  <LabeledCheckboxGroup
                    title="Select metrics to export"
                    subtitle="(required)"
                    description="You need to select at least one metric."
                    onChange={(newValue) =>
                      handleMetricsSelection(newValue as MetricExportKeys)
                    }
                    values={value}
                    validationMessage={error?.message ?? ''}
                    options={optionsToExport.map((item) => {
                      if ('title' in item) {
                        return {
                          title: item.title,
                          info: item.info,
                        };
                      }

                      return {
                        value: item?.value,
                        label: item.label,
                        enabled: !isDisabled,
                      };
                    })}
                  />
                )}
              />
            </FormSection>
          </FormSection>
        </form>
        <div css={[paddingStyles, { paddingTop: 0 }]}>
          <div css={buttonContainerStyles}>
            <div css={dismissButtonStyles}>
              <Button enabled onClick={onDismiss}>
                Cancel
              </Button>
            </div>
            <div css={confirmButtonStyles}>
              <Button
                noMargin
                primary
                enabled={isExportEnabled && !isDisabled}
                onClick={handleExport}
                overrideStyles={css({ height: 'fit-content' })}
              >
                {uploadIcon} {isDownloading ? 'Exporting...' : 'Export XLSX'}
              </Button>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ExportAnalyticsModal;
