import React, { useEffect, useState, useCallback } from 'react';
import { SidebarExtensionSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import {
  Stack,
  Note,
  Heading,
  List,
  ListItem,
} from '@contentful/f36-components';
import { ProjectType, ValidationResult } from '../types';
import { validateMemberRole } from '../validation';

const Sidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>();
  useAutoResizer();

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    projectType: null,
    memberCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if this is a Projects content type
  const contentTypeId = sdk.contentType.sys.id;
  const isProjectsContentType = contentTypeId === 'projects';

  const validateProject = useCallback(async () => {
    // Only validate if this is a Projects content type
    if (!isProjectsContentType) {
      return;
    }

    setIsLoading(true);

    try {
      const entry = sdk.entry;

      // Get project type
      const projectType = entry.fields.projectType?.getValue() as
        | ProjectType
        | undefined;

      if (!projectType) {
        setValidationResult({
          isValid: true,
          errors: [],
          projectType: null,
          memberCount: 0,
        });
        setIsLoading(false);
        return;
      }

      // Get members
      const members = entry.fields.members?.getValue() as
        | Array<{ sys: { id: string } }>
        | undefined;

      if (!members || members.length === 0) {
        setValidationResult({
          isValid: true,
          errors: [],
          projectType,
          memberCount: 0,
        });
        setIsLoading(false);
        return;
      }

      // Validate each member
      const errors = [];

      for (const memberLink of members) {
        try {
          // Fetch member entry
          const memberEntry = await sdk.space.getEntry(memberLink.sys.id);
          const memberRole = memberEntry.fields.role?.[sdk.locales.default] as
            | string
            | undefined;
          const memberTitle = memberEntry.fields.title?.[
            sdk.locales.default
          ] as string | undefined;

          if (memberRole) {
            const error = validateMemberRole(
              memberLink.sys.id,
              memberTitle,
              memberRole,
              projectType,
            );

            if (error) {
              errors.push(error);
            }
          }
        } catch (err) {
          console.error(`Error fetching member ${memberLink.sys.id}:`, err);
        }
      }

      setValidationResult({
        isValid: errors.length === 0,
        errors,
        projectType,
        memberCount: members.length,
      });
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, isProjectsContentType]);

  useEffect(() => {
    // Initial validation
    validateProject();

    // Listen for changes to projectType field
    const unsubscribeType = sdk.entry.fields.projectType?.onValueChanged(() => {
      validateProject();
    });

    // Listen for changes to members field
    const unsubscribeMembers = sdk.entry.fields.members?.onValueChanged(() => {
      validateProject();
    });

    return () => {
      unsubscribeType?.();
      unsubscribeMembers?.();
    };
  }, [sdk, validateProject]);

  const renderStatus = () => {
    if (isLoading) {
      return (
        <Note variant="primary" title="Validating...">
          Checking project member roles...
        </Note>
      );
    }

    if (!validationResult.projectType) {
      return (
        <Note variant="warning" title="No Project Type">
          Please select a project type to validate member roles.
        </Note>
      );
    }

    if (validationResult.memberCount === 0) {
      return (
        <Note variant="neutral" title="No Members">
          No members have been added to this project yet.
        </Note>
      );
    }

    if (validationResult.isValid) {
      return (
        <Note variant="positive" title="All Roles Valid ✓">
          All {validationResult.memberCount} member
          {validationResult.memberCount !== 1 ? 's have' : ' has'} valid roles
          for project type: <strong>{validationResult.projectType}</strong>
        </Note>
      );
    }

    return (
      <Stack flexDirection="column" spacing="spacingS">
        <Note variant="negative" title="Invalid Member Roles Found">
          <Stack flexDirection="column" spacing="spacingS">
            <div>
              Found {validationResult.errors.length} invalid role
              {validationResult.errors.length !== 1 ? 's' : ''} for project
              type: <strong>{validationResult.projectType}</strong>
            </div>

            <Stack flexDirection="column" spacing="spacingM">
              {validationResult.errors.map((error, index: number) => (
                <div key={error.memberId || index}>
                  <Heading as="h4" marginBottom="spacingXs">
                    {error.memberTitle || `Member ${index + 1}`}
                  </Heading>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Current role:</strong> {error.currentRole}
                  </div>
                  <div>
                    <strong>
                      Allowed roles for {validationResult.projectType}:
                    </strong>
                    <List style={{ marginTop: '4px', marginLeft: '20px' }}>
                      {error.allowedRoles.map((role: string) => (
                        <ListItem key={role}>{role}</ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              ))}
            </Stack>
          </Stack>
        </Note>
      </Stack>
    );
  };

  // Don't render anything if this is not a Projects content type
  if (!isProjectsContentType) {
    return null;
  }

  return (
    <Stack flexDirection="column" spacing="spacingM" padding="spacingM">
      {renderStatus()}
    </Stack>
  );
};

export default Sidebar;
