import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextInput,
} from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

type PositionProps = {
  readonly role: string;
  readonly department: string;
  readonly institution: string;
};

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  const newEmptyPosition = {
    role: '',
    department: '',
    institution: '',
  };
  const [newPosition, setNewPosition] = useState(newEmptyPosition);
  const [positions, setPositions] = useState(sdk.field.getValue());

  const removePosition = (position: PositionProps) => {
    const newValue = positions.filter((i: PositionProps) => i !== position);
    setPositions(newValue);
    if (newValue.length === 0) {
      sdk.field.setValue(undefined);
    }
  };

  const updateFieldValue = () => {
    if (newPosition.role && newPosition.department && newPosition.institution) {
      const duplicated = positions?.find(
        (position: PositionProps) =>
          position.role === newPosition.role &&
          position.department === newPosition.department &&
          position.institution === newPosition.institution,
      );
      if (duplicated) {
        sdk.notifier.error('Duplicated entry. Please add different values.');
      } else {
        const newValue = [...positions, newPosition];
        setPositions(newValue);
        sdk.field.setValue(newValue);
        setNewPosition(newEmptyPosition);
      }
    } else {
      sdk.notifier.error('All fields are required.');
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  return (
    <>
      <Table style={{ marginBottom: '2rem' }}>
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Institution</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        {positions?.length > 0 && (
          <TableBody>
            {positions.map((position: PositionProps) => (
              <TableRow
                key={position.role + position.department + position.institution}
              >
                <TableCell style={{ verticalAlign: 'middle' }}>
                  {position.role}
                </TableCell>
                <TableCell style={{ verticalAlign: 'middle' }}>
                  {position.department}
                </TableCell>
                <TableCell style={{ verticalAlign: 'middle' }}>
                  {position.institution}
                </TableCell>
                <TableCell>
                  <Button
                    variant="negative"
                    size="small"
                    onClick={() => removePosition(position)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {(!positions || positions.length < 3) && (
        <Card>
          <FormControl.Label htmlFor="role">Role</FormControl.Label>
          <TextInput
            value={newPosition.role}
            onChange={(e) =>
              setNewPosition({
                ...newPosition,
                role: e.target.value,
              })
            }
            name="role"
            id="role"
          />
          <FormControl.Label
            htmlFor="department"
            style={{ marginTop: '0.5rem' }}
          >
            Department
          </FormControl.Label>
          <TextInput
            value={newPosition.department}
            onChange={(e) =>
              setNewPosition({
                ...newPosition,
                department: e.target.value,
              })
            }
            name="department"
            id="department"
          />
          <FormControl.Label
            htmlFor="institution"
            style={{ marginTop: '0.5rem' }}
          >
            Institution
          </FormControl.Label>
          <TextInput
            value={newPosition.institution}
            onChange={(e) =>
              setNewPosition({
                ...newPosition,
                institution: e.target.value,
              })
            }
            name="institution"
            id="institution"
          />

          <Button
            isFullWidth
            variant="positive"
            size="small"
            onClick={() => updateFieldValue()}
            style={{ marginTop: '1rem' }}
          >
            Add
          </Button>
        </Card>
      )}
    </>
  );
};

export default Field;
