import { FieldAppSDK } from '@contentful/app-sdk';
import { Stack, Select } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState, useMemo } from 'react';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const [shouldShowField, setShouldShowField] = useState(false);
  const [roleValue, setRoleValue] = useState<string>(
    sdk.field.getValue() || '',
  );
  const [savedRoleValue, setSavedRoleValue] = useState<string>('');

  // Get role options from field validations
  const roleOptions = useMemo(() => {
    const validations = sdk.field.validations || [];
    const inValidation = validations.find((validation) => 'in' in validation);
    if (inValidation && 'in' in inValidation) {
      return (inValidation.in || []).filter(
        (item): item is string => typeof item === 'string',
      );
    }
    return [];
  }, [sdk.field]);

  useEffect(() => {
    const checkProjectMemberType = async () => {
      const fieldType = sdk.field.type;
      const fieldId = sdk.field.id;

      if (fieldType !== 'Symbol' || fieldId !== 'role') {
        return;
      }

      // Get the projectMember field
      const projectMemberField = sdk.entry.fields.projectMember;
      const projectMemberValue = projectMemberField?.getValue();

      if (!projectMemberValue) {
        // Disable field if no project member is selected
        setShouldShowField(false);
        // Save current role value before clearing
        const currentRole = sdk.field.getValue();
        if (currentRole) {
          setSavedRoleValue(currentRole);
          sdk.field.setValue(undefined);
          setRoleValue('');
        }
        sdk.window.startAutoResizer();
        return;
      }

      try {
        // Get the linked entry to determine its content type
        const linkedEntry = await sdk.space.getEntry(projectMemberValue.sys.id);
        const contentTypeId = linkedEntry.sys.contentType.sys.id;

        // Show field only if the linked entry is a user
        const isUser = contentTypeId === 'users';
        setShouldShowField(isUser);

        if (!isUser) {
          // Save current role value before clearing when a team is selected
          const currentRole = sdk.field.getValue();
          if (currentRole) {
            setSavedRoleValue(currentRole);
            sdk.field.setValue(undefined);
            setRoleValue('');
          }
        } else {
          // Restore saved role value when switching back to a user
          if (savedRoleValue && !sdk.field.getValue()) {
            sdk.field.setValue(savedRoleValue);
            setRoleValue(savedRoleValue);
          }
        }

        sdk.window.startAutoResizer();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching project member entry:', error);
        setShouldShowField(false);
        const currentRole = sdk.field.getValue();
        if (currentRole) {
          setSavedRoleValue(currentRole);
          sdk.field.setValue(undefined);
          setRoleValue('');
        }
        sdk.window.startAutoResizer();
      }
    };

    checkProjectMemberType();

    // Subscribe to changes in the projectMember field
    const projectMemberField = sdk.entry.fields.projectMember;
    const unsubscribe = projectMemberField?.onValueChanged(
      checkProjectMemberType,
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, savedRoleValue]);

  useEffect(() => {
    // Subscribe to field value changes to keep local state in sync
    const unsubscribeField = sdk.field.onValueChanged((value) => {
      setRoleValue(value || '');
    });

    return () => {
      unsubscribeField();
    };
  }, [sdk.field]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setRoleValue(newValue);
    sdk.field.setValue(newValue || undefined);
  };

  const renderFieldEditor = () => {
    const fieldType = sdk.field.type;
    const fieldId = sdk.field.id;

    if (fieldType === 'Symbol' && fieldId === 'role') {
      return (
        <div style={{ width: '100%' }}>
          <Select
            id={fieldId}
            name={fieldId}
            value={shouldShowField ? roleValue : ''}
            onChange={handleRoleChange}
            isDisabled={!shouldShowField}
          >
            <Select.Option value="">Choose a value</Select.Option>
            {roleOptions.map((role) => (
              <Select.Option key={role} value={role}>
                {role}
              </Select.Option>
            ))}
          </Select>
        </div>
      );
    }

    return null;
  };

  return (
    <Stack flexDirection="column" spacing="spacingS" alignItems="flex-start">
      {renderFieldEditor()}
    </Stack>
  );
};

export default Field;
