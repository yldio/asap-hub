import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  List,
  ListItem,
  TextInput,
} from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const regex =
  '^(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$';
type AdditionalMaterialType = {
  title: string;
  url: string;
};
const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const newEmptyAdditionalMaterial = {
    title: '',
    url: '',
  };
  const [newAdditionalMaterial, setNewAdditionalMaterial] = useState(
    newEmptyAdditionalMaterial,
  );
  const [additionalMaterials, setAdditionalMaterials] = useState(
    sdk.field.getValue() || [],
  );

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  const updateFieldValue = () => {
    const isValidURL = Boolean(newAdditionalMaterial.url.match(regex));
    if (!!newAdditionalMaterial.title && isValidURL) {
      const newValue = [...additionalMaterials, newAdditionalMaterial];
      setAdditionalMaterials(newValue);
      sdk.field.setValue(newValue);
      setNewAdditionalMaterial(newEmptyAdditionalMaterial);
    } else if (!isValidURL) {
      sdk.notifier.error('Invalid URL in Additional Materials');
    } else if (!newAdditionalMaterial.title) {
      sdk.notifier.error(
        'A not empty title is required in Additional Materials',
      );
    }
  };

  const removeFieldValue = (obj: AdditionalMaterialType) => {
    const remainingValues = additionalMaterials.filter(
      (json: AdditionalMaterialType) =>
        json.title !== obj.title && json.url !== obj.url,
    );
    setAdditionalMaterials(remainingValues);
    sdk.field.setValue(remainingValues);
  };

  return (
    <>
      <List style={{ marginBottom: '2rem' }}>
        {additionalMaterials.map((obj: AdditionalMaterialType) => (
          <ListItem key={obj.title}>
            <Flex
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {obj.title} - {obj.url}
              <Button
                variant="negative"
                size="small"
                onClick={() => removeFieldValue(obj)}
                style={{ marginTop: '1rem' }}
              >
                Remove
              </Button>
            </Flex>
          </ListItem>
        ))}
      </List>

      <FormControl.Label htmlFor="title">Title</FormControl.Label>
      <TextInput
        value={newAdditionalMaterial.title}
        onChange={(e) =>
          setNewAdditionalMaterial({
            ...newAdditionalMaterial,
            title: e.target.value,
          })
        }
        name="title"
        id="title"
      />
      <FormControl.Label htmlFor="url" style={{ marginTop: '0.5rem' }}>
        URL
      </FormControl.Label>
      <TextInput
        value={newAdditionalMaterial.url}
        onChange={(e) =>
          setNewAdditionalMaterial({
            ...newAdditionalMaterial,
            url: e.target.value,
          })
        }
        name="url"
        id="url"
      />

      <Button
        isFullWidth
        variant="positive"
        style={{ marginTop: '2rem' }}
        onClick={updateFieldValue}
      >
        Add
      </Button>
    </>
  );
};

export default Field;
